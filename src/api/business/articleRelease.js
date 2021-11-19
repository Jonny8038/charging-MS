import request from '@/utils/request'

// 站点资讯列表
export function listArticle(query) {
  return request({
    url: '/app/admin/news/list',
    method: 'get',
    params: query
  })
}

// 新增站点资讯
export function addArticle(data) {
  return request({
    url: '/app/admin/news/save',
    method: 'post',
    data: data
  })
}

// 删除站点资讯
export function getArticleDetail(query) {
  return request({
    url: '/app/admin/news/detail',
    method: 'get',
    params:query
  })
}

// 删除站点资讯
export function delArticle(id) {
  return request({
    url: '/app/admin/news/delete/'+id,
    method: 'post',
  })
}
