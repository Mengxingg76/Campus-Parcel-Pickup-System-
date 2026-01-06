import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register, getCurrentUser } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const loginUser = async (username, password) => {
    const res = await login(username, password)
    if (res.code === 200) {
      setToken(res.data.token)
      setUser(res.data.user)
      return true
    }
    return false
  }

  const registerUser = async (username, password, nickname, role = 'user') => {
    const res = await register(username, password, nickname, role)
    return res.code === 200
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const fetchUser = async () => {
    try {
      if (!token.value || token.value.trim() === '') {
        return
      }
      const res = await getCurrentUser()
      if (res.code === 200 && res.data) {
        setUser(res.data)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果 token 无效，清除登录状态
      if (error.response?.status === 401) {
        logout()
      }
    }
  }

  return {
    token,
    user,
    setToken,
    setUser,
    loginUser,
    registerUser,
    logout,
    fetchUser
  }
})

