import request from '@/utils/request'

// 查询预约记录列表
export function listReserve(query) {
  return request({
    url: '/app/reserve/list',
    method: 'get',
    params: query
  })
}

// 查询预约记录详细
export function getReserve(id) {
  return request({
    url: '/app/reserve/' + id,
    method: 'get'
  })
}

// 新增预约记录
export function addReserve(data) {
  return request({
    url: '/app/reserve',
    method: 'post',
    data: data
  })
}

// 修改预约记录
export function updateReserve(data) {
  return request({
    url: '/app/reserve',
    method: 'put',
    data: data
  })
}

// 删除预约记录
export function delReserve(id) {
  return request({
    url: '/app/reserve/' + id,
    method: 'delete'
  })
}
