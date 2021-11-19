<template>
  <el-dialog  title="电池详情"
              fullscreen
              :visible="showBatteryStatus"
              :modal-append-to-body="false"
              :close-on-click-modal="false">
    <div class="battery-status-box">
      <div class="battery-header">
        <div class="battery-logo"><span>广远咔咔换电系统电池充电状态看板</span></div>
        <div class="close-icon" @click="handleClose"></div>
      </div>
      <div class="battery-list-box">
        <vue-scroll>
          <div class="battery-list-content">
            <div class="no-battery-info" v-if="!batteryData.length">暂无站点电池详情！</div>
            <div class="battery-list-item-box" v-for="(item,index) in batteryData" :key="index">
              <div class="battery-list-item-content">
                <ul class="battery-info-item">
                  <li>CC1状态：<span class="cc1Status" :class="item.cc1Status==0?'green_bg':'red_bg'"></span></li>
                  <li>通讯状态：<i class="signal-status"></i></li>
                  <li :class="item.chargeStatus==1?'':'green_font'">充电状态：{{changeStatus(item.chargeStatus)}}</li>
<!--                  <li :class="item.chargeStatus==1?'':'green_font'">充电状态：{{item.chargeStatus==1?'充电中':'结束充电'}}</li>-->
                  <li>电池SOC：{{ item.soc }}%</li>
<!--                  <li :class="item.SOH<100?'red_font':''">电池SOH：{{ item.SOH }}%</li>-->
                  <li>电池SOH：100%</li>
                  <li>当前输出电流：{{ item.current }} </li>
                  <li>单体最高电压：{{ item.maxVolt }}</li>
                  <li>单体最低电压：{{ item.minVolt }}</li>
                  <li>单体最高温度：{{ item.maxTemperature }}</li>
                  <li>单体最低温度：{{ item.minTemperature }}</li>
                </ul>
                <div class="battery-charge-box">
                  <div class="battery-box">
                    <div class="battery-count-process" :style="{'width':item.soc+'%'}" :class="changeBatteryStatus(item.soc)"></div>
                    <div class="charge-icon" v-if="item.soc!=100"></div>
                  </div>
                  <div class="battery-num-count">{{item.storeNo}}仓{{item.batteryNo}}号{{ item.soc }}%</div>
                </div>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getBatteryStatusDetail } from "@/api/app/battery";
