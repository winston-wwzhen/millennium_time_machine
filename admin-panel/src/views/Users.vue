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
            @clear="handleSearch"
            @keyup.enter="handleSearch"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%" v-loading="loading" @sort-change="handleSortChange">
        <el-table-column prop="_openid" label="OpenID" width="350">
          <template #default="{ row }">
            <span class="openid-text">{{ row._openid || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="QCIO昵称" width="180" sortable="custom">
          <template #default="{ row }">
            {{ row.qcioUser?.avatarName || row.qcioUser?.nickname || row.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="qcio_id" label="QCIO ID" width="120" sortable="custom">
          <template #default="{ row }">
            {{ row.qcioUser?.qcio_id || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="coins" label="时光币" width="130" align="right" sortable="custom">
          <template #default="{ row }">
            {{ formatNumber(row.coins) }}
          </template>
        </el-table-column>
        <el-table-column prop="netFee" label="网费(分钟)" width="140" align="right" sortable="custom">
          <template #default="{ row }">
            {{ formatNumber(row.netFee) }}
          </template>
        </el-table-column>
        <el-table-column prop="badges" label="彩蛋" width="90" align="center" sortable="custom">
          <template #default="{ row }">
            {{ row.badges?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="aiHelpLetterOpened" label="AI求救信" width="110" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.aiHelpLetterOpened ? 'success' : 'info'" size="small">
              {{ row.aiHelpLetterOpened ? '已发现' : '未发现' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" sortable="custom">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" sortable="custom">
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
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
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
  sortBy: 'lastLoginTime',
  sortOrder: 'desc'
})

const loadUsers = async () => {
  loading.value = true
  try {
    const result = await getUserList(searchParams)
    users.value = result.list || []
    total.value = result.total || 0
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

const handlePageChange = (page) => {
  searchParams.page = page
  loadUsers()
}

const handlePageSizeChange = (pageSize) => {
  searchParams.page = 1
  searchParams.limit = pageSize
  loadUsers()
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

const handleSortChange = ({ prop, order }) => {
  if (order) {
    searchParams.sortBy = prop
    searchParams.sortOrder = order === 'ascending' ? 'asc' : 'desc'
  } else {
    searchParams.sortBy = 'createTime'
    searchParams.sortOrder = 'desc'
  }
  loadUsers()
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

.openid-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
}
</style>
