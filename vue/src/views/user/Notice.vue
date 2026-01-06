<template>
  <div class="notice-page">
    <header class="header">
      <div class="logo">
        <el-icon><Box /></el-icon>
        <span>校园快递代取平台</span>
      </div>
      <div class="nav">
        <el-menu mode="horizontal" :default-active="activeIndex" router>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/order" v-if="userStore.user">快递代取</el-menu-item>
          <el-menu-item index="/my-orders" v-if="userStore.user">我的订单</el-menu-item>
          <el-menu-item index="/recharge" v-if="userStore.user">账户充值</el-menu-item>
          <el-menu-item index="/notice">通知公告</el-menu-item>
          <el-menu-item index="/profile" v-if="userStore.user">个人中心</el-menu-item>
        </el-menu>
      </div>
      <div class="user-info">
        <el-button v-if="userStore.user?.role === 'user'" @click="$router.push('/certification')" type="success">配送员认证</el-button>
        <el-button v-if="userStore.user?.role === 'rider'" @click="$router.push('/rider/hall')" type="success">接单大厅</el-button>
        <el-button v-if="userStore.user?.role === 'admin'" @click="$router.push('/admin/dashboard')" type="success">后台管理</el-button>
        <el-button v-if="!userStore.user" @click="$router.push('/login')" type="primary">登录</el-button>
        <el-dropdown v-else>
          <span class="user-name">
            <el-icon><User /></el-icon>
            {{ userStore.user?.nickname || userStore.user?.username }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <div class="notice">
      <el-card>
      <template #header>
        <div class="card-header">
          <span>通知公告</span>
        </div>
      </template>
      <div class="notice-list" v-loading="loading">
        <div v-if="notices.length === 0" class="empty">
          <el-empty description="暂无通知" />
        </div>
        <div v-for="notice in notices" :key="notice.noticeId" class="notice-item" @click="handleView(notice)">
          <div class="notice-date">
            <div class="date-day">{{ formatDay(notice.publishTime) }}</div>
            <div class="date-month">{{ formatMonth(notice.publishTime) }}</div>
          </div>
          <div class="notice-content">
            <div class="notice-title">{{ notice.title }}</div>
            <div class="notice-summary">{{ notice.content?.substring(0, 100) }}...</div>
            <div class="notice-time">{{ formatTime(notice.publishTime) }}</div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadNotices"
          @current-change="loadNotices"
        />
      </div>
    </el-card>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisible" :title="currentNotice?.title" width="600px">
      <div class="notice-detail">
        <div class="detail-time">发布时间：{{ formatTime(currentNotice?.publishTime) }}</div>
        <div class="detail-content" v-html="formatContent(currentNotice?.content)"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { Box, User } from '@element-plus/icons-vue'
import { getNotices, getNoticeById } from '@/api'

const userStore = useUserStore()
const activeIndex = ref('/notice')

const notices = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const currentNotice = ref(null)

const formatDay = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.getDate()
}

const formatMonth = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月`
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

const loadNotices = async () => {
  loading.value = true
  try {
    const res = await getNotices({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    notices.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    console.error('加载通知失败:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  userStore.logout()
}

const handleView = async (notice) => {
  try {
    const res = await getNoticeById(notice.noticeId)
    currentNotice.value = res.data
    dialogVisible.value = true
  } catch (error) {
    console.error('加载通知详情失败:', error)
  }
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.notice-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: #67c23a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
}

.nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav :deep(.el-menu) {
  background: transparent;
  border: none;
}

.nav :deep(.el-menu-item) {
  color: white;
}

.nav :deep(.el-menu-item:hover),
.nav :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.notice {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.notice-list {
  min-height: 400px;
}

.empty {
  padding: 40px 0;
}

.notice-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notice-item:hover {
  background-color: #f5f7fa;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-date {
  flex: 0 0 80px;
  text-align: center;
  padding: 10px;
  background: #67c23a;
  color: white;
  border-radius: 4px;
}

.date-day {
  font-size: 28px;
  font-weight: bold;
}

.date-month {
  font-size: 14px;
  margin-top: 5px;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.notice-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.notice-time {
  font-size: 12px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.notice-detail {
  padding: 20px 0;
}

.detail-time {
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
}

.detail-content {
  line-height: 1.8;
  color: #333;
}
</style>
