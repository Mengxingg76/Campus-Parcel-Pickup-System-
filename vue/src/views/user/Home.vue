<template>
  <div class="home-container">
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

    <main class="main-content">
      <div class="hero-section">
        <div class="hero-left">
          <el-tag type="success" size="large">专注校园最后500米</el-tag>
          <h1>你的快递 <span class="highlight">我们来搬</span></h1>
          <p>不仅是送货,更懂你的急切。支持菜鸟驿站、丰巢、顺丰直营点等全校快递点代取。</p>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">¥5.0</div>
              <div class="stat-label">起步价</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">98%</div>
              <div class="stat-label">半小时达</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0损</div>
              <div class="stat-label">全额赔付</div>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <el-card class="order-card">
            <template #header>
              <div class="card-header">
                <el-icon><Box /></el-icon>
                <span>极速下单</span>
              </div>
            </template>
            <el-form :model="orderForm" label-width="100px">
              <el-form-item label="包裹在哪里?">
                <el-select v-model="orderForm.stationId" placeholder="选择快递点" style="width: 100%">
                  <el-option v-for="station in stations" :key="station.stationId" 
                    :label="station.stationName" :value="station.stationId" />
                </el-select>
              </el-form-item>
              <el-form-item label="取件码">
                <el-input v-model="orderForm.pickupCode" placeholder="例如: 3-2056" />
              </el-form-item>
              <el-form-item label="送到哪栋楼">
                <el-select v-model="orderForm.buildingId" placeholder="选择楼栋" style="width: 100%">
                  <el-option v-for="building in buildings" :key="building.buildingId" 
                    :label="building.buildingName" :value="building.buildingId" />
                </el-select>
              </el-form-item>
              <el-form-item label="寝室号">
                <el-input v-model="orderForm.roomContact" placeholder="例如: 302 - 张三" />
              </el-form-item>
              <el-form-item label="包裹规格">
                <el-radio-group v-model="orderForm.sizeId">
                  <el-radio-button v-for="size in sizes" :key="size.sizeId" :label="size.sizeId">
                    {{ size.sizeName }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="handleOrder" style="width: 100%">立即下单></el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>

      <div class="bottom-section">
        <div class="bottom-cards">
          <el-card class="notice-card">
            <template #header>
              <div class="card-header">
                <el-icon><Bell /></el-icon>
                <span>校园公告</span>
              </div>
            </template>
            <div class="notice-list">
              <div v-for="notice in notices" :key="notice.noticeId" class="notice-item">
                <div class="notice-date">{{ formatDate(notice.publishTime) }}</div>
                <div class="notice-content">
                  <div class="notice-title">{{ notice.title }}</div>
                  <div class="notice-time">{{ notice.publishTime }}</div>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="guarantee-card">
            <template #header>
              <div class="card-header">
                <el-icon><Lock /></el-icon>
                <span>平台保障</span>
              </div>
            </template>
            <div class="guarantee-grid">
              <div class="guarantee-item">
                <el-icon><View /></el-icon>
                <div class="guarantee-title">隐私保护</div>
                <div class="guarantee-desc">取件码阅后即焚</div>
              </div>
              <div class="guarantee-item">
                <el-icon><Umbrella /></el-icon>
                <div class="guarantee-title">丢损必赔</div>
                <div class="guarantee-desc">最高赔付 ¥2000</div>
              </div>
              <div class="guarantee-item">
                <el-icon><Clock /></el-icon>
                <div class="guarantee-title">超时免单</div>
                <div class="guarantee-desc">超45分钟全额退</div>
              </div>
              <div class="guarantee-item">
                <el-icon><User /></el-icon>
                <div class="guarantee-title">实名认证</div>
                <div class="guarantee-desc">本校学生骑手</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Box, User, Bell, Lock, View, Umbrella, Clock } from '@element-plus/icons-vue'
import { getStations, getBuildings, getPackageSizes, getNotices } from '@/api'

const router = useRouter()
const userStore = useUserStore()

const activeIndex = ref('/home')
const stations = ref([])
const buildings = ref([])
const sizes = ref([])
const notices = ref([])

const orderForm = reactive({
  stationId: null,
  pickupCode: '',
  buildingId: null,
  roomContact: '',
  sizeId: null
})

const handleLogout = () => {
  userStore.logout()
}

const handleOrder = () => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/order')
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getDate()} ${date.getMonth() + 1}月`
}

const loadData = async () => {
  try {
    const [stationsRes, buildingsRes, sizesRes, noticesRes] = await Promise.all([
      getStations(),
      getBuildings(),
      getPackageSizes(),
      getNotices({ page: 1, pageSize: 5 })
    ])
    stations.value = stationsRes.data || []
    buildings.value = buildingsRes.data || []
    sizes.value = sizesRes.data || []
    notices.value = noticesRes.data?.list || []
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-container {
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

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}

.hero-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
  }
  
  .hero-right {
    width: 100%;
  }
}

.hero-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-left h1 {
  font-size: 48px;
  margin: 20px 0;
  color: #333;
  line-height: 1.2;
}

.hero-left p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.highlight {
  color: #67c23a;
}

.stats {
  display: flex;
  gap: 40px;
  margin-top: 30px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

@media (max-width: 768px) {
  .stats {
    gap: 30px;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .stats {
    gap: 20px;
    justify-content: flex-start;
  }
}

.stat-item {
  flex: 0 0 auto;
  min-width: 100px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #67c23a;
}

.stat-label {
  margin-top: 5px;
  color: #666;
}

.hero-right {
  flex: 0 0 400px;
  min-width: 0;
}

@media (max-width: 768px) {
  .hero-right {
    flex: 1 1 100%;
    width: 100%;
  }
}

.order-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.bottom-section {
  margin-top: 20px;
}

.bottom-cards {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.notice-card,
.guarantee-card {
  flex: 0 1 calc(50% - 22.5px);
  min-width: 350px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1200px) {
  .notice-card,
  .guarantee-card {
    flex: 0 1 500px;
  }
}

@media (max-width: 768px) {
  .bottom-cards {
    flex-direction: column;
  }
  
  .notice-card,
  .guarantee-card {
    min-width: 100%;
  }
}

.notice-list {
  max-height: 300px;
  overflow-y: auto;
}

.notice-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  align-items: flex-start;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-date {
  flex: 0 0 60px;
  font-size: 18px;
  font-weight: bold;
  color: #67c23a;
  text-align: center;
}

.notice-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.notice-title {
  font-weight: bold;
  margin-bottom: 5px;
  word-break: break-word;
}

.notice-time {
  font-size: 12px;
  color: #999;
}

.guarantee-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.guarantee-item {
  flex: 1 1 calc(50% - 8px);
  min-width: 120px;
  text-align: center;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 480px) {
  .guarantee-item {
    flex: 1 1 100%;
  }
}

.guarantee-item .el-icon {
  font-size: 32px;
  color: #67c23a;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.guarantee-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.guarantee-desc {
  font-size: 12px;
  color: #999;
}
</style>

