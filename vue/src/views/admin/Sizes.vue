<template>
  <div class="admin-sizes">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>包裹规格管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="sizeList" border v-loading="loading">
        <el-table-column prop="sizeId" label="ID" width="80" />
        <el-table-column prop="sizeName" label="规格名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="surcharge" label="附加费" width="120">
          <template #default="scope">
            ¥{{ scope.row.surcharge }}
          </template>
        </el-table-column>
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
        <el-form-item label="规格名称" prop="sizeName">
          <el-input v-model="form.sizeName" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="附加费" prop="surcharge">
          <el-input-number v-model="form.surcharge" :min="0" :precision="2" :step="1" style="width: 100%" />
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
import { getPackageSizes, createPackageSize, updatePackageSize, deletePackageSize } from '@/api'

const sizeList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)

const form = reactive({
  sizeId: null,
  sizeName: '',
  description: '',
  surcharge: 0
})

const rules = {
  sizeName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  surcharge: [{ required: true, message: '请输入附加费', trigger: 'blur' }]
}

const loadSizes = async () => {
  loading.value = true
  try {
    const res = await getPackageSizes()
    sizeList.value = res.data || []
  } catch (error) {
    console.error('加载规格列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  form.sizeId = null
  form.sizeName = ''
  form.description = ''
  form.surcharge = 0
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  form.sizeId = row.sizeId
  form.sizeName = row.sizeName
  form.description = row.description
  form.surcharge = row.surcharge
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个规格吗？', '提示', {
      type: 'warning'
    })
    await deletePackageSize(row.sizeId)
    ElMessage.success('删除成功')
    loadSizes()
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
        if (form.sizeId) {
          await updatePackageSize(form.sizeId, {
            sizeName: form.sizeName,
            description: form.description,
            surcharge: form.surcharge
          })
        } else {
          await createPackageSize({
            sizeName: form.sizeName,
            description: form.description,
            surcharge: form.surcharge
          })
        }
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadSizes()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

onMounted(() => {
  loadSizes()
})
</script>

<style scoped>
.admin-sizes {
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
