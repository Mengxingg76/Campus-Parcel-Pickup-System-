<template>
  <div class="order-page">
    <el-header class="header">
      <div class="logo">
        <el-icon><Box /></el-icon>
        <span>校园快递代取平台</span>
      </div>
      <div class="nav">
        <el-menu mode="horizontal" :default-active="activeIndex" router>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/order">快递代取</el-menu-item>
          <el-menu-item index="/my-orders">我的订单</el-menu-item>
          <el-menu-item index="/recharge">账户充值</el-menu-item>
          <el-menu-item index="/notice">通知公告</el-menu-item>
          <el-menu-item index="/profile">个人中心</el-menu-item>
        </el-menu>
      </div>
      <div class="user-info">
        <el-dropdown>
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
    </el-header>

    <el-main class="main-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <el-icon><Box /></el-icon>
                <span>包裹信息</span>
              </div>
            </template>
            <el-form :model="form" label-width="120px">
              <el-form-item label="快递站点" required>
                <el-select v-model="form.stationId" placeholder="请选择站点" style="width: 100%">
                  <el-option v-for="station in stations" :key="station.stationId" 
                    :label="station.stationName" :value="station.stationId" />
                </el-select>
              </el-form-item>
              <el-form-item label="取件码" required>
                <el-input v-model="form.pickupCode" placeholder="例: 3-2056 或 A123" />
              </el-form-item>
              <el-form-item label="包裹规格" required>
                <el-radio-group v-model="form.sizeId">
                  <el-radio-button v-for="size in sizes" :key="size.sizeId" :value="size.sizeId">
                    <div class="size-card">
                      <el-icon><Box /></el-icon>
                      <div>
                        <div class="size-name">{{ size.sizeName }}</div>
                        <div class="size-desc">{{ size.description }}</div>
                        <div class="size-price">+¥{{ parseFloat(size.surcharge || 0).toFixed(2) }}</div>
                      </div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <el-icon><Location /></el-icon>
                <span>配送地址</span>
              </div>
            </template>
            <el-form :model="form" label-width="120px">
              <el-form-item label="宿舍楼栋" required>
                <el-select v-model="form.buildingId" placeholder="选择楼栋" style="width: 100%">
                  <el-option v-for="building in buildings" :key="building.buildingId" 
                    :label="building.buildingName" :value="building.buildingId" />
                </el-select>
              </el-form-item>
              <el-form-item label="寝室号/联系人" required>
                <el-input v-model="form.roomContact" placeholder="例: 302 - 张三" />
              </el-form-item>
              <el-form-item label="备注需求">
                <el-input v-model="form.remarks" type="textarea" :rows="4" 
                  placeholder="例如: 放在门口、不要敲门等" maxlength="50" show-word-limit />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="preview-card">
            <template #header>
              <span>订单预览</span>
            </template>
            <div class="preview-content">
              <div class="preview-item">
                <span>基础配送费</span>
                <span>¥5.00</span>
              </div>
              <div class="preview-item">
                <span>规格附加费</span>
                <span>¥{{ surcharge.toFixed(2) }}</span>
              </div>
              <div class="preview-total">
                <span>预估总价</span>
                <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
              </div>
              <el-button type="success" size="large" @click="handlePay" style="width: 100%; margin-top: 20px">
                立即支付
              </el-button>
              <div class="guarantee-info">
                <el-icon><Lock /></el-icon>
                <span>平台担保·损坏包赔·隐私加密</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Box, User, Location, Lock } from '@element-plus/icons-vue'
import { getStations, getBuildings, getPackageSizes, createOrder } from '@/api'

const router = useRouter()
const userStore = useUserStore()

const activeIndex = ref('/order')
const stations = ref([])
const buildings = ref([])
const sizes = ref([])

const form = reactive({
  stationId: null,
  pickupCode: '',
  sizeId: null,
  buildingId: null,
  roomContact: '',
  remarks: ''
})

const surcharge = computed(() => {
  const size = sizes.value.find(s => s.sizeId === form.sizeId)
  if (!size || !size.surcharge) return 0
  // 确保返回数字类型
  return parseFloat(size.surcharge) || 0
})

const totalPrice = computed(() => {
  return 5.00 + surcharge.value
})

const handleLogout = () => {
  userStore.logout()
}

const handlePay = async () => {
  if (!form.stationId || !form.pickupCode || !form.sizeId || !form.buildingId || !form.roomContact) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await createOrder(form)
    ElMessage.success('下单成功')
    router.push('/my-orders')
  } catch (error) {
    console.error('下单失败:', error)
  }
}

const loadData = async () => {
  try {
    const [stationsRes, buildingsRes, sizesRes] = await Promise.all([
      getStations(),
      getBuildings(),
      getPackageSizes()
    ])
    stations.value = stationsRes.data || []
    buildings.value = buildingsRes.data || []
    sizes.value = sizesRes.data || []
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.order-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.size-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.size-name {
  font-weight: bold;
}

.size-desc {
  font-size: 12px;
  color: #999;
}

.size-price {
  color: #67c23a;
  font-weight: bold;
}

.preview-card {
  position: sticky;
  top: 20px;
}

.preview-content {
  padding: 10px 0;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.preview-total {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 18px;
  font-weight: bold;
}

.total-price {
  color: #67c23a;
  font-size: 24px;
}

.guarantee-info {
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>

