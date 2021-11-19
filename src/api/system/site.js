import request from '@/utils/request'

// 查询站点列表
export function listSite(query) {
  return request({
    url: '/app/site/list',
    method: 'get',
    params: query
  })
}

// 查询站点详细
export function getSite(id) {
  return request({
    url: '/app/site/' + id,
    method: 'get'
  })
}

// 新增站点
export function addSite(data) {
  return request({
    url: '/app/site',
    method: 'post',
    data: data
  })
}

// 修改站点
export function updateSite(data) {
  return request({
    url: '/app/site',
    method: 'put',
    data: data
  })
}

// 删除站点
export function delSite(id) {
  return request({
    url: '/app/site/' + id,
    method: 'delete'
  })
}
