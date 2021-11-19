<template>
  <el-dialog :title="'车辆轨迹 - '+vehicleNum" :visible="showCarLine"  :before-close="handleClose" width="80%" append-to-body>
    <el-form :inline="true" size='mini' ref="form">
      <el-form-item>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <i class="el-icon-video-play play-icon" title="开始播放" v-show="!play" @click="playLine"></i>
        <i class="el-icon-video-pause play-icon"  title="暂停播放" v-show="play" @click="stop"></i>
      </el-form-item>
    </el-form>
    <div class="line-map">
      <baidu-map
        class="bm-view"
        :zoom="12"
        :scroll-wheel-zoom="true"
        @ready="handler"
        :mapClick="false">
        <bm-polyline :path="lineData" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="3" :editing="false" :massClear="true"></bm-polyline>
        <bm-marker :icon="{url:startIcon,size: {width: 29, height: 35}}" :position="startPosition"></bm-marker>
        <bm-marker :icon="{url:endIcon,size: {width: 29, height: 35}}" :position="endPosition"></bm-marker>
      </baidu-map>
    </div>
    <div class="table-box">
      <el-table border
                height="100%"
                size="mini"
                stripe
                v-loading="loading"
                :data="tableData"
                highlight-current-row
                @row-click="selectRow"
                ref="table"
                id="line-detail-grid">
        <el-table-column type='index' label="序号" width="60" align="center"/>
        <el-table-column label="经度" align="center" prop="positionX" />
        <el-table-column label="纬度" align="center" prop="positionY" />
        <el-table-column label="速度" align="center" prop="speed" />
        <el-table-column label="报警" align="center" prop="alarms" />
        <el-table-column label="状态" align="center" prop="carStatus" />
        <el-table-column label="定位时间" align="center" prop="obdTime" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import {getAngle} from '@/utils/bDMap.js'
