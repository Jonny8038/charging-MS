import request from '@/utils/request'

// 查询用户列表
export function listHexuser(query) {
  return request({
    url: '/app/hexuser/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getHexuser(userId) {
  return request({
    url: '/app/hexuser/' + userId,
    method: 'get'
  })
}

// 新增用户
export function addHexuser(data) {
  return request({
    url: '/app/hexuser',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateHexuser(data) {
  return request({
    url: '/app/hexuser',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delHexuser(userId) {
  return request({
    url: '/app/hexuser/' + userId,
    method: 'delete'
  })
}
