import request from '@/utils/request'

// 查询电池列表
export function listBattery(query) {
  return request({
    url: '/app/battery/site/list',
    method: 'get',
    params: query
  })
}

// 查询电池详细
export function getBattery(id) {
  return request({
    url: '/app/battery/' + id,
    method: 'get'
  })
}

// 新增电池
export function addBattery(data) {
  return request({
    url: '/app/battery/save',
    method: 'post',
    data: data
  })
}

// 修改电池
export function updateBattery(data) {
  return request({
    url: '/app/battery',
    method: 'put',
    data: data
  })
}

// 删除电池
export function delBattery(id) {
  return request({
    url: '/app/battery/' + id,
    method: 'delete'
  })
}

// 维修电池
  export function addupdateodr(id) {
    return request({
      url: '/app/battery/addupdateodr/' + id,
      method: 'post'
    })
}

// 查询站点电池状态详细
export function getBatteryStatusDetail(id) {
  return request({
    url: '/app/battery/real/list?siteId=' + id,
    method: 'get'
  })
}

// 查询电池适配车辆字段表
export function listCarType() {
  return request({
    url: '/app/cartype/list',
    method: 'get',
  })
}

// 查询站点下的电池列表
export function listSiteBattery(query) {
  return request({
    url: '/app//battery/list',
    method: 'get',
    params: query
  })
}

// 删除站点下的电池
export function delBatteryList(id){
  return request({
    url: '/app/battery/delete/' + id,
    method: 'post'
  })
}
