import request from '@/utils/request'

// 查询系统消息录列表
export function listNews(query) {
  return request({
    url: '/app/sysmsg/list',
    method: 'get',
    params: query
  })
}

// 新增系统消息录
export function addNews(data) {
  return request({
    url: '/app/sysmsg/save',
    method: 'post',
    data: data
  })
}

// 查询消息详情
export function getNewsDetail(id) {
  return request({
    url: '/app/sysmsg/' + id,
    method: 'get'
  })
}

// 删除消息
export function delNewsList(id){
  return request({
    url: '/app/sysmsg/delete/' + id,
    method: 'post'
  })
}
