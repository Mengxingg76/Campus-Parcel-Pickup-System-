import request from './request'

// 订单相关
export const createOrder = (data) => {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

export const getOrders = (params) => {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

export const getOrderById = (id) => {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

export const acceptOrder = (id) => {
  return request({
    url: `/orders/${id}/accept`,
    method: 'post'
  })
}

export const completeOrder = (id) => {
  return request({
    url: `/orders/${id}/complete`,
    method: 'post'
  })
}

export const cancelOrder = (id) => {
  return request({
    url: `/orders/${id}/cancel`,
    method: 'post'
  })
}

export const updateOrderStatus = (id, status) => {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 站点相关
export const getStations = () => {
  return request({
    url: '/stations',
    method: 'get'
  })
}

export const createStation = (data) => {
  return request({
    url: '/stations',
    method: 'post',
    data
  })
}

export const updateStation = (id, data) => {
  return request({
    url: `/stations/${id}`,
    method: 'put',
    data
  })
}

export const deleteStation = (id) => {
  return request({
    url: `/stations/${id}`,
    method: 'delete'
  })
}

// 楼栋相关
export const getBuildings = () => {
  return request({
    url: '/buildings',
    method: 'get'
  })
}

export const createBuilding = (data) => {
  return request({
    url: '/buildings',
    method: 'post',
    data
  })
}

export const updateBuilding = (id, data) => {
  return request({
    url: `/buildings/${id}`,
    method: 'put',
    data
  })
}

export const deleteBuilding = (id) => {
  return request({
    url: `/buildings/${id}`,
    method: 'delete'
  })
}

// 包裹规格相关
export const getPackageSizes = () => {
  return request({
    url: '/package-sizes',
    method: 'get'
  })
}

export const createPackageSize = (data) => {
  return request({
    url: '/package-sizes',
    method: 'post',
    data
  })
}

export const updatePackageSize = (id, data) => {
  return request({
    url: `/package-sizes/${id}`,
    method: 'put',
    data
  })
}

export const deletePackageSize = (id) => {
  return request({
    url: `/package-sizes/${id}`,
    method: 'delete'
  })
}

// 通知相关
export const getNotices = (params) => {
  return request({
    url: '/notices',
    method: 'get',
    params
  })
}

export const getNoticeById = (id) => {
  return request({
    url: `/notices/${id}`,
    method: 'get'
  })
}

export const createNotice = (data) => {
  return request({
    url: '/notices',
    method: 'post',
    data
  })
}

export const updateNotice = (id, data) => {
  return request({
    url: `/notices/${id}`,
    method: 'put',
    data
  })
}

export const deleteNotice = (id) => {
  return request({
    url: `/notices/${id}`,
    method: 'delete'
  })
}

// 用户相关
export const getUsers = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export const getUserById = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export const changePassword = (data) => {
  return request({
    url: '/users/change-password',
    method: 'post',
    data
  })
}

export const recharge = (amount) => {
  return request({
    url: '/users/recharge',
    method: 'post',
    data: { amount }
  })
}

// 配送员相关
export const getRiders = (params) => {
  return request({
    url: '/riders',
    method: 'get',
    params
  })
}

export const submitCertification = (data) => {
  return request({
    url: '/riders/certification',
    method: 'post',
    data
  })
}

export const getMyCertification = () => {
  return request({
    url: '/riders/my-certification',
    method: 'get'
  })
}

export const reviewCertification = (id, certStatus, reason) => {
  return request({
    url: `/riders/${id}/review`,
    method: 'put',
    data: { certStatus, reason }
  })
}

// 仪表板相关
export const getDashboardStats = () => {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

