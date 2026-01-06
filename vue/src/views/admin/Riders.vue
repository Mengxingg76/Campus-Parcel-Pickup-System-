<template>
  <div class="admin-riders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>配送员管理/审核</span>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="审核状态">
            <el-select v-model="searchForm.certStatus" placeholder="请选择状态" clearable>
              <el-option label="审核中" value="审核中" />
              <el-option label="已通过" value="已通过" />
              <el-option label="已拒绝" value="已拒绝" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="姓名/手机号/学号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadRiders">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="riderList" border v-loading="loading">
        <el-table-column prop="riderId" label="ID" width="80" />
        <el-table-column label="用户">
          <template #default="scope">
            {{ scope.row.user?.nickname || scope.row.user?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="phoneNumber" label="手机号" width="120" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="idNumber" label="身份证号" width="180" />
        <el-table-column prop="certStatus" label="审核状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.certStatus)">
              {{ scope.row.certStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.certStatus === '审核中'"
              type="success"
              size="small"
              @click="handleReview(scope.row, '已通过')"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.certStatus === '审核中'"
              type="danger"
              size="small"
              @click="handleReview(scope.row, '已拒绝')"
            >
              拒绝
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
          @size-change="loadRiders"
          @current-change="loadRiders"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRiders, reviewCertification } from '@/api'

const riderList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  certStatus: '',
  keyword: ''
})

const getStatusType = (status) => {
  const statusMap = {
    '审核中': 'warning',
    '已通过': 'success',
    '已拒绝': 'danger'
  }
  return statusMap[status] || 'info'
}

const loadRiders = async () => {
  loading.value = true
  try {
    const res = await getRiders({
      page: currentPage.value,
      pageSize: pageSize.value,
      certStatus: searchForm.certStatus || undefined,
      keyword: searchForm.keyword || undefined
    })
    riderList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    console.error('加载配送员列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.certStatus = ''
  searchForm.keyword = ''
  loadRiders()
}

const handleReview = async (rider, status) => {
  try {
    const action = status === '已通过' ? '通过' : '拒绝'
    await ElMessageBox.confirm(`确定要${action}这个认证申请吗？`, '提示', {
      type: 'warning'
    })
    await reviewCertification(rider.riderId, status)
    ElMessage.success(`审核${action}成功`)
    loadRiders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核失败:', error)
    }
  }
}

onMounted(() => {
  loadRiders()
})
</script>

<style scoped>
.admin-riders {
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
