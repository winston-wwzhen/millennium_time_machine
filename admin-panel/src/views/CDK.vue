<template>
  <div class="cdk">
    <el-card shadow="hover">
      <template #header>
        <span>CDK管理</span>
      </template>

      <el-form :model="form" label-width="120px" style="max-width: 500px">
        <el-form-item label="CDK类型">
          <el-select v-model="form.type">
            <el-option label="应用激活" value="app" />
            <el-option label="礼包" value="gift" />
            <el-option label="特权" value="vip" />
          </el-select>
        </el-form-item>

        <el-form-item label="应用">
          <el-select v-model="form.app">
            <el-option label="如果当时.exe" value="ifthen" />
          </el-select>
        </el-form-item>

        <el-form-item label="生成数量">
          <el-input-number v-model="form.quantity" :min="1" :max="100" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.notes" placeholder="备注信息" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="generateCDK" :loading="generating">
            生成CDK
          </el-button>
          <el-button @click="loadCDKs">刷新列表</el-button>
        </el-form-item>
      </el-form>

      <!-- CDK列表 -->
      <el-table :data="cdks" style="width: 100%; margin-top: 30px">
        <el-table-column prop="code" label="CDK码" width="200" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'unused' ? 'success' : 'info'">
              {{ row.status === 'unused' ? '未使用' : '已使用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="copyCDK(row.code)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const generating = ref(false)
const form = ref({
  type: 'app',
  app: 'ifthen',
  quantity: 10,
  notes: ''
})

const cdks = ref([])

const generateCDK = async () => {
  generating.value = true
  setTimeout(() => {
    // 模拟生成
    for (let i = 0; i < form.value.quantity; i++) {
      cdks.value.unshift({
        code: `IFTH-2025-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        type: form.value.type,
        status: 'unused',
        createdAt: new Date().toLocaleString()
      })
    }
    generating.value = false
    ElMessage.success(`成功生成${form.value.quantity}个CDK`)
  }, 1000)
}

const loadCDKs = () => {
  ElMessage.info('加载CDK列表')
}

const copyCDK = (code) => {
  navigator.clipboard.writeText(code)
  ElMessage.success('已复制到剪贴板')
}

onMounted(() => {
  // 加载现有CDK
})
</script>

<style scoped>
.cdk {
  padding: 0;
}
</style>
