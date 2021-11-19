import request from '@/utils/request'

// 查询换电订单记录列表
export function listOrder(query) {
  return request({
    url: '/app/order/list',
    method: 'get',
    params: query
  })
}

// 查询换电订单记录详细
export function getOrder(id) {
  return request({
    url: '/app/order/' + id,
    method: 'get'
  })
}

// 新增换电订单记录
export function addOrder(data) {
  return request({
    url: '/app/order',
    method: 'post',
    data: data
  })
}

// 修改换电订单记录
export function updateOrder(data) {
  return request({
    url: '/app/order',
    method: 'put',
    data: data
  })
}

// 删除换电订单记录
export function delOrder(id) {
  return request({
    url: '/app/order/' + id,
    method: 'delete'
  })
}
