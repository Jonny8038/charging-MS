import request from '@/utils/request'

// 查询站内设备列表
export function listSiteDevice(query) {
  return request({
    url: '/site/site/device/list',
    method: 'get',
    params: query
  })
}

// 查询站内设备信息列表
export function listSiteDeviceInfo(query) {
  return request({
    url: '/site/site/device/get',
    method: 'get',
    params: query
  })
}

// 查询站内设备增减命令发送
export function deviceAddDeleteOrder(data) {
  return request({
    url: '/site/site/device/command/send/2',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}
export function deviceAddDeleteOrder2(data) {
  return request({
    url: '/site/site/device/command/send/2/value/set',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