export default {
  name: 'batteryStatus',
  props:{
    showBatteryStatus:Boolean,
    batteryStationId:[String,Number]
  },
  data() {
    return {
      batteryData:[]
    }
  },
  //监听站点id的变化，查询对应的站点电池详情
  watch:{
    batteryStationId(val){
      this.batteryData=[];
      this.getStationBattery(val)
    }
  },
  methods: {
    handleClose(){
      this.$emit('update:showBatteryStatus',false);
    },
    //根据电池电量显示不同的电池背景色
    changeBatteryStatus(val){
      if(val>0&&val<=10){
        return 'red_bg'
      }else if(val>10&&val<=20){
        return 'yellow_bg'
      }else if(val==100){
        return 'green_bg borderRadius'
      }else{
        return 'green_bg'
      }
    },
    //根据电池电量显示不同的电池背景色
    changeStatus(val){
      let obj={
        0:'空',
        1:'连接中',
        2:'已连接',
      }
      return obj[val]
    },
    //根据站点id查询该站点的所有电池详细信息
    getStationBattery(id){
      this.loading = true;
      getBatteryStatusDetail(id).then((res)=>{
        this.batteryData=res.rows;
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.battery-status-box{
  width:100%;
  height:100%;
  background: url('../../../assets/images/batteryStatus/page_bg.png') no-repeat center center;
  background-size: cover;
  .battery-header{
    width:100%;
    height:87px;
    position: relative;
    .battery-logo{
      width: 1083px;
      height: 87px;
      background: url('../../../assets/images/batteryStatus/logo-bg.png') no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      top:-2px;
      left:50%;
      -ms-transform: translate(-50%,0);
      -webkit-transform: translate(-50%,0);
      transform: translate(-50%,0);
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        font-family: 'PingFang SC';
        color:#11E4FFFF;
        font-size: 28px;
      }
    }
    .close-icon{
      width: 34px;
      height: 34px;
      background: url('../../../assets/images/batteryStatus/close.png') no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      top:0;
      right:0;
      cursor: pointer;
    }
  }
  .battery-list-box{
    width:100%;
    height:calc(100% - 87px);
    padding:20px 20px 20px 20px;
    overflow: hidden;
    .battery-list-content{
      width:100%;
      height:100%;
      display: flex;
      flex-wrap: wrap;
      //overflow-y: hidden;
      .battery-list-item-box{
        width:20%;
        padding:5px 10px;
        .battery-list-item-content{
          width:100%;
          height: 214px;
          background: url('../../../assets/images/batteryStatus/info_bg.png') no-repeat center center;
          background-size: 100% 100%;
          position: relative;
          .battery-info-item{
            width:100%;
            height:100%;
            padding:10px;
            li{
              list-style: none;
              color:#00FEFFFF;
              font-size: 14px;
              display: flex;
              align-items: center;
              .cc1Status{
                display:inline-block;
                width:14px;
                height: 14px;
                border-radius: 50%;
              }
              .signal-status{
                display: inline-block;
                width: 14px;
                height: 12px;
                background: url('../../../assets/images/batteryStatus/singal_status.png') no-repeat center center;
                background-size: 100% 100%;
              }
            }
          }
          .battery-charge-box{
            position: absolute;
            right:20px;
            top:50%;
            -ms-transform: translate(0,-50%);
            -webkit-transform: translate(0,-50%);
            transform: translate(0,-50%);
            .battery-box{
              width:145px;
              height: 84px;
              background-color: #fff;
              border-radius: 10px;
              position: relative;
              margin-bottom: 10px;
              .battery-count-process{
                width:10%;
                height:100%;
                border-radius: 10px 0 0 10px;
              }
              .charge-icon{
                width: 45px;
                height: 58px;
                background: url('../../../assets/images/batteryStatus/charge_on.png') no-repeat center center;
                background-size: 100% 100%;
                position: absolute;
                top:50%;
                left:50%;
                -ms-transform: translate(-50%,-50%);
                -webkit-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
                z-index:10;
              }
            }
            .battery-box:after{
              display: block;
              content:'';
              width: 8px;
              height: 33px;
              background-color: #fff;
              border-radius: 0 10px 10px 0;
              position: absolute;
              right:-8px;
              top:50%;
              -ms-transform: translate(0,-50%);
              -webkit-transform: translate(0,-50%);
              transform: translate(0,-50%);
            }
            .battery-num-count{
              color:#fff;
              font-family: 'PingFang SC';
              font-weight: bold;
              font-size: 14px;
              text-align: center;
            }
          }
        }
      }
      .no-battery-info{
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#fff;
        font-size: 14px;
      }
    }
  }
  @media screen and(max-width: 1900px){
    .battery-header{
      width:100%;
      height:50px;
      .battery-logo{
        width: 622px;
        height: 50px;
        span{
          font-size: 18px;
        }
      }
    }
    .battery-list-box{
      width:100%;
      height:calc(100% - 50px);
      padding:10px;
      .battery-list-content{
        .battery-list-item-box{
          width:25%;
          padding:5px;
          .battery-list-item-content{
            .battery-info-item{
              li{
                font-size: 14px;
              }
            }
            .battery-charge-box{
              .battery-num-count{
                font-size: 18px;
              }
            }
          }
        }
      }
    }
  }
  ::v-deep.__bar-is-vertical{
    background: #1d2f61 !important;
  }
  ::v-deep.__view{
    height:100%!important;
  }
  .green_bg{
    background-color: #49D761FF;
  }
  .yellow_bg{
    background-color: #F5E603FF;
  }
  .red_bg{
    background-color: #F12222FF;
  }
  .borderRadius{
    border-radius: 10px!important;
  }
  .green_font{
    color:#49D761FF!important;
  }
  .red_font{
    color:#F12222FF!important;
  }
}
</style>
