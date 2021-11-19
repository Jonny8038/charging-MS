import request from '@/utils/request'

// 查询系统消息录列表
export function listVideo(query) {
  return request({
    url: '/app/tutorial/list',
    method: 'get',
    params: query
  })
}

// 新增系统消息录
export function addVideo(data) {
  return request({
    url: '/app/tutorial/save',
    method: 'post',
    data: data
  })
}

// 查询消息详情
export function getVideoDetail(query) {
  return request({
    url: '/app/tutorial/detail',
    method: 'get',
    params:query
  })
}

// 删除消息
export function delVideoList(id){
  return request({
    url: '/app/tutorial/delete/' + id,
    method: 'post'
  })
}
