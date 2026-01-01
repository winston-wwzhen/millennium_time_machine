<template>
  <div class="users">
    <el-card shadow="hover">
      <template #header>
        <div class="header">
          <span>用户管理</span>
          <el-button type="primary" size="small" @click="loadUsers">刷新</el-button>
        </div>
      </template>

      <!-- 搜索 -->
      <el-form :inline="true" style="margin-bottom: 20px">
        <el-form-item label="搜索">
          <el-input
            v-model="searchParams.keyword"
            placeholder="输入昵称搜索"
            clearable
            @clear="loadUsers"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="_openid" label="OpenID" width="120">
          <template #default="{ row }">
            {{ maskOpenid(row._openid) }}
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="150">
          <template #default="{ row }">
            {{ row.nickname || row.qcioProfile?.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="qcioProfile.qcio_id" label="QCIO ID" width="100">
          <template #default="{ row }">
            {{ row.qcioProfile?.qcio_id || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="coins" label="时光币" width="100" align="right" sortable>
          <template #default="{ row }">
            {{ formatNumber(row.coins) }}
          </template>
        </el-table-column>
        <el-table-column prop="netFee" label="网费(分钟)" width="120" align="right" sortable>
          <template #default="{ row }">
            {{ formatNumber(row.netFee) }}
          </template>
        </el-table-column>
        <el-table-column prop="eggStats.eggsDiscovered" label="彩蛋" width="80" align="center" sortable>
          <template #default="{ row }">
            {{ row.eggStats?.eggsDiscovered || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="170">
          <template #default="{ row }">
            {{ formatTime(row.lastLoginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.limit"
        :page-sizes="[20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        style="margin-top: 20px; justify-content: center"
        @size-change="loadUsers"
        @current-change="loadUsers"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserList } from '../api/admin'

const router = useRouter()
const loading = ref(false)
const users = ref([])
const total = ref(0)

const searchParams = reactive({
  keyword: '',
  page: 1,
  limit: 20,
  sortBy: 'createTime',
  sortOrder: 'desc'
})

const loadUsers = async () => {
  loading.value = true
  try {
    const data = await getUserList(searchParams)
    users.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('加载用户失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchParams.page = 1
  loadUsers()
}

const resetSearch = () => {
  searchParams.keyword = ''
  searchParams.page = 1
  loadUsers()
}

function maskOpenid(openid) {
  if (!openid) return '-'
  return openid.substring(0, 8) + '***'
}

function formatNumber(num) {
  if (!num) return 0
  return num.toLocaleString()
}

function formatTime(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN')
}

const viewDetail = (user) => {
  router.push({
    path: '/user/detail',
    query: { openid: user._openid }
  })
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
