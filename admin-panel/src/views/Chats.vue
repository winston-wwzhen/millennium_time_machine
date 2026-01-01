<template>
  <div class="chats-page">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="私聊记录" name="private">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>私聊记录查询</span>
            </div>
          </template>

          <!-- 搜索条件 -->
          <el-form :model="searchForm" inline>
            <el-form-item label="QCIO ID">
              <el-input v-model="searchForm.userQcioId" placeholder="输入用户QCIO ID" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item label="联系人">
              <el-select v-model="searchForm.contactName" placeholder="选择联系人" clearable filterable style="width: 200px">
                <el-option v-for="contact in aiContacts" :key="contact.name" :label="contact.name" :value="contact.name" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadChatHistory">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 聊天记录列表 -->
          <div class="chat-container" v-loading="loading">
            <div v-if="chatHistory.length === 0" class="empty-state">
              <el-empty description="暂无聊天记录" />
            </div>
            <div v-else class="chat-messages">
              <div v-for="(msg, index) in chatHistory" :key="index" class="message-item" :class="{ 'is-user': msg.is_user }">
                <div class="message-header">
                  <span class="sender">{{ msg.is_user ? '用户' : msg.contact_name }}</span>
                  <span class="time">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="message-content">
                  {{ msg.content }}
                </div>
                <div v-if="msg.mode" class="message-mode">
                  <el-tag size="small">{{ msg.mode }}</el-tag>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <el-pagination
              v-if="pagination.total > 0"
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.limit"
              :page-sizes="[20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next"
              style="margin-top: 20px; justify-content: center"
              @size-change="loadChatHistory"
              @current-change="loadChatHistory"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="群聊记录" name="group">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>群聊记录查询</span>
            </div>
          </template>

          <!-- 搜索条件 -->
          <el-form :model="groupSearchForm" inline>
            <el-form-item label="群组">
              <el-select v-model="groupSearchForm.groupId" placeholder="选择群组" clearable style="width: 250px">
                <el-option v-for="group in groups" :key="group.group_id" :label="group.name" :value="group.group_id">
                  <span>{{ group.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 12px">{{ group.member_count || 0 }}人</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadGroupChatHistory">查询</el-button>
              <el-button @click="resetGroupSearch">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 群聊记录列表 -->
          <div class="chat-container" v-loading="groupLoading">
            <div v-if="groupChatHistory.length === 0" class="empty-state">
              <el-empty description="暂无群聊记录" />
            </div>
            <div v-else class="chat-messages">
              <div v-for="(msg, index) in groupChatHistory" :key="index" class="message-item group-message">
                <div class="message-header">
                  <span class="sender">{{ msg.sender_name || '未知' }}</span>
                  <span class="time">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="message-content">
                  {{ msg.content }}
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <el-pagination
              v-if="groupPagination.total > 0"
              v-model:current-page="groupPagination.page"
              v-model:page-size="groupPagination.limit"
              :page-sizes="[20, 50, 100]"
              :total="groupPagination.total"
              layout="total, sizes, prev, pager, next"
              style="margin-top: 20px; justify-content: center"
              @size-change="loadGroupChatHistory"
              @current-change="loadGroupChatHistory"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 聊天统计 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>聊天统计</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalChats || 0 }}</div>
            <div class="stat-label">聊天总数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.todayChats || 0 }}</div>
            <div class="stat-label">今日聊天</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ aiContacts.length }}</div>
            <div class="stat-label">AI 联系人</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ groups.length }}</div>
            <div class="stat-label">群组数量</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getChatHistory, getGroupChatHistory, getDashboardStats } from '../api/admin'

const activeTab = ref('private')
const loading = ref(false)
const groupLoading = ref(false)

const searchForm = reactive({
  userQcioId: '',
  contactName: ''
})

const groupSearchForm = reactive({
  groupId: ''
})

const pagination = reactive({
  page: 1,
  limit: 50,
  total: 0
})