import { getCarLine } from '@/api/app/car'
let _minTime = null
let _maxTime = null
export default {
  name: 'carLineDialog',
  components:{
    // BmlLushu
  },
  props:{
    showCarLine:Boolean,
    vin:[Number,String],
    vehicleNum:[Number,String],
  },
  data() {
    return {
      time:[],
      map:null,
      BMap:null,
      startIcon:require('@/assets/images/map/map-start.png'),
      endIcon:require('@/assets/images/map/map-end.png'),
      carIcon:require('@/assets/images/map/car1.png'),
      startPosition:{ lng: '', lat: '' },
      endPosition:{ lng:'', lat: '' },
      lineData:[],
      isEnd:false,
      play:false,
      carObj:null,
      step:-1,
      pois:[],
      timer:null,
      _minTime:'',
      _maxTime:'',
      pickerMinDate:'',//获取开始选择时间
      pickerMaxDate:'',//获取结束选择时间
      pickerOptions: { //时间范围选择控制
        onPick: ({ maxDate, minDate }) => {
          if(minDate){
            this.pickerMinDate = minDate.getTime()
          }
          if (maxDate) {
            this.pickerMinDate = ''
            this.pickerMaxDate =  maxDate.getTime()
          }
        },
        disabledDate: (time) => {
          const day30 = (30 - 1) * 24 * 3600 * 1000
          if (this.pickerMinDate !== '') {
            let maxTime = this.pickerMinDate + day30
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() > maxTime || time.getTime() > Date.now()
          }
          if (this.pickerMaxDate !== '' && !this.pickerMinDate) {
            let minTime = this.pickerMaxDate - day30
            return time.getTime() < minTime || time.getTime() > Date.now()
          }
          return time.getTime() > Date.now()
        }
      },
      loading:false,
      tableData:[],
      tabHighLightIndex:-1
    }
  },
  methods: {
    //查询轨迹
    handleQuery(){
      let query={};
      this.lineData=[];
      this.startPosition={ lng: '', lat: '' };
      this.endPosition={ lng: '', lat: '' };
      if(this.time.length){
        query={
          startTime:this.time[0],
          endTime:this.time[1],
          vin:this.vin
        }
      }else{
        query={
          startTime:'',
          endTime:'',
          vin:this.vin
        }
      }
      getCarLine(query).then((response)=>{
        this.tableData=response.rows;
        let lineArr=response.rows;
        this.lineData=[];
        if(lineArr.length){
          lineArr.forEach((item)=>{
            let obj={};
            obj.lng=Number(item.positionX);
            obj.lat=Number(item.positionY);
            this.lineData.push(obj);
          });
          this.startPosition={lng: this.lineData[0].lng, lat: this.lineData[0].lat}
          this.endPosition={lng: this.lineData[this.lineData.length-1].lng, lat: this.lineData[this.lineData.length-1].lat}
          this.$nextTick(()=>{
            this.map.setViewport(this.lineData);
          })
        }else{
          this.msgInfo('暂无轨迹！');
        }

      })
    },
    handleClose(){
      this.$emit('update:vin','');
      this.$emit('update:showCarLine',false);
    },
    //获取当前定位
    location(BMap,map){
      var point = new BMap.Point(116.331398,39.897445);
      map.centerAndZoom(point,12);
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //     // var mk = new BMap.Marker(r.point);
      //     // map.addOverlay(mk);
      //     map.panTo(r.point);
      //   }
      //   else {
      //     alert('failed'+this.getStatus());
      //   }
      // });
    },
    //地图加载完成
    handler({ BMap, map }){
      this.map=map;
      this.BMap=BMap;
      this.location(this.BMap,this.map);
      // map.setViewport(this.lineData);
      // this.lushuLine();
      this.handleQuery();
    },
    //车辆行驶
    run(map){
      this.isEnd=true;
      this.pois=[];
      if(this.lineData.length){
        this.lineData.forEach((item)=>{
          var point=new BMap.Point(item.lng,item.lat);
          this.pois.push(point)
        })
      }else{
        return false;
      }
      var myIcon = new BMap.Icon(this.carIcon, new BMap.Size(52,26), {
        anchor : new BMap.Size(27, 13),
        imageSize:new BMap.Size(52,26)
      });
      map.setViewport(this.lineData);// 根据提供的地理区域或坐标设置地图视野
      var paths = this.pois.length;    //获得有几个点
      if(!this.carObj){
        this.carObj = new BMap.Marker(this.pois[0],{icon:myIcon});
        map.addOverlay(this.carObj);
      }
      //获取表格的相关参数
      let tableDiv=document.querySelector('#line-detail-grid');
      let parent=tableDiv.querySelector('.el-table__body-wrapper');
      let trs=parent.querySelectorAll('.el-table__row');
      let trLen=parent.querySelectorAll('.el-table__row').length;
      let trHeight=tableDiv.querySelectorAll('.el-table__row')[0].offsetHeight;
      let tableHeight = parseInt(parent.style.height);
      let contentHeight = tableDiv.querySelectorAll(".el-table__body")[0].offsetHeight;
      let scrollHeight=contentHeight - tableHeight;

      this.stepMax=paths;
      this.clearTimer();
      this.timer=setInterval(()=>{
        //更改车辆位置
        this.resetMkPoint(map,this.carObj,this.step,this.pois);

        //表格添加高亮以及滚动
        this.tabHighLightIndex++;
        if(this.tabHighLightIndex>3){
          parent.scrollTop+=trHeight;
          if(parent.scrollTop===scrollHeight){
            parent.scrollTop=scrollHeight;
          }
        }
        if(this.tabHighLightIndex>trLen-1){
          // this.tabHighLightIndex=-1;
          clearInterval(this.tableTimer);
          return false;
        }
        this.selectRow(this.tableData[this.tabHighLightIndex]);
      },500)

    },
    resetMkPoint(map,carMk,index,pois){
      index++;
      map.setViewport(this.lineData);// 根据提供的地理区域或坐标设置地图视野
      carMk.setPosition(pois[index]);
      if(index < pois.length-1){
        carMk.setRotation(pois[index+1]);//trackUnit.route
      }
      //getAngle(point,prePoint);// js求解两点之间的角度
      if(index>0&&index < pois.length-1){
        carMk.setRotation(getAngle(pois[index],pois[index-1])-90);// 旋转的角度
      }
      this.step=index;
      if(index < pois.length&&this.isEnd){
        if(index == pois.length-1){
          this.isEnd=false;
          this.step=0;
          this.play = false;
          map.removeOverlay(this.carObj);
          this.carObj=null;
          this.clearTimer();
        }else{
          // this.resetMkPoint(map,carMk,index,pois);
        }
      }
    },
    playLine(){
      if(this.lineData.length){
        this.play = true;
        this.run(this.map)
        // this.tableLoop();
      }else{
        this.msgInfo("暂无轨迹数据！");
      }
    },
    //暂停
    stop(){
      this.play = false;
      this.isEnd=false;
      this.clearTimer()
    },
    clearTimer(){
      if(this.timer){
        clearInterval(this.timer);
        this.timer=null;
      }
    },
    selectRow(row) { // 给操作行 高亮
      if (row) {
        console.log(row)
        this.$refs.table.setCurrentRow(row, true);  // 高亮某一行
      } else {
        this.$refs.table.setCurrentRow();  // 取消高亮
      }
    },
  },
  mounted() {

  },
  beforeDestroy() {
    this.clearTimer();
  }
}
</script>

<style lang="scss" scoped>
  .play-icon{
    font-size: 30px;
    cursor: pointer;
    color:#1989fa;
  }
  .line-map{
    width:100%;
    height: 400px;
    .bm-view{
      width:100%;
      height:100%;
    }
  }
  .table-box{
    width:100%;
    height: 200px;
    ::v-deep.el-table .el-table__header-wrapper th,
    ::v-deep.el-table .el-table__fixed-header-wrapper th{
      height:30px;
    }
    ::v-deep.el-table__body tr.el-table__row.current-row td{
      background-color: #328bce;
      color:#fff;
    }
  }
  ::v-deep.el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
</style>
