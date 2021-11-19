import request from '@/utils/request'

// 查询各省列表
export function listProvince() {
  return request({
    url: '/system/address/province/list',
    method: 'get',
  })
}
// 查询各省列表
export function listCity(query) {
  return request({
    url: '/system/address/city/list',
    method: 'get',
    params: query
  })
}
// 查询各省列表
export function listArea(query) {
  return request({
    url: '/system/address/area/list',
    method: 'get',
    params: query
  })
}
