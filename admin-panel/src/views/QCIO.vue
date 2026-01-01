<template>
  <div class="qcio-page">
    <el-tabs v-model="activeTab">
      <!-- 用户列表 -->
      <el-tab-pane label="QCIO 用户" name="users">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>QCIO 用户列表</span>
              <el-input
                v-model="userSearch.keyword"
                placeholder="搜索昵称或QCIO ID"
                clearable
                style="width: 250px"
                @clear="loadQCIOUsers"
                @keyup.enter="loadQCIOUsers"
              >
                <template #append>
                  <el-button icon="Search" @click="loadQCIOUsers" />
                </template>
              </el-input>
            </div>
          </template>

          <el-table :data="qcioUsers" style="width: 100%" v-loading="usersLoading">
            <el-table-column prop="qcio_id" label="QCIO ID" width="100" />
            <el-table-column prop="nickname" label="昵称" width="150">
              <template #default="{ row }">
                {{ row.nickname || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="level" label="等级" width="80" align="center" sortable>
              <template #default="{ row }">
                <el-tag type="primary">Lv.{{ row.level || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="experience" label="经验值" width="100" align="right" sortable />
            <el-table-column prop="signature" label="个性签名" show-overflow-tooltip />
            <el-table-column prop="updateTime" label="最后更新" width="170">
              <template #default="{ row }">
                {{ formatTime(row.updateTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="viewQCIOUser(row.qcio_id)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="userPagination.page"
            v-model:page-size="userPagination.limit"
            :page-sizes="[20, 50, 100]"
            :total="userPagination.total"
            layout="total, sizes, prev, pager, next"
            style="margin-top: 20px; justify-content: center"
            @size-change="loadQCIOUsers"
            @current-change="loadQCIOUsers"
          />
        </el-card>
      </el-tab-pane>

      <!-- 农场数据 -->
      <el-tab-pane label="农场管理" name="farm">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>农场统计</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="farm-stat">
                    <div class="stat-icon">🌾</div>
                    <div class="stat-details">
                      <div class="stat-label">农场主总数</div>
                      <div class="stat-value">{{ farmStats.totalFarmers || 0 }}</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="farm-stat">
                    <div class="stat-icon">🌱</div>
                    <div class="stat-details">
                      <div class="stat-label">正在种植</div>
                      <div class="stat-value">{{ farmStats.activePlots || 0 }}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <el-col :span="24" style="margin-top: 20px">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>农场操作日志</span>
                  <el-button size="small" @click="loadFarmLogs">刷新</el-button>
                </div>
              </template>
              <el-table :data="farmLogs" style="width: 100%" max-height="400">
                <el-table-column prop="qcio_id" label="QCIO ID" width="100" />
                <el-table-column prop="action" label="操作" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getFarmActionType(row.action)" size="small">
                      {{ row.action }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="details" label="详情" show-overflow-tooltip />
                <el-table-column prop="logTime" label="时间" width="170">
                  <template #default="{ row }">
                    {{ formatTime(row.logTime) }}
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-model:current-page="farmPagination.page"
                v-model:page-size="farmPagination.limit"
                :page-sizes="[20, 50, 100]"
                :total="farmPagination.total"
                layout="total, sizes, prev, pager, next"
                style="margin-top: 20px; justify-content: center"
                @size-change="loadFarmLogs"
                @current-change="loadFarmLogs"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 访问统计 -->
      <el-tab-pane label="访问统计" name="visits">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>空间访问统计</span>
              <div>
                <el-input
                  v-model="visitSearch.ownerQcioId"
                  placeholder="输入空间主人QCIO ID"
                  clearable
                  style="width: 200px; margin-right: 10px"
                />
                <el-button type="primary" @click="loadVisitHistory">查询</el-button>
              </div>
            </div>
          </template>

          <el-table :data="visitHistory" style="width: 100%" v-loading="visitsLoading">
            <el-table-column prop="owner_qcio_id" label="空间主人" width="120" />
            <el-table-column prop="totalVisits" label="总访问量" width="100" align="right" sortable />
            <el-table-column prop="recentVisitors" label="最近访客">
              <template #default="{ row }">
                <div class="visitor-list">
                  <el-tag v-for="visitor in (row.recentVisitors || []).slice(0, 3)" :key="visitor" size="small" style="margin: 2px">
                    {{ visitor }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="lastVisitTime" label="最后访问" width="170">
              <template #default="{ row }">
                {{ formatTime(row.lastVisitTime) }}
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="visitPagination.page"
            v-model:page-size="visitPagination.limit"
            :page-sizes="[20, 50, 100]"
            :total="visitPagination.total"
            layout="total, sizes, prev, pager, next"
            style="margin-top: 20px; justify-content: center"
            @size-change="loadVisitHistory"
            @current-change="loadVisitHistory"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- QCIO 用户详情对话框 -->
    <el-dialog v-model="userDetailVisible" title="QCIO 用户详情" width="60%">
      <div v-loading="userDetailLoading">
        <el-descriptions :column="2" border v-if="userDetail.user">
          <el-descriptions-item label="QCIO ID">{{ userDetail.user.qcio_id }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userDetail.user.nickname || '-' }}</el-descriptions-item>
          <el-descriptions-item label="等级">Lv.{{ userDetail.user.level || 0 }}</el-descriptions-item>
          <el-descriptions-item label="经验值">{{ userDetail.user.experience || 0 }}</el-descriptions-item>
          <el-descriptions-item label="个性签名" :span="2">{{ userDetail.user.signature || '-' }}</el-descriptions-item>

          <el-descriptions-item label="金币" v-if="userDetail.wallet">{{ userDetail.wallet.gold || 0 }}</el-descriptions-item>
          <el-descriptions-item label="Q点" v-if="userDetail.wallet">{{ userDetail.wallet.qpoints || 0 }}</el-descriptions-item>
        </el-descriptions>

        <!-- 成就列表 -->
        <div v-if="userDetail.achievements?.length" style="margin-top: 20px">
          <h4>已获得成就</h4>
          <div class="achievements-list">
            <el-tag v-for="achievement in userDetail.achievements" :key="achievement.achievementId" style="margin: 4px">
              {{ achievement.name }}
            </el-tag>
          </div>
        </div>

        <!-- 经验日志 -->
        <div v-if="userDetail.experience?.length" style="margin-top: 20px">
          <h4>最近获取经验</h4>
          <el-timeline>
            <el-timeline-item v-for="log in userDetail.experience.slice(0, 10)" :key="log._id" :timestamp="formatTime(log.timestamp)" placement="top">
              {{ log.action }} +{{ log.amount }} 经验
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getQCIOUserList,
  getQCIOUserDetail,
  getFarmStats,
  getFarmLogs,
  getVisitHistory
} from '../api/admin'

const activeTab = ref('users')
const usersLoading = ref(false)
const visitsLoading = ref(false)
const userDetailVisible = ref(false)
const userDetailLoading = ref(false)

const userSearch = reactive({ keyword: '' })
const userPagination = reactive({ page: 1, limit: 20, total: 0 })
const qcioUsers = ref([])

const farmStats = ref({ totalFarmers: 0, activePlots: 0 })
const farmPagination = reactive({ page: 1, limit: 20, total: 0 })
const farmLogs = ref([])

const visitSearch = reactive({ ownerQcioId: '' })
const visitPagination = reactive({ page: 1, limit: 20, total: 0 })
const visitHistory = ref([])

const userDetail = ref({
  user: null,
  wallet: null,
  achievements: [],
  experience: []
})

function formatTime(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN')
}

function getFarmActionType(action) {
  const types = {
    plant: 'success',
    harvest: 'warning',
    water: 'info',
    fertilize: 'primary'
  }
  return types[action] || 'info'
}

async function loadQCIOUsers() {
  usersLoading.value = true
  try {
    const data = await getQCIOUserList({
      keyword: userSearch.keyword,
      ...userPagination
    })
    qcioUsers.value = data.list || []
    userPagination.total = data.total || 0
  } catch (error) {
    console.error('加载 QCIO 用户失败:', error)
  } finally {
    usersLoading.value = false
  }
}

async function viewQCIOUser(qcioId) {
  userDetailVisible.value = true
  userDetailLoading.value = true
  try {
    const data = await getQCIOUserDetail(qcioId)
    userDetail.value = data
  } catch (error) {
    console.error('加载用户详情失败:', error)
  } finally {
    userDetailLoading.value = false
  }
}

async function loadFarmStats() {
  try {
    const data = await getFarmStats()
    farmStats.value = data
  } catch (error) {
    console.error('加载农场统计失败:', error)
  }
}

async function loadFarmLogs() {
  try {
    const data = await getFarmLogs({
      ...farmPagination
    })
    farmLogs.value = data.list || []
    farmPagination.total = data.total || 0
  } catch (error) {
    console.error('加载农场日志失败:', error)
  }
}

async function loadVisitHistory() {
  visitsLoading.value = true
  try {
    const data = await getVisitHistory({
      ownerQcioId: visitSearch.ownerQcioId || undefined,
      ...visitPagination
    })
    visitHistory.value = data.list || []
    visitPagination.total = data.total || 0
  } catch (error) {
    console.error('加载访问历史失败:', error)
  } finally {
    visitsLoading.value = false
  }
}

onMounted(() => {
  loadQCIOUsers()
  loadFarmStats()
  loadFarmLogs()
  loadVisitHistory()
})
</script>

<style scoped>
.qcio-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.farm-stat {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
}

.stat-details {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}

.visitor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.achievements-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
