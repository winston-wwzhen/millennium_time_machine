<template>
  <div class="dashboard">
    <el-row :gutter="20" v-loading="loading">
      <!-- 用户统计卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.users?.total || 0 }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-change" :class="{ up: stats.users?.growth > 0, down: stats.users?.growth < 0 }">
              今日 +{{ stats.users?.todayNew || 0 }}
              <span v-if="stats.users?.growth !== 0">({{ stats.users?.growth > 0 ? '+' : '' }}{{ stats.users?.growth }}%)</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 活跃用户卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.qcio?.total || 0 }}</div>
            <div class="stat-label">QCIO 用户</div>
            <div class="stat-change up">
              今日活跃 {{ stats.qcio?.todayActive || 0 }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 聊天统计卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ formatNumber(stats.chats?.total) || 0 }}</div>
            <div class="stat-label">聊天总数</div>
            <div class="stat-change up">
              今日 +{{ stats.chats?.today || 0 }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 彩蛋统计卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.eggs?.totalDiscovered || 0 }}</div>
            <div class="stat-label">彩蛋发现</div>
            <div class="stat-change up">
              今日 +{{ stats.eggs?.todayDiscovered || 0 }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行卡片 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 访问统计卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.visits?.total || 0 }}</div>
            <div class="stat-label">空间访问总数</div>
            <div class="stat-change up">
              今日 +{{ stats.visits?.today || 0 }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 时光币卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ formatNumber(stats.currency?.totalCoins) || 0 }}</div>
            <div class="stat-label">时光币总量</div>
            <div class="stat-sub">
              人均 {{ Math.floor((stats.currency?.totalCoins || 0) / (stats.users?.total || 1)) }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 网费卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ formatNumber(stats.currency?.totalNetFee) || 0 }}</div>
            <div class="stat-label">网费总量(分钟)</div>
            <div class="stat-sub">
              人均 {{ Math.floor((stats.currency?.totalNetFee || 0) / (stats.users?.total || 1)) }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 用户增长趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势（近7天）</span>
            </div>
          </template>
          <v-chart :option="growthChartOption" style="height: 280px" autoresize />
        </el-card>
      </el-col>

      <!-- 活动分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>每日活动分布（近7天）</span>
            </div>
          </template>
          <v-chart :option="activityChartOption" style="height: 280px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时活动日志 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>实时活动日志</span>
              <el-button text type="primary" @click="refreshLogs">刷新</el-button>
            </div>
          </template>
          <el-table :data="logs" style="width: 100%" max-height="300" v-loading="logsLoading">
            <el-table-column prop="createdAt" label="时间" width="170">
              <template #default="{ row }">
                {{ formatTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="120">
              <template #default="{ row }">
                <el-tag :type="getActionTagType(row.action)" size="small">
                  {{ getActionLabel(row.action) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="data" label="详情">
              <template #default="{ row }">
                {{ getActivityDetail(row) }}
              </template>
            </el-table-column>
            <el-table-column prop="_openid" label="用户" width="120">
              <template #default="{ row }">
                {{ maskOpenid(row._openid) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { getDashboardStats, getGrowthTrend, getRecentActivity } from '../api/admin'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const loading = ref(false)
const logsLoading = ref(false)

const stats = ref({
  users: { total: 0, todayNew: 0, growth: 0 },
  qcio: { total: 0, todayActive: 0 },
  chats: { total: 0, today: 0 },
  visits: { total: 0, today: 0 },
  eggs: { totalDiscovered: 0, todayDiscovered: 0 },
  currency: { totalCoins: 0, totalNetFee: 0 }
})

const growthTrend = ref([])
const logs = ref([])

// 增长趋势图表配置
const growthChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增用户', '活跃用户']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: growthTrend.value.map(d => d.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      data: growthTrend.value.map(d => d.newUsers),
      smooth: true,
      itemStyle: { color: '#409EFF' }
    },
    {
      name: '活跃用户',
      type: 'line',
      data: growthTrend.value.map(d => d.activeUsers),
      smooth: true,
      itemStyle: { color: '#67C23A' }
    }
  ]
}))

// 活动分布图表配置
const activityChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['新增聊天', '空间访问']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: growthTrend.value.map(d => d.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增聊天',
      type: 'bar',
      data: growthTrend.value.map(d => d.newChats),
      itemStyle: { color: '#E6A23C' }
    },
    {
      name: '空间访问',
      type: 'bar',
      data: growthTrend.value.map(d => d.newVisits),
      itemStyle: { color: '#909399' }
    }
  ]
}))

// 格式化数字
function formatNumber(num) {
  if (!num) return 0
  return num.toLocaleString()
}

// 格式化时间
function formatTime(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 脱敏 openid
function maskOpenid(openid) {
  if (!openid) return '-'
  return openid.substring(0, 8) + '***'
}

// 获取操作类型标签
function getActionLabel(action) {
  const labels = {
    egg_discovered: '发现彩蛋',
    daily_login: '每日登录',
    share: '分享内容',
    visit_space: '访问空间',
    chat: '发送消息'
  }
  return labels[action] || action
}

// 获取操作类型标签颜色
function getActionTagType(action) {
  const types = {
    egg_discovered: 'success',
    daily_login: 'info',
    share: 'warning',
    visit_space: 'primary',
    chat: ''
  }
  return types[action] || 'info'
}

// 获取活动详情
function getActivityDetail(row) {
  if (row.action === 'egg_discovered') {
    return `发现彩蛋：${row.data?.egg?.name || '-'} (${row.data?.egg?.rarity || '-'})`
  }
  if (row.data?.description) {
    return row.data.description
  }
  return '-'
}

// 加载统计数据
async function loadStats() {
  loading.value = true
  try {
    const [statsData, trendData] = await Promise.all([
      getDashboardStats(),
      getGrowthTrend(7)
    ])
    stats.value = statsData
    growthTrend.value = trendData
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载活动日志
async function loadLogs() {
  logsLoading.value = true
  try {
    logs.value = await getRecentActivity(30)
  } catch (error) {
    console.error('加载活动日志失败:', error)
  } finally {
    logsLoading.value = false
  }
}

// 刷新日志
function refreshLogs() {
  loadLogs()
}

onMounted(() => {
  loadStats()
  loadLogs()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  padding: 10px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 12px;
  color: #909399;
}

.stat-change.up {
  color: #67c23a;
}

.stat-change.down {
  color: #f56c6c;
}

.stat-sub {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
