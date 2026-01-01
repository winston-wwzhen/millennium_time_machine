<template>
  <div class="user-detail">
    <el-page-header @back="goBack" title="返回用户列表">
      <template #content>
        <span class="page-title">用户详情</span>
      </template>
    </el-page-header>

    <div v-loading="loading">
      <el-row :gutter="20" style="margin-top: 20px" v-if="detailData.user">
        <!-- 基本信息 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
              </div>
            </template>
            <div class="user-info">
              <div class="info-item">
                <label>OpenID:</label>
                <span>{{ detailData.user._openid }}</span>
              </div>
              <div class="info-item">
                <label>昵称:</label>
                <span>{{ detailData.user.nickname || '-' }}</span>
              </div>
              <div class="info-item">
                <label>注册时间:</label>
                <span>{{ formatTime(detailData.user.createTime) }}</span>
              </div>
              <div class="info-item">
                <label>最后登录:</label>
                <span>{{ formatTime(detailData.user.lastLoginTime) }}</span>
              </div>
            </div>
          </el-card>

          <!-- QCIO 信息 -->
          <el-card shadow="hover" style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <span>QCIO 资料</span>
              </div>
            </template>
            <div class="user-info" v-if="detailData.qcioUser">
              <div class="info-item">
                <label>QCIO ID:</label>
                <span>{{ detailData.qcioUser.qcio_id }}</span>
              </div>
              <div class="info-item">
                <label>昵称:</label>
                <span>{{ detailData.qcioUser.nickname || '-' }}</span>
              </div>
              <div class="info-item">
                <label>等级:</label>
                <el-tag type="primary">Lv.{{ detailData.qcioUser.level || 0 }}</el-tag>
              </div>
              <div class="info-item">
                <label>经验值:</label>
                <span>{{ detailData.qcioUser.experience || 0 }}</span>
              </div>
            </div>
            <el-empty v-else description="未开通 QCIO" :image-size="60" />
          </el-card>
        </el-col>

        <!-- 双币信息 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>双币信息</span>
              </div>
            </template>
            <div class="currency-info">
              <div class="currency-item coins">
                <div class="currency-icon">💎</div>
                <div class="currency-details">
                  <div class="currency-label">时光币</div>
                  <div class="currency-value">{{ formatNumber(detailData.user.coins) }}</div>
                </div>
              </div>
              <div class="currency-item netfee">
                <div class="currency-icon">🌐</div>
                <div class="currency-details">
                  <div class="currency-label">网费(分钟)</div>
                  <div class="currency-value">{{ formatNumber(detailData.user.netFee) }}</div>
                  <div class="currency-sub">≈ {{ Math.floor((detailData.user.netFee || 0) / 1440) }} 天</div>
                </div>
              </div>
            </div>

            <!-- QCIO 钱包 -->
            <div v-if="detailData.qcioWallet" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee">
              <div class="currency-item gold">
                <div class="currency-icon">🪙</div>
                <div class="currency-details">
                  <div class="currency-label">金币</div>
                  <div class="currency-value">{{ formatNumber(detailData.qcioWallet.gold) }}</div>
                </div>
              </div>
              <div class="currency-item qpoints" style="margin-top: 10px">
                <div class="currency-icon">💎</div>
                <div class="currency-details">
                  <div class="currency-label">Q点</div>
                  <div class="currency-value">{{ formatNumber(detailData.qcioWallet.qpoints) }}</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 彩蛋统计 -->
          <el-card shadow="hover" style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <span>彩蛋统计</span>
              </div>
            </template>
            <div class="egg-stats">
              <div class="stat-row">
                <span>已发现彩蛋:</span>
                <strong>{{ detailData.user.eggStats?.eggsDiscovered || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>徽章数量:</span>
                <strong>{{ detailData.user.badges?.length || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>使用天数:</span>
                <strong>{{ detailData.user.eggStats?.daysUsed || 0 }}</strong>
              </div>
            </div>

            <!-- 徽章展示 -->
            <div v-if="detailData.user.badges?.length" style="margin-top: 15px">
              <el-divider content-position="left">已获得徽章</el-divider>
              <div class="badges-container">
                <el-tag v-for="badge in detailData.user.badges" :key="badge.name" size="small" style="margin: 4px">
                  {{ badge.name }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 活动统计 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>活动概览</span>
              </div>
            </template>
            <div class="activity-summary">
              <div class="summary-item">
                <span class="label">分享次数:</span>
                <span class="value">{{ detailData.user.shareCount || 0 }}</span>
              </div>
              <div class="summary-item">
                <span class="label">空间被访问:</span>
                <span class="value">{{ detailData.user.visitCount || 0 }}</span>
              </div>
              <div class="summary-item">
                <span class="label">聊天消息:</span>
                <span class="value">{{ detailData.user.chatCount || 0 }}</span>
              </div>
            </div>
          </el-card>

          <!-- 已发现彩蛋列表 -->
          <el-card shadow="hover" style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <span>已发现彩蛋</span>
                <el-badge :value="detailData.user.eggStats?.eggsDiscovered || 0" class="badge" />
              </div>
            </template>
            <div class="discovered-eggs">
              <div
                v-for="egg in detailData.user.eggStats?.discoveredEggs"
                :key="egg.id"
                class="egg-item"
              >
                <el-tag :type="getEggTagType(egg.rarity)" size="small">
                  {{ egg.name }}
                </el-tag>
                <span class="egg-time">{{ formatTime(egg.discoveredAt) }}</span>
              </div>
              <el-empty v-if="!detailData.user.eggStats?.discoveredEggs?.length" description="暂无发现" :image-size="60" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 交易记录 -->
      <el-card shadow="hover" style="margin-top: 20px">
        <template #header>
          <div class="card-header">
            <span>交易记录</span>
            <el-select v-model="transactionFilter" size="small" style="width: 150px" placeholder="筛选类型">
              <el-option label="全部" value="" />
              <el-option label="每日扣费" value="daily_deduct" />
              <el-option label="兑换" value="exchange" />
              <el-option label="使用" value="usage" />
              <el-option label="彩蛋奖励" value="egg_reward" />
            </el-select>
          </div>
        </template>
        <el-table :data="filteredTransactions" style="width: 100%" max-height="400">
          <el-table-column prop="createTime" label="时间" width="170">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTransactionTagType(row.type)" size="small">
                {{ getTransactionTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="amount" label="金额" width="100" align="right">
            <template #default="{ row }">
              <span :style="{ color: row.amount >= 0 ? '#67c23a' : '#f56c6c' }">
                {{ row.amount >= 0 ? '+' : '' }}{{ row.amount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balanceAfter" label="余额" width="100" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.balanceAfter) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 活动日志 -->
      <el-card shadow="hover" style="margin-top: 20px">
        <template #header>
          <div class="card-header">
            <span>活动日志</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="log in detailData.activities"
            :key="log._id"
            :timestamp="formatTime(log.createdAt)"
            placement="top"
          >
            <el-tag :type="getActivityTagType(log.action)" size="small" style="margin-right: 8px">
              {{ log.action }}
            </el-tag>
            <span>{{ getActivityDescription(log) }}</span>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-if="!detailData.activities?.length" description="暂无活动记录" :image-size="60" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserDetail, getUserTransactions } from '../api/admin'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const detailData = ref({
  user: null,
  qcioUser: null,
  qcioWallet: null,
  transactions: [],
  activities: []
})
const transactionFilter = ref('')

const filteredTransactions = computed(() => {
  if (!transactionFilter.value) {
    return detailData.value.transactions
  }
  return detailData.value.transactions.filter(t => t.type === transactionFilter.value)
})

function goBack() {
  router.back()
}

function formatTime(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN')
}

function formatNumber(num) {
  if (!num) return 0
  return num.toLocaleString()
}

function getEggTagType(rarity) {
  const types = {
    common: '',
    rare: 'warning',
    epic: 'danger',
    legendary: 'danger'
  }
  return types[rarity] || 'info'
}

function getTransactionTagType(type) {
  const types = {
    daily_deduct: 'danger',
    exchange: 'warning',
    usage: 'info',
    egg_reward: 'success'
  }
  return types[type] || 'info'
}

function getTransactionTypeLabel(type) {
  const labels = {
    daily_deduct: '每日扣费',
    exchange: '兑换',
    usage: '使用',
    egg_reward: '彩蛋奖励'
  }
  return labels[type] || type
}

function getActivityTagType(action) {
  const types = {
    egg_discovered: 'success',
    login: 'primary',
    share: 'warning',
    visit: 'info'
  }
  return types[action] || 'info'
}

function getActivityDescription(log) {
  if (log.action === 'egg_discovered') {
    return `发现彩蛋：${log.data?.egg?.name || ''}`
  }
  if (log.data?.description) {
    return log.data.description
  }
  return log.action
}

async function loadData() {
  const openid = route.query.openid
  if (!openid) {
    router.back()
    return
  }

  loading.value = true
  try {
    const data = await getUserDetail(openid)
    detailData.value = data
  } catch (error) {
    console.error('加载用户详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-detail {
  padding: 0;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info .info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.user-info .info-item:last-child {
  border-bottom: none;
}

.user-info .info-item label {
  font-weight: 500;
  color: #606266;
}

.currency-info {
  padding: 10px 0;
}

.currency-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.currency-item:last-child {
  margin-bottom: 0;
}

.currency-icon {
  font-size: 32px;
  margin-right: 15px;
}

.currency-details {
  flex: 1;
}

.currency-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.currency-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.currency-sub {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 4px;
}

.egg-stats .stat-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.egg-stats .stat-row:last-child {
  border-bottom: none;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.discovered-eggs .egg-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.discovered-eggs .egg-item:last-child {
  border-bottom: none;
}

.egg-time {
  font-size: 12px;
  color: #c0c4cc;
}

.activity-summary .summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.activity-summary .summary-item:last-child {
  border-bottom: none;
}

.activity-summary .label {
  color: #606266;
}

.activity-summary .value {
  font-weight: bold;
  color: #409EFF;
}
</style>
