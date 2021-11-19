<template>
  <el-dialog :title="rowInfo.deviceName"
             :visible="showCommondOrderDialog"
             :before-close="handleClose"
             width="400px"
             class="commond-dialog"
             :close-on-click-modal="false"
             append-to-body>
     <div class="device-info-box">
       <div>设备ID：{{ deviceInfo.deviceId }}</div>
       <div>运行状态：{{ deviceInfo.workStatus==2?'运行中':'停止' }}</div>
     </div>
     <div class="count-box">
       <i class="el-icon-circle-plus-outline" @click="addTemperature"></i>
       <div class="count-content"><el-input v-model.number="intTemperature" @input="changeTemperature" class="content-edit" /><span>.{{ temperature.toString().replace(/\d+\.(\d*)/,"$1") }}</span>℃</div>
       <i class="el-icon-remove-outline" @click="decreaseTemperature"></i>
     </div>
<!--     <div class="count-box" v-if="rowInfo.type==2"><span>91.3</span>&nbsp;&nbsp;%RH</div>-->
<!--     <div class="check-button"><el-button type="primary" size="mini" @click="getDeviceInfo">查询</el-button></div>-->
<!--    <div class="check-time-box">最新查询时间：{{ deviceInfo.updateTime }}</div>-->
    <div class="check-button"><el-button type="primary" size="mini" @click="sendOrder" :disabled="isSend">发送指令</el-button></div>
    <div class="temperature-box">
      <div>最高温度：{{rowInfo.maxValue}}℃</div>
      <div>最低温度：{{rowInfo.minValue}}℃</div>
    </div>
  </el-dialog>
</template>

<script>
import { listSiteDeviceInfo,deviceAddDeleteOrder2 } from "@/api/app/siteDevice";
import {fortTime} from '@/utils/date'
export default {
  name: 'commondOrderDialog',
  props:{
    showCommondOrderDialog:Boolean,
    rowInfo:Object
  },
  data() {
    return {
      deviceInfo:null,
      temperature:0,
      intTemperature:0,
      isSend:false
    }
  },
  methods: {
    /** 查询站内设备列表信息 */
    getDeviceInfo() {
      // let data={
      //   deviceId:this.rowInfo.deviceId
      // }
      // listSiteDeviceInfo(data).then((response) => {
      //   if(response){
      //     this.deviceInfo=response
      //     this.deviceInfo.updateTime=fortTime(new Date(),'yyyy-MM-dd HH:mm:ss')
      //     this.msgSuccess("数据更新成功！");
      //     this.$emit('reload');
      //   }else{
      //     this.msgError("数据更新失败！");
      //   }
      // });
    },
    //发送指令
    sendOrder(){
      let number=Number(this.intTemperature)+Number('0.'+this.temperature.toString().replace(/\d+\.(\d*)/,"$1"))
      if(this.rowInfo.maxValue<number){
        this.intTemperature=parseInt(this.deviceInfo.temperature)
        this.msgInfo("该温度不能大于最高温度阈值,请重新输入！");
        return false
      }
      if(this.rowInfo.minValue>number){
        this.intTemperature=parseInt(this.deviceInfo.temperature)
        this.msgInfo("该温度不能小于最低温度阈值,请重新输入！");
        return false
      }
      let data = new FormData()
      data.append('deviceId',this.rowInfo.deviceId)
      data.append('newValue',this.intTemperature)
      data.append('originalValue',parseInt(this.deviceInfo.temperature))
      deviceAddDeleteOrder2(data).then((response) => {
        if(response){
          this.msgSuccess("指令发送成功！");
          this.$emit('reload');
        }else{
          this.msgError("指令发送失败！");
        }
      });
    },
    //提高温度
    addTemperature(){
      let number=this.intTemperature+Number('0.'+this.temperature.toString().replace(/\d+\.(\d*)/,"$1"))
      if(this.rowInfo.maxValue<number+1){
        this.msgInfo("该温度不能大于最高温度阈值！");
        return false
      }
      if(this.rowInfo.minValue<number+1){
        this.isSend=false
      }else{
        this.isSend=true
      }
      this.intTemperature++
    },
    //降低温度
    decreaseTemperature(){
      let number=this.intTemperature+Number('0.'+this.temperature.toString().replace(/\d+\.(\d*)/,"$1"))
      if(this.rowInfo.minValue>number-1){
        this.msgInfo("该温度不能小于最低温度阈值！");
        return false
      }
      this.isSend=false
      this.intTemperature--
    },
    //温度输入框改变温度
    changeTemperature(){
      let number=Number(this.intTemperature)+Number('0.'+this.temperature.toString().replace(/\d+\.(\d*)/,"$1"))
      if(this.rowInfo.maxValue<number){
        // this.intTemperature=parseInt(this.deviceInfo.temperature)
        this.isSend=true
        this.msgInfo("该温度不能大于最高温度阈值,请重新输入！");
        return false
      }else{
        this.isSend=false
      }
      if(this.rowInfo.minValue>number){
        // this.intTemperature=parseInt(this.deviceInfo.temperature)
        this.isSend=true
        this.msgInfo("该温度不能小于最低温度阈值,请重新输入！");
        return false
      }else{
        this.isSend=false
      }
    },
    handleClose(){
      this.$emit('update:showCommondOrderDialog',false)
    }
  },
  mounted() {
    this.temperature=this.deviceInfo.temperature
    this.intTemperature=parseInt(this.deviceInfo.temperature)
  },
  created(){
    this.deviceInfo=this.rowInfo
  }
}
</script>

<style lang="scss" scoped>
.device-info-box{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
.count-box{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 35px;
  //text-align: center;
  padding:15px 0;
  color:#02A7F0;
  span{
    font-size: 50px;
    color:#02A7F0;
  }
  .count-content{
    margin-left: -46px;
  }
  .content-edit{
    display: inline-block;
    width:100px;
    font-size: 50px;
    color:#02A7F0;
    outline: none;
    border:none;
    text-align: right;
    ::v-deep .el-input__inner{
      color:#02A7F0;
      height:auto;
      line-height: normal;
      border:none;
      padding:0;
      text-align: right;
    }
  }
  i{
    cursor: pointer;
  }
}
.check-button{
  width:100%;
  margin-bottom: 10px;
  .el-button{
    width:100%;
  }
}
.check-time-box{
  font-size: 13px;
  padding-top: 10px;
}
.temperature-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

