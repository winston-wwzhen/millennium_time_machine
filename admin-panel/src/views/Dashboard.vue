<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 数据卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-change" :class="{ up: stats.usersGrowth > 0 }">
              {{ stats.usersGrowth > 0 ? '+' : '' }}{{ stats.usersGrowth || 0 }}%
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayActive || 0 }}</div>
            <div class="stat-label">今日活跃</div>
            <div class="stat-change" :class="{ up: stats.activeGrowth > 0 }">
              {{ stats.activeGrowth > 0 ? '+' : '' }}{{ stats.activeGrowth || 0 }}%
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.gameCompleted || 0 }}</div>
            <div class="stat-label">游戏完成</div>
            <div class="stat-change" :class="{ up: stats.gameGrowth > 0 }">
              {{ stats.gameGrowth > 0 ? '+' : '' }}{{ stats.gameGrowth || 0 }}%
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayShares || 0 }}</div>
            <div class="stat-label">今日分享</div>
            <div class="stat-change" :class="{ up: stats.shareGrowth > 0 }">
              {{ stats.shareGrowth > 0 ? '+' : '' }}{{ stats.shareGrowth || 0 }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 用户增长趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>用户增长趋势（近7天）</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表开发中..." />
          </div>
        </el-card>
      </el-col>

      <!-- 结局分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>结局达成分布</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表开发中..." />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时活动日志 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span>实时活动日志</span>
          </template>
          <el-table :data="logs" style="width: 100%" max-height="300">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="user" label="用户" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStats } from '../api/stats'

const stats = ref({
  totalUsers: 0,
  todayActive: 0,
  gameCompleted: 0,
  todayShares: 0,
  usersGrowth: 0,
  activeGrowth: 0,
  gameGrowth: 0,
  shareGrowth: 0
})

const logs = ref([
  { time: '2025-12-26 14:30:00', action: '用户***86 完成了游戏', user: '***86' },
  { time: '2025-12-26 14:29:00', action: '用户***52 分享了结局', user: '***52' },
  { time: '2025-12-26 14:28:00', action: '用户***33 发现了彩蛋', user: '***33' }
])

const loadStats = async () => {
  try {
    const data = await getStats()
    stats.value = data
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  text-align: center;
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

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
