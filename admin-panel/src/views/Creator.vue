<template>
  <div class="creator">
    <el-row :gutter="20">
      <!-- 排行榜海报生成 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>📊 排行榜海报生成</span>
          </template>

          <el-form :model="posterForm" label-width="100px">
            <el-form-item label="排行榜类型">
              <el-select v-model="posterForm.type">
                <el-option label="等级排行" value="level" />
                <el-option label="Q点排行" value="qpoints" />
                <el-option label="彩蛋发现" value="eggs" />
              </el-select>
            </el-form-item>

            <el-form-item label="展示数量">
              <el-select v-model="posterForm.topN">
                <el-option label="TOP10" :value="10" />
                <el-option label="TOP20" :value="20" />
                <el-option label="TOP50" :value="50" />
              </el-select>
            </el-form-item>

            <el-form-item label="海报风格">
              <el-select v-model="posterForm.style">
                <el-option label="怀旧风" value="retro" />
                <el-option label="简约风" value="minimal" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generatePoster" :loading="generating">
                生成海报
              </el-button>
            </el-form-item>
          </el-form>

          <div v-if="posterUrl" class="preview">
            <el-image :src="posterUrl" fit="contain" style="max-width: 100%" />
            <div class="actions">
              <el-button @click="downloadPoster">下载图片</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- AI文案生成 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>✨ AI文案生成</span>
          </template>

          <el-form :model="copyForm" label-width="100px">
            <el-form-item label="目标平台">
              <el-select v-model="copyForm.platform">
                <el-option label="小红书" value="xiaohongshu" />
                <el-option label="公众号" value="wechat" />
                <el-option label="微博" value="weibo" />
              </el-select>
            </el-form-item>

            <el-form-item label="内容类型">
              <el-select v-model="copyForm.type">
                <el-option label="排行榜" value="rank" />
                <el-option label="数据报告" value="stats" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generateCopy" :loading="generatingCopy">
                生成文案
              </el-button>
            </el-form-item>
          </el-form>

          <div v-if="generatedCopy" class="copy-result">
            <el-input v-model="generatedCopy.title" placeholder="标题" />
            <el-input
              v-model="generatedCopy.content"
              type="textarea"
              :rows="6"
              placeholder="正文"
              style="margin-top: 10px"
            />
            <el-button @click="copyText" style="margin-top: 10px">复制文案</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const posterForm = ref({
  type: 'level',
  topN: 10,
  style: 'retro'
})

const copyForm = ref({
  platform: 'xiaohongshu',
  type: 'rank'
})

const generating = ref(false)
const generatingCopy = ref(false)
const posterUrl = ref('')
const generatedCopy = ref(null)

const generatePoster = async () => {
  generating.value = true
  setTimeout(() => {
    posterUrl.value = 'https://via.placeholder.com/400x600'
    generating.value = false
    ElMessage.success('海报生成成功')
  }, 1000)
}

const generateCopy = async () => {
  generatingCopy.value = true
  setTimeout(() => {
    generatedCopy.value = {
      title: '千禧时光机排行榜来了！',
      content: '家人们！今天的排行榜出炉啦！\n\n🏆 等级最高的大神已经LV.28了！\n快来围观~',
      hashtags: '#千禧时光机 #排行榜'
    }
    generatingCopy.value = false
    ElMessage.success('文案生成成功')
  }, 1000)
}

const downloadPoster = () => {
  ElMessage.success('下载功能开发中')
}

const copyText = () => {
  const text = `${generatedCopy.value.title}\n\n${generatedCopy.value.content}`
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制到剪贴板')
}
</script>

<style scoped>
.creator {
  padding: 0;
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.actions {
  margin-top: 15px;
}

.copy-result {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
