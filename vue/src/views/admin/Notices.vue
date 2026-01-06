<template>
  <div class="admin-notices">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>通知公告管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="请输入标题或内容" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadNotices">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="noticeList" border v-loading="loading">
        <el-table-column prop="noticeId" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
          @size-change="loadNotices"
          @current-change="loadNotices"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 100%"
          />
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
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNotices, createNotice, updateNotice, deleteNotice } from '@/api'

const noticeList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)

const searchForm = reactive({
  keyword: ''
})

const form = reactive({
  noticeId: null,
  title: '',
  content: '',
  publishTime: null
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const loadNotices = async () => {
  loading.value = true
  try {
    const res = await getNotices({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword || undefined
    })
    noticeList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    console.error('加载通知列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.keyword = ''
  loadNotices()
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  form.noticeId = null
  form.title = ''
  form.content = ''
  form.publishTime = new Date()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  form.noticeId = row.noticeId
  form.title = row.title
  form.content = row.content
  form.publishTime = new Date(row.publishTime)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '提示', {
      type: 'warning'
    })
    await deleteNotice(row.noticeId)
    ElMessage.success('删除成功')
    loadNotices()
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
        const data = {
          title: form.title,
          content: form.content
        }
        if (form.publishTime) {
          data.publishTime = form.publishTime
        }
        if (form.noticeId) {
          await updateNotice(form.noticeId, data)
        } else {
          await createNotice(data)
        }
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadNotices()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.admin-notices {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
