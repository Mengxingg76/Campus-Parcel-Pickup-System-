<template>
  <div class="rider-records-page">
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
    <div class="rider-records">
      <el-card>
      <template #header>
        <div class="card-header">
          <span>接单记录</span>
        </div>
      </template>
      <el-table :data="orderList" border v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column label="快递站点">
          <template #default="scope">
            {{ scope.row.station?.stationName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="pickupCode" label="取件码" width="120" />
        <el-table-column label="配送地址">
          <template #default="scope">
            {{ scope.row.building?.buildingName || '-' }} - {{ scope.row.roomContact }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="金额" width="100">
          <template #default="scope">
            ¥{{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户" width="120">
          <template #default="scope">
            {{ scope.row.user?.nickname || scope.row.user?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === '配送中'" 
              type="success" 
              size="small" 
              @click="handleComplete(scope.row)"
            >
              完成订单
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadOrders"
          @current-change="loadOrders"
        />
      </div>
    </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Box, User } from '@element-plus/icons-vue'
import { getOrders, completeOrder } from '@/api'

const userStore = useUserStore()
const activeIndex = ref('/rider/records')

const orderList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const getStatusType = (status) => {
  const statusMap = {
    '待接单': 'warning',
    '配送中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return statusMap[status] || 'info'
}

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await getOrders({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    // 只显示配送员接的订单
    orderList.value = (res.data?.list || []).filter(order => order.riderId)
    total.value = orderList.value.length
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  userStore.logout()
}

const handleComplete = async (order) => {
  try {
    await ElMessageBox.confirm('确定要完成这个订单吗？', '提示', {
      type: 'warning'
    })
    await completeOrder(order.orderId)
    ElMessage.success('订单已完成')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('完成订单失败:', error)
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.rider-records-page {
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

.rider-records {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
