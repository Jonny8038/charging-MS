import request from '@/utils/request'

// 查询车型列表
export function listCartype(query) {
  return request({
    url: '/app/cartype/list',
    method: 'get',
    params: query
  })
}

// 查询车型详细
export function getCartype(id) {
  return request({
    url: '/app/cartype/' + id,
    method: 'get'
  })
}

// 新增车型
export function addCartype(data) {
  return request({
    url: '/app/cartype',
    method: 'post',
    data: data
  })
}

// 修改车型
export function updateCartype(data) {
  return request({
    url: '/app/cartype',
    method: 'put',
    data: data
  })
}

// 删除车型
export function delCartype(id) {
  return request({
    url: '/app/cartype/' + id,
    method: 'delete'
  })
}
