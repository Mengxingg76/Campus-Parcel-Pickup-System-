<template>
  <div class="recharge-page">
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
    <div class="recharge">
      <el-card>
      <template #header>
        <div class="card-header">
          <span>账户充值</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>当前余额</span>
            </template>
            <div class="balance-display">
              <div class="balance-amount">¥{{ userInfo.balance || '0.00' }}</div>
              <div class="balance-label">账户余额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>快速充值</span>
            </template>
            <div class="quick-amounts">
              <el-button 
                v-for="amount in quickAmounts" 
                :key="amount"
                @click="selectedAmount = amount"
                :type="selectedAmount === amount ? 'primary' : ''"
                class="amount-btn"
              >
                ¥{{ amount }}
              </el-button>
            </div>
            <el-form :model="rechargeForm" label-width="100px" style="margin-top: 20px">
              <el-form-item label="充值金额">
                <el-input-number 
                  v-model="rechargeForm.amount" 
                  :min="1" 
                  :precision="2"
                  :step="10"
                  style="width: 100%"
                  placeholder="请输入充值金额"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleRecharge" :loading="recharging" style="width: 100%">
                  立即充值
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Box, User } from '@element-plus/icons-vue'
import { recharge } from '@/api'
import { getCurrentUser } from '@/api/auth'

const userStore = useUserStore()
const activeIndex = ref('/recharge')
const userInfo = ref({})
const selectedAmount = ref(null)
const recharging = ref(false)
const quickAmounts = [10, 20, 50, 100, 200, 500]

const rechargeForm = reactive({
  amount: null
})

watch(selectedAmount, (val) => {
  if (val) {
    rechargeForm.amount = val
  }
})

const loadUserInfo = async () => {
  try {
    const res = await getCurrentUser()
    userInfo.value = res.data || {}
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const handleLogout = () => {
  userStore.logout()
}

const handleRecharge = async () => {
  if (!rechargeForm.amount || rechargeForm.amount <= 0) {
    ElMessage.warning('请输入有效的充值金额')
    return
  }
  recharging.value = true
  try {
    const res = await recharge(rechargeForm.amount)
    ElMessage.success('充值成功')
    userInfo.value.balance = res.data?.balance || userInfo.value.balance
    userStore.fetchUser()
    rechargeForm.amount = null
    selectedAmount.value = null
  } catch (error) {
    console.error('充值失败:', error)
  } finally {
    recharging.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.recharge-page {
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

.recharge {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.balance-display {
  text-align: center;
  padding: 40px 0;
}

.balance-amount {
  font-size: 48px;
  font-weight: bold;
  color: #67c23a;
  margin-bottom: 10px;
}

.balance-label {
  font-size: 16px;
  color: #999;
}

.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amount-btn {
  flex: 1;
  min-width: 100px;
  height: 50px;
  font-size: 16px;
}
</style>
