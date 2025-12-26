#!/usr/bin/env node

/**
 * 云函数 HTTP API 部署脚本
 */

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'

// 从 admin-panel/.env 读取配置
const envPath = path.join(process.cwd(), 'admin-panel', '.env')
dotenv.config({ path: envPath })

const APPID = process.env.WECHAT_APPID
const SECRET = process.env.WECHAT_APPSECRET
const ENV_ID = process.env.CLOUDBASE_ENV_ID

if (!APPID || !SECRET || !ENV_ID) {
  console.error('错误: 缺少环境变量配置')
  process.exit(1)
}

let accessToken = null

// 获取 access_token
async function getAccessToken() {
  try {
    const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: APPID,
        secret: SECRET
      }
    })

    if (response.data.access_token) {
      console.log('✓ Access token 获取成功')
      return response.data.access_token
    } else {
      throw new Error(response.data.errmsg || '获取 access_token 失败')
    }
  } catch (error) {
    console.error('获取 access_token 失败:', error.message)
    throw error
  }
}

// 上传文件到云存储
async function uploadFile(token, filePath) {
  try {
    // 1. 获取上传 URL
    const uploadUrlResponse = await axios.post(
      `https://api.weixin.qq.com/tcb/uploadfile?access_token=${token}`,
      {
        env: ENV_ID,
        path: `cloudfunctions/${Date.now()}.zip`
      }
    )

    if (uploadUrlResponse.data.errcode !== 0) {
      throw new Error(uploadUrlResponse.data.errmsg)
    }

    // 响应直接包含 url, token, authorization
    const { url, token: uploadToken, authorization, file_id } = uploadUrlResponse.data
    if (!url) {
      throw new Error('上传URL获取失败')
    }

    console.log('✓ 获取上传 URL 成功')

    // 2. 上传文件
    const fileBuffer = fs.readFileSync(filePath)
    const formData = new FormData()
    formData.append('file', fileBuffer, 'function.zip')
    formData.append('authorization', authorization)
    formData.append('token', uploadToken)

    const uploadResponse = await axios.post(url, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    })

    console.log('✓ 文件上传成功')
    return file_id  // 返回 cloud:// 路径
  } catch (error) {
    console.error('上传文件失败:', error.message)
    throw error
  }
}

// 创建云函数
async function createCloudFunction(token, functionName) {
  try {
    const response = await axios.post(
      `https://api.weixin.qq.com/tcb/createcloudfunction?access_token=${token}`,
      {
        env: ENV_ID,
        name: functionName
      }
    )

    if (response.data.errcode === 0) {
      console.log('✓ 云函数创建成功')
      return true
    }

    // 如果已存在，也算成功
    if (response.data.errcode === -501001) {
      console.log('✓ 云函数已存在')
      return true
    }

    throw new Error(response.data.errmsg || '创建云函数失败')
  } catch (error) {
    console.error('创建云函数失败:', error.message)
    throw error
  }
}

// 上传并部署云函数代码
async function deployCloudFunction(token, functionName, codeZipPath) {
  try {
    // 读取 zip 文件
    const fileBuffer = fs.readFileSync(codeZipPath)
    const base64Code = fileBuffer.toString('base64')

    // 使用 API 直接上传代码
    const response = await axios.post(
      `https://api.weixin.qq.com/tcb/updatecloudfunction?access_token=${token}`,
      {
        env: ENV_ID,
        name: functionName,
        code: {
          source_zip: base64Code
        }
      }
    )

    if (response.data.errcode === 0) {
      console.log('✓ 云函数代码更新成功')
      return true
    }

    throw new Error(response.data.errmsg || '更新代码失败')
  } catch (error) {
    console.error('部署云函数代码失败:', error.message)
    throw error
  }
}

// 主函数
async function main() {
  try {
    console.log('\n========== 云函数部署 ==========')
    console.log(`环境 ID: ${ENV_ID}`)
    console.log(`函数名: admin-stats`)

    // 1. 获取 access_token
    accessToken = await getAccessToken()

    // 2. 创建云函数（如果不存在）
    await createCloudFunction(accessToken, 'admin-stats')

    // 3. 上传并部署代码
    const zipPath = './cloudfunctions/admin-stats/admin-stats.zip'
    if (!fs.existsSync(zipPath)) {
      throw new Error('代码包不存在，请先构建')
    }

    await deployCloudFunction(accessToken, 'admin-stats', zipPath)

    console.log('\n✅ 部署成功!')
    console.log('================================\n')
  } catch (error) {
    console.error('\n❌ 部署失败:', error.message)
    process.exit(1)
  }
}

main()
