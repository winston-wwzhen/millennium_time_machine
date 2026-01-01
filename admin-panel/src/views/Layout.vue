<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>千禧时光机</h2>
          <p>管理后台</p>
        </div>

        <el-menu
          :default-active="$route.path"
          router
          class="menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>数据看板</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/rankings">
            <el-icon><Trophy /></el-icon>
            <span>排行榜</span>
          </el-menu-item>
          <el-menu-item index="/eggs">
            <el-icon><Star /></el-icon>
            <span>彩蛋管理</span>
          </el-menu-item>
          <el-menu-item index="/chats">
            <el-icon><ChatDotRound /></el-icon>
            <span>聊天记录</span>
          </el-menu-item>
          <el-menu-item index="/qcio">
            <el-icon><UserFilled /></el-icon>
            <span>QCIO管理</span>
          </el-menu-item>
          <el-menu-item index="/creator">
            <el-icon><Edit /></el-icon>
            <span>内容创作</span>
          </el-menu-item>
          <el-menu-item index="/cdk">
            <el-icon><Ticket /></el-icon>
            <span>CDK管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <span>{{ pageTitle }}</span>
          </div>
          <div class="header-right">
            <span class="username">{{ username }}</span>
            <el-button type="text" @click="handleLogout">退出</el-button>
          </div>
        </el-header>

        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  DataBoard,
  User,
  Trophy,
  Star,
  ChatDotRound,
  UserFilled,
  Edit,
  Ticket
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const username = computed(() => {
  const user = localStorage.getItem('admin_user')
  return user ? JSON.parse(user).username : 'Admin'
})

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '数据看板',
    '/users': '用户管理',
    '/user/detail': '用户详情',
    '/rankings': '排行榜',
    '/eggs': '彩蛋管理',
    '/chats': '聊天记录',
    '/qcio': 'QCIO管理',
    '/creator': '内容创作中心',
    '/cdk': 'CDK管理'
  }
  return titles[route.path] || '管理后台'
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/login')
  })
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background: #304156;
  color: #fff;
}

.logo {
  padding: 30px 20px;
  text-align: center;
}

.logo h2 {
  font-size: 20px;
  margin-bottom: 5px;
}

.logo p {
  font-size: 12px;
  color: #909399;
}

.menu {
  border: none;
  background: transparent;
}

.menu .el-menu-item {
  color: #bfcbd9;
}

.menu .el-menu-item:hover,
.menu .el-menu-item.is-active {
  background: #263445;
  color: #409eff;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left span {
  font-size: 18px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  color: #606266;
}

.main {
  background: #f5f5f5;
  padding: 20px;
}
</style>
