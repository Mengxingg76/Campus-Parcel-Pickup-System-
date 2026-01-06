<template>
  <div class="profile-page">
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
    <div class="profile">
      <el-card>
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>基本信息</span>
            </template>
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="userInfo.nickname" />
              </el-form-item>
              <el-form-item label="角色">
                <el-tag :type="getRoleType(userInfo.role)">
                  {{ getRoleName(userInfo.role) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="账户余额">
                <span class="balance">¥{{ userInfo.balance || '0.00' }}</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdateInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>修改密码</span>
            </template>
            <el-form :model="passwordForm" label-width="100px" :rules="passwordRules" ref="passwordFormRef">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Box, User } from '@element-plus/icons-vue'
import { getUserById, updateUser, changePassword } from '@/api'
import { getCurrentUser } from '@/api/auth'

const userStore = useUserStore()
const activeIndex = ref('/profile')
const userInfo = ref({})
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const getRoleType = (role) => {
  const roleMap = {
    'user': 'info',
    'rider': 'success',
    'admin': 'danger'
  }
  return roleMap[role] || 'info'
}

const getRoleName = (role) => {
  const roleMap = {
    'user': '普通用户',
    'rider': '配送员',
    'admin': '管理员'
  }
  return roleMap[role] || '未知'
}

const loadUserInfo = async () => {
  try {
    const res = await getCurrentUser()
    userInfo.value = res.data || {}
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const handleUpdateInfo = async () => {
  try {
    await updateUser(userInfo.value.userId, {
      nickname: userInfo.value.nickname
    })
    ElMessage.success('修改成功')
    userStore.fetchUser()
    loadUserInfo()
  } catch (error) {
    console.error('更新用户信息失败:', error)
  }
}

const handleLogout = () => {
  userStore.logout()
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await changePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
        ElMessage.success('密码修改成功')
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordFormRef.value.resetFields()
      } catch (error) {
        console.error('修改密码失败:', error)
      }
    }
  })
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.profile-page {
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

.profile {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.balance {
  font-size: 24px;
  color: #67c23a;
  font-weight: bold;
}
</style>
