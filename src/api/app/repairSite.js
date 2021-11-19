import request from '@/utils/request'

// 查询站点列表
export function listSite(query) {
  return request({
    url: '/app/servicesite/list',
    method: 'get',
    params: query
  })
}

// 查询站点详细
export function getSite(id) {
  return request({
    url: '/app/servicesite/' + id,
    method: 'get'
  })
}

// 新增站点
export function addSite(data) {
  return request({
    url: '/app/servicesite/save',
    method: 'post',
    data: data
  })
}

// 修改站点
export function updateSite(data) {
  return request({
    url: '/app/servicesite',
    method: 'put',
    data: data
  })
}

// 删除站点
export function delSite(id) {
  return request({
    url: '/app/servicesite/delete/' + id,
    method: 'post'
  })
}

//更新营业状态
export function updateSiteType(query) {
  return request({
    url: '/app/servicesite/status/update',
    method: 'post',
    params:query
  })
}
