import request from '@/utils/request'

// 查询换电列表
export function listBatteryChange(query) {
  return request({
    url: '/app/order/list',
    method: 'get',
    params: query
  })
}

// 查询换电详细
export function getBatteryChange(id) {
  return request({
    url: '/app/order/' + id,
    method: 'get'
  })
}

// 新增换电
export function addBatteryChange(data) {
  return request({
    url: '/app//order',
    method: 'post',
    data: data
  })
}

// 修改换电
export function updateBatteryChange(data) {
  return request({
    url: '/app/order',
    method: 'put',
    data: data
  })
}

// 删除换电
export function delBatteryChange(id) {
  return request({
    url: '/app/order/' + id,
    method: 'delete'
  })
}


