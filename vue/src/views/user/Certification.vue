<template>
  <div class="certification-page">
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
    <div class="certification">
      <el-card>
      <template #header>
        <div class="card-header">
          <span>配送员认证</span>
        </div>
      </template>
      <div v-if="certification">
        <el-alert
          :title="getStatusTitle()"
          :type="getStatusType()"
          :description="getStatusDescription()"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-descriptions :column="2" border>
          <el-descriptions-item label="真实姓名">{{ certification.realName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ certification.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ certification.idNumber }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ certification.studentId }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ formatTime(certification.submitTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStatusType()">{{ certification.certStatus }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="certification.certStatus === '已拒绝'" style="margin-top: 20px">
          <el-button type="primary" @click="showForm = true">重新提交</el-button>
        </div>
      </div>
      <el-form v-else :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入身份证号" maxlength="18" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="学生证照片" prop="studentCardImage">
          <el-input v-model="form.studentCardImage" placeholder="学生证照片URL（暂不支持上传）" />
          <div class="form-tip">注：图片上传功能开发中，请先填写图片URL</div>
        </el-form-item>
        <el-form-item label="身份证照片" prop="idCardImage">
          <el-input v-model="form.idCardImage" placeholder="身份证照片URL（暂不支持上传）" />
          <div class="form-tip">注：图片上传功能开发中，请先填写图片URL</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交认证</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Box, User } from '@element-plus/icons-vue'
import { getMyCertification, submitCertification } from '@/api'

const userStore = useUserStore()
const activeIndex = ref('/certification')

const certification = ref(null)
const showForm = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  realName: '',
  idNumber: '',
  phoneNumber: '',
  studentId: '',
  studentCardImage: '',
  idCardImage: ''
})

const rules = {
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  idNumber: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }]
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const getStatusType = () => {
  if (!certification.value) return 'info'
  const statusMap = {
    '审核中': 'warning',
    '已通过': 'success',
    '已拒绝': 'danger'
  }
  return statusMap[certification.value.certStatus] || 'info'
}

const getStatusTitle = () => {
  if (!certification.value) return ''
  return `认证状态：${certification.value.certStatus}`
}

const getStatusDescription = () => {
  if (!certification.value) return ''
  const descMap = {
    '审核中': '您的认证申请正在审核中，请耐心等待',
    '已通过': '恭喜您，认证已通过！您现在可以接单了',
    '已拒绝': '很抱歉，您的认证申请未通过，请重新提交'
  }
  return descMap[certification.value.certStatus] || ''
}

const loadCertification = async () => {
  try {
    const res = await getMyCertification()
    if (res.data) {
      certification.value = res.data
      if (res.data.certStatus === '已拒绝') {
        showForm.value = true
        Object.assign(form, {
          realName: res.data.realName || '',
          idNumber: res.data.idNumber || '',
          phoneNumber: res.data.phoneNumber || '',
          studentId: res.data.studentId || '',
          studentCardImage: res.data.studentCardImage || '',
          idCardImage: res.data.idCardImage || ''
        })
      }
    } else {
      showForm.value = true
    }
  } catch (error) {
    console.error('加载认证信息失败:', error)
    showForm.value = true
  }
}

const handleLogout = () => {
  userStore.logout()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await submitCertification(form)
        ElMessage.success('认证申请提交成功，请等待审核')
        showForm.value = false
        loadCertification()
      } catch (error) {
        console.error('提交认证失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadCertification()
})
</script>

<style scoped>
.certification-page {
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

.certification {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>
