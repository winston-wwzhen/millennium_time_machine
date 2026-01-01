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
            <div class="stat-value">{{ formatNumber(formatNetFeeDays(stats.currency?.totalNetFee)) || 0 }}</div>
            <div class="stat-label">网费总量(天)</div>
            <div class="stat-sub">
              人均 {{ formatNetFeeDays(Math.floor((stats.currency?.totalNetFee || 0) / (stats.users?.total || 1))) }} 天
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
          <el-table :data="logs" style="width: 100%" max-height="400" v-loading="logsLoading">
            <el-table-column prop="createdAt" label="时间" width="150">
              <template #default="{ row }">
                {{ formatTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作类型" width="110">
              <template #default="{ row }">
                <el-tag :type="getActionTagType(row.action)" size="small">
                  {{ getActionLabel(row.action) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="data" label="活动详情" min-width="300" show-overflow-tooltip>
              <template #default="{ row }">
                {{ getActivityDetail(row) }}
              </template>
            </el-table-column>
            <el-table-column prop="_openid" label="用户ID" width="150">
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

// 格式化网费：分钟转天数 (1440分钟 = 1天)
function formatNetFeeDays(minutes) {
  if (!minutes) return 0
  return (minutes / 1440).toFixed(1)
}

// 格式化时间
function formatTime(isoString) {
  if (!isoString) return '-'

  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 1分钟内显示"刚刚"
  if (diff < 60 * 1000) {
    return '刚刚'
  }

  // 1小时内显示"X分钟前"
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  }

  // 今天内显示"今天 HH:mm"
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (date >= todayStart) {
    return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  // 昨天显示"昨天 HH:mm"
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  if (date >= yesterdayStart) {
    return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  // 更早的显示完整日期时间
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 显示完整 openid
function maskOpenid(openid) {
  if (!openid) return '-'
  return openid
}

// 获取操作类型标签
function getActionLabel(action) {
  const labels = {
    egg_discovered: '发现彩蛋',
    daily_login: '每日登录',
    share: '分享内容',
    visit_space: '访问空间',
    chat: '发送消息',
    open: '打开',
    close: '关闭',
    click: '点击',
    exchange: '兑换',
    deduct: '扣除',
    login: '登录',
    logout: '退出'
  }
  return labels[action] || action || '未知操作'
}

// 获取操作类型标签颜色
function getActionTagType(action) {
  const types = {
    egg_discovered: 'success',
    daily_login: 'info',
    share: 'warning',
    visit_space: 'primary',
    chat: '',
    open: '',
    close: 'info',
    click: '',
    exchange: 'warning',
    deduct: 'danger',
    login: 'success',
    logout: 'info'
  }
  return types[action] || 'info'
}

// 获取活动详情
function getActivityDetail(row) {
  // 发现彩蛋
  if (row.action === 'egg_discovered') {
    return `发现彩蛋：${row.data?.egg?.name || '-'} (${row.data?.egg?.rarity || '-'})`
  }
  // 每日登录
  if (row.action === 'daily_login') {
    return `每日登录奖励`
  }
  // 访问空间
  if (row.action === 'visit_space') {
    const targetName = row.data?.targetName || row.target || '未知空间'
    return `访问了 ${targetName} 的空间`
  }
  // 聊天消息
  if (row.action === 'chat') {
    return `发送消息：${row.data?.message || row.details || '-'}`
  }
  // 分享
  if (row.action === 'share') {
    return `分享了内容`
  }
  // 兑换
  if (row.action === 'exchange') {
    return `兑换：${row.data?.description || row.details || '-'}`
  }
  // 扣除
  if (row.action === 'deduct') {
    return `扣除：${row.data?.description || row.details || '-'}`
  }
  // 打开/关闭/点击操作
  if (['open', 'close', 'click'].includes(row.action)) {
    const target = row.target || row.data?.target || '-'
    const detail = row.details || row.data?.detail || ''
    return `${target} ${detail ? '- ' + detail : ''}`
  }
  // 有描述直接显示
  if (row.data?.description) {
    return row.data.description
  }
  if (row.details) {
    return row.details
  }
  // 兜底：显示完整数据
  if (row.data && Object.keys(row.data).length > 0) {
    return JSON.stringify(row.data)
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
