<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon blue"><Document /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon green"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon yellow"><Bicycle /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalRiders }}</div>
              <div class="stat-label">配送员数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon pink"><Bell /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalNotices }}</div>
              <div class="stat-label">通知公告</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>近7天订单统计趋势</span>
          </template>
          <div ref="trendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>订单状态分布</span>
          </template>
          <div ref="statusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Document, User, Bicycle, Bell } from '@element-plus/icons-vue'
import { getDashboardStats } from '@/api'

const stats = ref({
  totalOrders: 0,
  totalUsers: 0,
  totalRiders: 0,
  totalNotices: 0
})

const trendChart = ref(null)
const statusChart = ref(null)

const loadDashboardData = async () => {
  try {
    const res = await getDashboardStats()
    const data = res.data || {}
    stats.value = {
      totalOrders: data.totalOrders || 0,
      totalUsers: data.totalUsers || 0,
      totalRiders: data.totalRiders || 0,
      totalNotices: data.totalNotices || 0
    }

    // 更新订单趋势图
    await nextTick()
    if (trendChart.value) {
      const trendChartInstance = echarts.init(trendChart.value)
      const ordersByDay = data.ordersByDay || []
      const dates = ordersByDay.map(item => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}-${date.getDate()}`
      })
      const counts = ordersByDay.map(item => item.count)
      
      trendChartInstance.setOption({
        xAxis: {
          type: 'category',
          data: dates.length > 0 ? dates : ['暂无数据']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: counts.length > 0 ? counts : [0],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#67c23a' }
        }]
      })
    }

    // 更新订单状态分布图
    if (statusChart.value) {
      const statusChartInstance = echarts.init(statusChart.value)
      const statusDistribution = data.statusDistribution || []
      const chartData = statusDistribution.map(item => ({
        value: item.count,
        name: item.status
      }))
      
      statusChartInstance.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: chartData.length > 0 ? chartData : [{ value: 0, name: '暂无数据' }]
        }]
      })
    }
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 48px;
}

.stat-icon.blue {
  color: #409EFF;
}

.stat-icon.green {
  color: #67C23A;
}

.stat-icon.yellow {
  color: #E6A23C;
}

.stat-icon.pink {
  color: #F56C6C;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.charts-row {
  margin-top: 20px;
}
</style>

