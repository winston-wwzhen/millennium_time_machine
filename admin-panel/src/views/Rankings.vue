<template>
  <div class="rankings">
    <el-card shadow="hover">
      <template #header>
        <span>排行榜</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="等级排行" name="level">
          <el-table :data="levelRank" style="width: 100%">
            <el-table-column type="index" label="排名" width="120" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="level" label="等级" />
            <el-table-column prop="experience" label="经验值" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="金币排行" name="qpoints">
          <el-table :data="qpointsRank" style="width: 100%">
            <el-table-column type="index" label="排名" width="120" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="gold" label="金币" />
            <el-table-column prop="level" label="等级" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="彩蛋发现" name="eggs">
          <el-table :data="eggsRank" style="width: 100%">
            <el-table-column type="index" label="排名" width="120" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="eggCount" label="发现彩蛋" />
            <el-table-column prop="level" label="等级" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="如果当时结局" name="ifthen">
          <el-table :data="ifthenRank" style="width: 100%">
            <el-table-column type="index" label="排名" width="120" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="endingCount" label="达成结局" />
            <el-table-column prop="percentage" label="占比" width="120">
              <template #default="{ row }">
                {{ row.percentage }}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRankings } from '../api/admin'

const activeTab = ref('level')
const levelRank = ref([])
const qpointsRank = ref([])
const eggsRank = ref([])
const ifthenRank = ref([])

const loadRankings = async () => {
  try {
    const data = await getRankings()
    levelRank.value = data.level || []
    qpointsRank.value = data.qpoints || []
    eggsRank.value = data.eggs || []
    ifthenRank.value = data.ifthen || []
  } catch (error) {
    console.error('加载排行榜失败', error)
  }
}

const maskNickname = (nickname) => {
  if (!nickname) return '***'
  return nickname.substring(0, 3) + '***'
}

onMounted(() => {
  loadRankings()
})
</script>

<style scoped>
.rankings {
  padding: 0;
}
</style>
