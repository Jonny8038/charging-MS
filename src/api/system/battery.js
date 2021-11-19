import request from '@/utils/request'

// 查询电池列表
export function listBattery(query) {
  return request({
    url: '/system/battery/list',
    method: 'get',
    params: query
  })
}

// 查询电池详细
export function getBattery(id) {
  return request({
    url: '/system/battery/' + id,
    method: 'get'
  })
}

// 新增电池
export function addBattery(data) {
  return request({
    url: '/system/battery',
    method: 'post',
    data: data
  })
}

// 修改电池
export function updateBattery(data) {
  return request({
    url: '/system/battery',
    method: 'put',
    data: data
  })
}

// 删除电池
export function delBattery(id) {
  return request({
    url: '/system/battery/' + id,
    method: 'delete'
  })
}

