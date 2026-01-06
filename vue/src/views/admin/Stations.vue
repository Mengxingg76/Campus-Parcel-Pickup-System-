<template>
  <div class="stations-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>快递站点管理</span>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="站点名称">
            <el-input v-model="searchForm.stationName" placeholder="请输入站点名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" :icon="Edit" @click="handleEdit">修改</el-button>
        <el-button type="danger" :icon="Delete" @click="handleDelete">删除</el-button>
      </div>
      <el-table :data="tableData" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="stationId" label="序号" width="80" />
        <el-table-column prop="stationName" label="站点名称" />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-link type="primary" @click="handleEditRow(scope.row)">修改</el-link>
            <el-link type="danger" @click="handleDeleteRow(scope.row)" style="margin-left: 10px">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span>共{{ total }}条</span>
        <el-select v-model="pageSize" style="width: 100px; margin: 0 10px">
          <el-option label="10条/页" :value="10" />
        </el-select>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
        />
        <el-input v-model="goToPage" style="width: 80px; margin-left: 10px" />
        <span style="margin-left: 5px">页</span>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="站点名称">
          <el-input v-model="form.stationName" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStations, createStation, updateStation, deleteStation } from '@/api'

const searchForm = reactive({
  stationName: ''
})

const tableData = ref([])

const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const form = reactive({
  stationId: null,
  stationName: '',
  sortOrder: 0
})

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref(1)

const loadStations = async () => {
  try {
    const res = await getStations()
    tableData.value = res.data || []
    total.value = tableData.value.length
  } catch (error) {
    console.error('加载站点列表失败:', error)
  }
}

const handleSearch = () => {
  loadStations()
}

const handleReset = () => {
  searchForm.stationName = ''
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  form.stationId = null
  form.stationName = ''
  form.sortOrder = 0
  dialogVisible.value = true
}

const handleEdit = () => {
  if (selectedRows.value.length !== 1) {
    ElMessage.warning('请选择一条记录')
    return
  }
  handleEditRow(selectedRows.value[0])
}

const handleEditRow = (row) => {
  dialogTitle.value = '修改'
  form.stationId = row.stationId
  form.stationName = row.stationName
  form.sortOrder = row.sortOrder
  dialogVisible.value = true
}

const handleDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  handleDeleteConfirm()
}

const handleDeleteRow = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      type: 'warning'
    })
    await deleteStation(row.stationId)
    ElMessage.success('删除成功')
    loadStations()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleDeleteConfirm = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的记录吗？', '提示', {
      type: 'warning'
    })
    await Promise.all(selectedRows.value.map(row => deleteStation(row.stationId)))
    ElMessage.success('删除成功')
    loadStations()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
    }
  }
}

const handleSubmit = async () => {
  if (!form.stationName) {
    ElMessage.warning('请输入站点名称')
    return
  }
  try {
    if (form.stationId) {
      await updateStation(form.stationId, {
        stationName: form.stationName,
        sortOrder: form.sortOrder
      })
    } else {
      await createStation({
        stationName: form.stationName,
        sortOrder: form.sortOrder
      })
    }
    ElMessage.success(dialogTitle.value + '成功')
    dialogVisible.value = false
    loadStations()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

onMounted(() => {
  loadStations()
})
</script>

<style scoped>
.stations-page {
  padding: 20px;
}

.card-header {
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

