<template>
  <div class="admin-buildings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>宿舍楼管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="buildingList" border v-loading="loading">
        <el-table-column prop="buildingId" label="ID" width="80" />
        <el-table-column prop="buildingName" label="楼栋名称" />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="楼栋名称" prop="buildingName">
          <el-input v-model="form.buildingName" placeholder="请输入楼栋名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBuildings, createBuilding, updateBuilding, deleteBuilding } from '@/api'

const buildingList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)

const form = reactive({
  buildingId: null,
  buildingName: '',
  sortOrder: 0
})

const rules = {
  buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }]
}

const loadBuildings = async () => {
  loading.value = true
  try {
    const res = await getBuildings()
    buildingList.value = res.data || []
  } catch (error) {
    console.error('加载楼栋列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  form.buildingId = null
  form.buildingName = ''
  form.sortOrder = 0
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  form.buildingId = row.buildingId
  form.buildingName = row.buildingName
  form.sortOrder = row.sortOrder
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个楼栋吗？', '提示', {
      type: 'warning'
    })
    await deleteBuilding(row.buildingId)
    ElMessage.success('删除成功')
    loadBuildings()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.buildingId) {
          await updateBuilding(form.buildingId, {
            buildingName: form.buildingName,
            sortOrder: form.sortOrder
          })
        } else {
          await createBuilding({
            buildingName: form.buildingName,
            sortOrder: form.sortOrder
          })
        }
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadBuildings()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

onMounted(() => {
  loadBuildings()
})
</script>

<style scoped>
.admin-buildings {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
