import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/user/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/common/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/common/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/user/Order.vue'),
    meta: { title: '快递代取', requiresAuth: true }
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: () => import('@/views/user/MyOrders.vue'),
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/recharge',
    name: 'Recharge',
    component: () => import('@/views/user/Recharge.vue'),
    meta: { title: '账户充值', requiresAuth: true }
  },
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/views/user/Notice.vue'),
    meta: { title: '通知公告' }
  },
  {
    path: '/certification',
    name: 'Certification',
    component: () => import('@/views/user/Certification.vue'),
    meta: { title: '配送员认证', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/rider/hall',
    name: 'RiderHall',
    component: () => import('@/views/rider/Hall.vue'),
    meta: { title: '接单大厅', requiresAuth: true, requiresRole: 'rider' }
  },
  {
    path: '/rider/records',
    name: 'RiderRecords',
    component: () => import('@/views/rider/Records.vue'),
    meta: { title: '接单记录', requiresAuth: true, requiresRole: 'rider' }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresRole: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        name: 'AdminRoles',
        component: () => import('@/views/admin/Roles.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'stations',
        name: 'AdminStations',
        component: () => import('@/views/admin/Stations.vue'),
        meta: { title: '快递站点管理' }
      },
      {
        path: 'buildings',
        name: 'AdminBuildings',
        component: () => import('@/views/admin/Buildings.vue'),
        meta: { title: '宿舍楼管理' }
      },
      {
        path: 'sizes',
        name: 'AdminSizes',
        component: () => import('@/views/admin/Sizes.vue'),
        meta: { title: '包裹规格管理' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'riders',
        name: 'AdminRiders',
        component: () => import('@/views/admin/Riders.vue'),
        meta: { title: '配送员管理/审核' }
      },
      {
        path: 'notices',
        name: 'AdminNotices',
        component: () => import('@/views/admin/Notices.vue'),
        meta: { title: '通知公告' }
      },
      {
        path: 'menus',
        name: 'AdminMenus',
        component: () => import('@/views/admin/Menus.vue'),
        meta: { title: '菜单管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  try {
    // 处理根路径重定向：根据登录状态决定跳转
    if (to.path === '/') {
      try {
        const userStore = useUserStore()
        if (userStore.token && userStore.token.trim() !== '') {
          next('/home')
        } else {
          next('/login')
        }
      } catch (e) {
        // Store 可能还没初始化，直接跳转到登录页
        next('/login')
      }
      return
    }
    
    // 获取 store（可能失败，需要捕获）
    let userStore = null
    try {
      userStore = useUserStore()
    } catch (e) {
      console.warn('Store not available:', e)
    }
    
    // 登录页面：如果已登录，重定向到首页
    if (to.path === '/login') {
      if (userStore && userStore.token && userStore.token.trim() !== '') {
        const role = userStore.user?.role
        if (role === 'admin') {
          next('/admin/dashboard')
        } else if (role === 'rider') {
          next('/rider/hall')
        } else {
          next('/home')
        }
      } else {
        // 未登录，允许访问登录页
        next()
      }
      return
    }
    
    // 如果是重定向路由，直接放行
    if (to.redirect) {
      next()
      return
    }
    
    // 权限检查（需要 store 可用）
    if (userStore) {
      // 检查是否需要认证
      if (to.meta.requiresAuth) {
        // 检查 token 是否存在且不为空
        if (!userStore.token || userStore.token.trim() === '') {
          console.log('路由守卫: 需要认证但未登录，跳转到登录页', { path: to.path })
          next('/login')
          return
        }
      }
      
      // 检查是否需要特定角色
      if (to.meta.requiresRole) {
        if (userStore.user?.role !== to.meta.requiresRole) {
          console.log('路由守卫: 角色不匹配，跳转到首页', { 
            path: to.path, 
            required: to.meta.requiresRole, 
            current: userStore.user?.role 
          })
          next('/home')
          return
        }
      }
      
      // 所有检查通过，允许访问
      next()
    } else {
      // Store 不可用
      if (to.meta.requiresAuth) {
        console.log('路由守卫: Store不可用但需要认证，跳转到登录页', { path: to.path })
        next('/login')
      } else {
        // 不需要认证，允许访问
        next()
      }
    }
  } catch (error) {
    console.error('Router guard error:', error)
    console.error('Error details:', { to: to.path, from: from.path, error: error.message })
    // 如果出错，重定向到登录页（除非已经在登录页）
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router

