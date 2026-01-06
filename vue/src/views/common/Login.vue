<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="$router.push('/register')">还没有账号？立即注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
let userStore = null

try {
  userStore = useUserStore()
} catch (error) {
  console.error('Failed to get user store:', error)
}

const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

onMounted(() => {
  console.log('Login component mounted')
  if (!userStore) {
    console.error('User store not available')
  }
})

const handleLogin = async () => {
  if (!userStore) {
    ElMessage.error('系统初始化失败，请刷新页面重试')
    return
  }
  
  if (!formRef.value) {
    ElMessage.error('表单未初始化')
    return
  }
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
  } catch (error) {
    console.error('表单验证错误:', error)
    return
  }
  
  loading.value = true
  try {
    const success = await userStore.loginUser(form.username, form.password)
    if (success) {
      ElMessage.success('登录成功')
      // 等待一下确保 store 更新完成
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const role = userStore.user?.role
      if (role === 'admin') {
        router.push('/admin/dashboard').catch((err) => {
          console.error('路由跳转错误:', err)
        })
      } else if (role === 'rider') {
        router.push('/rider/hall').catch((err) => {
          console.error('路由跳转错误:', err)
        })
      } else {
        router.push('/home').catch((err) => {
          console.error('路由跳转错误:', err)
        })
      }
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>

