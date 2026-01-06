import request from './request'

export const login = (username, password) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

export const register = (username, password, nickname, role = 'user') => {
  return request({
    url: '/auth/register',
    method: 'post',
    data: { username, password, nickname, role }
  })
}

export const getCurrentUser = () => {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}

