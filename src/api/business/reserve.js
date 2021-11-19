import request from '@/utils/request'

// 查询预约记录列表
export function listReserve(query) {
  return request({
    url: '/app/reserve/list',
    method: 'get',
    params: query
  })
}

// 删除预约记录
export function delReserve(id) {
  return request({
    url: '/app/reserve/' + id,
    method: 'delete'
  })
}

// // 导出预约记录
// export function exportReserve(query) {
//   return request({
//     url: '/app/reserve/export',
//     method: 'post',
//     params: query
//   })
// }
