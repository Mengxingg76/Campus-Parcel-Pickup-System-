import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    // 显示更详细的错误信息
    let errorMessage = '网络错误'
    if (error.response) {
      // 服务器返回了响应
      const status = error.response.status
      const data = error.response.data
      if (data && data.message) {
        errorMessage = data.message
      } else if (status === 401) {
        errorMessage = '用户名或密码错误，或未授权'
      } else if (status === 404) {
        errorMessage = '请求的接口不存在'
      } else if (status === 500) {
        errorMessage = '服务器内部错误'
      } else {
        errorMessage = `请求失败 (${status})`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '无法连接到服务器，请检查后端服务是否运行'
    } else {
      // 其他错误
      errorMessage = error.message || '网络错误'
    }
    
    ElMessage.error(errorMessage)
    
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      // 只有在非登录页面时才清除登录状态
      if (window.location.pathname !== '/login') {
        userStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default request