const groupPagination = reactive({
  page: 1,
  limit: 50,
  total: 0
})

const chatHistory = ref([])
const groupChatHistory = ref([])
const aiContacts = ref([])
const groups = ref([])
const stats = ref({
  totalChats: 0,
  todayChats: 0
})

// 格式化时间
function formatTime(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN')
}

// 加载私聊记录
async function loadChatHistory() {
  loading.value = true
  try {
    const data = await getChatHistory({
      userQcioId: searchForm.userQcioId || undefined,
      contactName: searchForm.contactName || undefined,
      page: pagination.page,
      limit: pagination.limit
    })
    chatHistory.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    console.error('加载私聊记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载群聊记录
async function loadGroupChatHistory() {
  groupLoading.value = true
  try {
    const data = await getGroupChatHistory({
      groupId: groupSearchForm.groupId || undefined,
      page: groupPagination.page,
      limit: groupPagination.limit
    })
    groupChatHistory.value = data.list || []
    groupPagination.total = data.total || 0
  } catch (error) {
    console.error('加载群聊记录失败:', error)
  } finally {
    groupLoading.value = false
  }
}

// 重置搜索
function resetSearch() {
  searchForm.userQcioId = ''
  searchForm.contactName = ''
  pagination.page = 1
  loadChatHistory()
}

function resetGroupSearch() {
  groupSearchForm.groupId = ''
  groupPagination.page = 1
  loadGroupChatHistory()
}

// 切换标签
function handleTabChange() {
  if (activeTab.value === 'private' && chatHistory.value.length === 0) {
    loadChatHistory()
  } else if (activeTab.value === 'group' && groupChatHistory.value.length === 0) {
    loadGroupChatHistory()
  }
}

// 加载AI联系人和群组列表（模拟数据，实际应从云函数获取）
function loadContactsAndGroups() {
  // 100个AI联系人示例
  const contactNames = [
    '轻舞飞扬', '龙傲天', '网管小哥', '忧郁王子', '杀马特',
    '火星文大师', '段子手', '算命先生', '文艺青年', '技术宅',
    '小清新', '重口味', '二次元', '三次元', '非主流',
    '主流', '边缘人', '社交达人', '宅男女神', '屌丝逆袭',
    '高富帅', '白富美', '经济适用', '小确幸', '佛系青年',
    '狼性文化', '摸鱼达人', '996', '007', '内卷王',
    '躺平族', '斜杠青年', '精致穷', '韭菜', '割韭菜'
  ]

  aiContacts.value = contactNames.map(name => ({ name }))

  // 6个群组示例
  groups.value = [
    { group_id: '葬爱家族', name: '葬爱家族', member_count: 18 },
    { group_id: '网游开黑', name: '网游开黑小队', member_count: 24 },
    { group_id: '网吧常驻', name: '网吧常驻人口', member_count: 20 },
    { group_id: '网络评论', name: '网络评论家', member_count: 18 },
    { group_id: '神秘人士', name: '神秘人士聚集地', member_count: 22 },
    { group_id: '情感咨询', name: '情感咨询室', member_count: 18 }
  ]
}

// 加载统计数据
async function loadStats() {
  try {
    const data = await getDashboardStats()
    stats.value = {
      totalChats: data.chats?.total || 0,
      todayChats: data.chats?.today || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadContactsAndGroups()
  loadStats()
  loadChatHistory()
})
</script>

<style scoped>
.chats-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-container {
  min-height: 400px;
}

.empty-state {
  padding: 40px 0;
}

.chat-messages {
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.message-item {
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-item.is-user {
  background: #e6f7ff;
  margin-left: 40px;
}

.message-item.group-message {
  background: #fafafa;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-header .sender {
  font-weight: 500;
  color: #303133;
}

.message-header .time {
  font-size: 12px;
  color: #909399;
}

.message-content {
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-mode {
  margin-top: 8px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}
</style>
