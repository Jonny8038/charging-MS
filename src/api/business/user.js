import request from '@/utils/request'

// 查询用户列表
export function listHexUser(query) {
  return request({
    url: '/app/hexuser/list',
    method: 'get',
    params: query
  })
}
// 查询用户详细
export function getHexUser(id) {
  return request({
    url: '/app/hexuser/' + id,
    method: 'get'
  })
}

// 新增用户
export function addHexUser(data) {
  return request({
    url: '/app//hexuser',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateHexUser(data) {
  return request({
    url: '/app/hexuser',
    method: 'put',
    data: data
  })
}
// 删除用户
export function delHexUser(id) {
  return request({
    url: '/app/hexuser/' + id,
    method: 'delete'
  })
}
