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
            v-model="searchText"
            placeholder="输入昵称搜索"
            clearable
            @clear="loadUsers"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="nickname" label="昵称" width="150">
          <template #default="{ row }">
            {{ maskNickname(row.nickname) }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="100" />
        <el-table-column prop="qpoints" label="Q点" width="120" />
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column prop="lastActive" label="最后活跃" width="180" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top: 20px; justify-content: center"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '../api/users'

const loading = ref(false)
const searchText = ref('')
const users = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const loadUsers = async () => {
  loading.value = true
  try {
    const data = await getUsers({
      page: page.value,
      pageSize: pageSize.value,
      search: searchText.value
    })
    users.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('加载用户失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  loadUsers()
}

const handlePageChange = (p) => {
  page.value = p
  loadUsers()
}

const maskNickname = (nickname) => {
  if (!nickname) return '***'
  return nickname.substring(0, 3) + '***'
}

const viewDetail = (user) => {
  console.log('查看详情', user)
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
