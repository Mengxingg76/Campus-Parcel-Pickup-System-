<template>
  <div class="admin-orders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="待接单" value="待接单" />
              <el-option label="配送中" value="配送中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadOrders">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column label="配送员" width="120">
          <template #default="scope">
            {{ scope.row.rider?.nickname || scope.row.rider?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-select
              v-model="scope.row.status"
              size="small"
              @change="handleStatusChange(scope.row)"
              style="width: 120px"
            >
              <el-option label="待接单" value="待接单" />
              <el-option label="配送中" value="配送中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getOrders, updateOrderStatus } from '@/api'

const orderList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  status: ''
})

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
      pageSize: pageSize.value,
      status: searchForm.status || undefined
    })
    orderList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.status = ''
  loadOrders()
}

const handleStatusChange = async (order) => {
  try {
    await updateOrderStatus(order.orderId, order.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('更新状态失败:', error)
    loadOrders() // 恢复原状态
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.admin-orders {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
