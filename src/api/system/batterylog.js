import request from '@/utils/request'

// 查询电池记录列表
export function listBatterylog(query) {
  return request({
    url: '/system/batterylog/list',
    method: 'get',
    params: query
  })
}

// 查询电池记录详细
export function getBatterylog(id) {
  return request({
    url: '/system/batterylog/' + id,
    method: 'get'
  })
}

// 新增电池记录
export function addBatterylog(data) {
  return request({
    url: '/system/batterylog',
    method: 'post',
    data: data
  })
}

// 修改电池记录
export function updateBatterylog(data) {
  return request({
    url: '/system/batterylog',
    method: 'put',
    data: data
  })
}

// 删除电池记录
export function delBatterylog(id) {
  return request({
    url: '/system/batterylog/' + id,
    method: 'delete'
  })
}
