import request from "@/utils/request";

//查询注册管理信息列表
export function listReg(query) {
  return request({
    url: "/app/car/list/reg",
    method: "get",
    params: query
  });
}
//注册管理审核通过/不通过接口
//注册管理模块审核不通过接口
export function checkPort(query) {
  return request({
    url: "/app/car/appr/status/update",
    method: "post",
    params: query
  });
}
//注册管理模块导出功能接口
export function exportReport(query) {
    return request({
      url: "/app/car/export/reg",
      method: "post",
      params: query
    });
  }


//车辆列表页面接口数据
// 查询车辆信息列表
export function listCar(query) {
    return request({
      url: "/app/car/list",
      method: "get",
      params: query
    });
  }
// 查询车辆信息详细
export function getCar(id) {
  return request({
    url: "/app/car/" + id,
    method: "get"
  });
}

// 新增车辆信息
export function addCar(data) {
  return request({
    url: "/app/car",
    method: "post",
    data: data
  });
}

// 修改车辆信息
export function updateCar(data) {
  return request({
    url: "/app/car",
    method: "put",
    data: data
  });
}

// 删除车辆信息
export function delCar(id) {
  return request({
    url: "/app/car/" + id,
    method: "delete"
  });
}
//查看弹窗数据列表
//整车数据
export function AllCar(query) {
    return request({
      url: "/device/realtime/car/list" ,
      method: "get",
      params: query
    });
  }
  //电池数据
  export function Battery(query) {
    return request({
      url: "/device/realtime/car/battery/list",
      method: "get",
      params: query,
    });
  }
  //电机数据
  export function Driver(query) {
    return request({
      url: "/device/realtime/car/driver/list" ,
      method: "get",
      params: query
    });
  }
//获取国标告警的信息
export function theAlarm(query){
    return request({
        url: "/device/realtime/car/alarm/ns/list" ,
      method: "get",
      params: query
    })
}
//获取车辆轨迹
export function getCarLine(query) {
  return request({
    url: "/device/realtime/car/pos/list" ,
    method: "get",
    params: query
  });
}

//获取车辆实时定位
export function getCarPosition(query) {
  return request({
    url: "/device/realtime/car/pos" ,
    method: "get",
    params: query
  });
}

