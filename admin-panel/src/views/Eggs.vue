<template>
  <div class="eggs-page">
    <el-row :gutter="20" v-loading="loading">
      <!-- 彩蛋统计卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ eggStats.totalUsers || 0 }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ eggStats.totalDiscovered || 0 }}</div>
            <div class="stat-label">彩蛋发现总数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ averageEggs }}</div>
            <div class="stat-label">人均发现</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ eggStats.topEggs?.length || 0 }}</div>
            <div class="stat-label">彩蛋种类</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 稀有度分布 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>稀有度分布</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="rarity-stats">
            <div class="rarity-item common">
              <div class="rarity-header">
                <el-tag>普通</el-tag>
                <span class="count">{{ eggStats.byRarity?.common?.count || 0 }}</span>
              </div>
              <el-progress :percentage="commonPercentage" :stroke-width="20" :show-text="false" />
              <div class="users">{{ eggStats.byRarity?.common?.users || 0 }} 人发现</div>
            </div>

            <div class="rarity-item rare">
              <div class="rarity-header">
                <el-tag type="warning">稀有</el-tag>
                <span class="count">{{ eggStats.byRarity?.rare?.count || 0 }}</span>
              </div>
              <el-progress :percentage="rarePercentage" :stroke-width="20" :show-text="false" />
              <div class="users">{{ eggStats.byRarity?.rare?.users || 0 }} 人发现</div>
            </div>

            <div class="rarity-item epic">
              <div class="rarity-header">
                <el-tag type="danger">史诗</el-tag>
                <span class="count">{{ eggStats.byRarity?.epic?.count || 0 }}</span>
              </div>
              <el-progress :percentage="epicPercentage" :stroke-width="20" :show-text="false" />
              <div class="users">{{ eggStats.byRarity?.epic?.users || 0 }} 人发现</div>
            </div>

            <div class="rarity-item legendary">
              <div class="rarity-header">
                <el-tag type="danger">传说</el-tag>
                <span class="count">{{ eggStats.byRarity?.legendary?.count || 0 }}</span>
              </div>
              <el-progress :percentage="legendaryPercentage" :stroke-width="20" :show-text="false" />
              <div class="users">{{ eggStats.byRarity?.legendary?.users || 0 }} 人发现</div>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <v-chart :option="rarityChartOption" style="height: 300px" autoresize />
        </el-col>
      </el-row>
    </el-card>

    <!-- 热门彩蛋排行 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>热门彩蛋排行 TOP10</span>
        </div>
      </template>
      <el-table :data="eggStats.topEggs?.slice(0, 10) || []" style="width: 100%">
        <el-table-column type="index" label="排名" width="80" align="center">
          <template #default="{ $index }">
            <el-tag v-if="$index < 3" :type="getRankTagType($index)" effect="dark">
              {{ $index + 1 }}
            </el-tag>
            <span v-else>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="彩蛋名称" />
        <el-table-column prop="rarity" label="稀有度" width="100">
          <template #default="{ row }">
            <el-tag :type="getEggTagType(row.rarity)" size="small">
              {{ getRarityLabel(row.rarity) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="发现次数" width="120" align="right" sortable />
      </el-table>
    </el-card>

    <!-- 彩蛋发现排行榜 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>彩蛋发现排行榜</span>
          <el-select v-model="rankingLimit" size="small" style="width: 120px" @change="loadRankings">
            <el-option label="TOP 20" :value="20" />
            <el-option label="TOP 50" :value="50" />
            <el-option label="TOP 100" :value="100" />
          </el-select>
        </div>
      </template>
      <el-table :data="rankings" style="width: 100%" max-height="500">
        <el-table-column type="index" label="排名" width="80" align="center">
          <template #default="{ $index }">
            <el-tag v-if="$index < 3" :type="getRankTagType($index)" effect="dark">
              {{ $index + 1 }}
            </el-tag>
            <span v-else>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户" width="180">
          <template #default="{ row }">
            {{ row.nickname || '未知用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="qcioId" label="QCIO ID" width="100" />
        <el-table-column prop="eggsDiscovered" label="发现彩蛋数" width="120" align="right" sortable />
        <el-table-column prop="coins" label="时光币" width="120" align="right" sortable>
          <template #default="{ row }">
            {{ formatNumber(row.coins) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 彩蛋发现历史 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>彩蛋发现历史</span>
          <div>
            <el-select v-model="historyFilter.rarity" size="small" placeholder="稀有度" clearable style="width: 120px; margin-right: 10px">
              <el-option label="普通" value="common" />
              <el-option label="稀有" value="rare" />
              <el-option label="史诗" value="epic" />
              <el-option label="传说" value="legendary" />
            </el-select>
            <el-button size="small" type="primary" @click="loadHistory">查询</el-button>
          </div>
        </div>
      </template>
      <el-table :data="history" style="width: 100%" max-height="400">
        <el-table-column prop="createdAt" label="发现时间" width="170">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="data.egg.name" label="彩蛋名称" />
        <el-table-column prop="data.egg.rarity" label="稀有度" width="100">
          <template #default="{ row }">
            <el-tag :type="getEggTagType(row.data?.egg?.rarity)" size="small">
              {{ getRarityLabel(row.data?.egg?.rarity) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data.egg.reward.coins" label="奖励" width="100" align="right">
          <template #default="{ row }">
            +{{ row.data?.egg?.reward?.coins || 0 }} 时光币
          </template>
        </el-table-column>
        <el-table-column prop="_openid" label="用户" width="120">
          <template #default="{ row }">
            {{ maskOpenid(row._openid) }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="historyPage.page"
        v-model:page-size="historyPage.limit"
        :page-sizes="[20, 50, 100]"
        :total="historyPage.total"
        layout="total, sizes, prev, pager, next"
        style="margin-top: 20px; justify-content: center"
        @size-change="loadHistory"
        @current-change="loadHistory"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { getEggStats, getEggRankings, getEggDiscoveryHistory } from '../api/admin'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const loading = ref(false)
const eggStats = ref({
  totalUsers: 0,
  totalDiscovered: 0,
  byRarity: {
    common: { count: 0, users: 0 },
    rare: { count: 0, users: 0 },
    epic: { count: 0, users: 0 },
    legendary: { count: 0, users: 0 }
  },
  topEggs: []
})

const rankingLimit = ref(20)
const rankings = ref([])

const historyFilter = ref({ rarity: '' })
const historyPage = ref({ page: 1, limit: 20, total: 0 })
const history = ref([])

const averageEggs = computed(() => {
  if (!eggStats.value.totalUsers) return 0
  return (eggStats.value.totalDiscovered / eggStats.value.totalUsers).toFixed(1)
})

const totalRarityCount = computed(() => {
  const r = eggStats.value.byRarity
  return (r.common?.count || 0) + (r.rare?.count || 0) + (r.epic?.count || 0) + (r.legendary?.count || 0)
})

const commonPercentage = computed(() => {
  if (!totalRarityCount.value) return 0
  return ((eggStats.value.byRarity.common?.count || 0) / totalRarityCount.value * 100).toFixed(1)
})

const rarePercentage = computed(() => {
  if (!totalRarityCount.value) return 0
  return ((eggStats.value.byRarity.rare?.count || 0) / totalRarityCount.value * 100).toFixed(1)
})

const epicPercentage = computed(() => {
  if (!totalRarityCount.value) return 0
  return ((eggStats.value.byRarity.epic?.count || 0) / totalRarityCount.value * 100).toFixed(1)
})

const legendaryPercentage = computed(() => {
  if (!totalRarityCount.value) return 0
  return ((eggStats.value.byRarity.legendary?.count || 0) / totalRarityCount.value * 100).toFixed(1)
})

const rarityChartOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '彩蛋稀有度分布',
      type: 'pie',
      radius: '50%',
      data: [
        { value: eggStats.value.byRarity.common?.count || 0, name: '普通', itemStyle: { color: '#909399' } },
        { value: eggStats.value.byRarity.rare?.count || 0, name: '稀有', itemStyle: { color: '#E6A23C' } },
        { value: eggStats.value.byRarity.epic?.count || 0, name: '史诗', itemStyle: { color: '#F56C6C' } },
        { value: eggStats.value.byRarity.legendary?.count || 0, name: '传说', itemStyle: { color: '#FF4500' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

function formatTime(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN')
}

function formatNumber(num) {
  if (!num) return 0
  return num.toLocaleString()
}

function maskOpenid(openid) {
  if (!openid) return '-'
  return openid.substring(0, 8) + '***'
}

function getRarityLabel(rarity) {
  const labels = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }
  return labels[rarity] || rarity
}

function getEggTagType(rarity) {
  const types = { common: '', rare: 'warning', epic: 'danger', legendary: 'danger' }
  return types[rarity] || 'info'
}

function getRankTagType(index) {
  if (index === 0) return 'danger'
  if (index === 1) return 'warning'
  if (index === 2) return 'success'
  return 'info'
}

async function loadStats() {
  loading.value = true
  try {
    const data = await getEggStats()
    eggStats.value = data
  } catch (error) {
    console.error('加载彩蛋统计失败:', error)
  } finally {
    loading.value = false
  }
}

async function loadRankings() {
  try {
    const data = await getEggRankings(rankingLimit.value)
    rankings.value = data
  } catch (error) {
    console.error('加载排行榜失败:', error)
  }
}

async function loadHistory() {
  try {
    const data = await getEggDiscoveryHistory({
      ...historyFilter.value,
      ...historyPage.value
    })
    history.value = data.list
    historyPage.value.total = data.total
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

onMounted(() => {
  loadStats()
  loadRankings()
  loadHistory()
})
</script>

<style scoped>
.eggs-page {
  padding: 0;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rarity-stats {
  padding: 10px 0;
}

.rarity-item {
  margin-bottom: 20px;
}

.rarity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rarity-header .count {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.rarity-item .users {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.rarity-item.common :deep(.el-progress-bar__inner) {
  background-color: #909399;
}

.rarity-item.rare :deep(.el-progress-bar__inner) {
  background-color: #E6A23C;
}

.rarity-item.epic :deep(.el-progress-bar__inner) {
  background-color: #F56C6C;
}

.rarity-item.legendary :deep(.el-progress-bar__inner) {
  background-color: #FF4500;
}
</style>
