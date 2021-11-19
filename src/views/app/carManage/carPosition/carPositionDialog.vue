<template>
  <el-dialog :title="'实时位置 - '+vehicleNum" :visible="showCarPosition"  :before-close="handleClose" width="60%" append-to-body>
    <div class="map-box">
      <baidu-map
        class="bm-view"
        :zoom="12"
        :center="center"
        :scroll-wheel-zoom="true"
        @ready="handler"
        :mapClick="false">
        <bm-marker :icon="{url:carIcon,size: {width: 52, height: 26}}" :position="position" v-if="position"></bm-marker>
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
import { getCarPosition }  from '@/api/app/car'
export default {
  name: 'carPositionDialog',
  props:{
    showCarPosition:Boolean,
    vin:[Number,String],
    vehicleNum:[Number,String],
  },
  data() {
    return {
      carIcon:require('@/assets/images/map/car1.png'),
      position:null,
      center:{ lng: 116.404, lat: 39.915},
      timer:null,
      query:{
        vin:this.vin
      },
      loading:false,
      tableData:[]
    }
  },
  methods: {
    //查询实时位置
    handleQuery(){
      this.getPosition();
      this.timer=setInterval(()=>{
        this.getPosition(this.query)
      },1000*20)
    },
    getPosition(query){
      getCarPosition(this.query).then((response)=>{
        if(response.data){
          this.tableData.push(response.data);
          let position={lng: '', lat: ''}
          position.lng=response.data.positionX;
          position.lat=response.data.positionY;
          this.position=position;
          this.center=position;
          this.$nextTick(()=>{
            this.tableLoop();
          })
        }else{
          this.msgInfo('暂无实时位置信息！');
        }
      }).catch((err)=>{
        this.msgError('暂无实时位置信息！');
      })
    },
    selectRow(row) { // 给操作行 高亮
      if (row) {
        console.log(row)
        this.$refs.table.setCurrentRow(row, true);  // 高亮某一行
      } else {
        this.$refs.table.setCurrentRow();  // 取消高亮
      }
    },
    tableLoop(){
      let tableDiv=document.querySelector('#line-detail-grid');
      let parent=tableDiv.querySelector('.el-table__body-wrapper');
      let trs=parent.querySelectorAll('.el-table__row');
      let trLen=parent.querySelectorAll('.el-table__row').length;
      let trHeight=tableDiv.querySelectorAll('.el-table__row')[0].offsetHeight;
      let tableHeight = parseInt(parent.style.height);
      let contentHeight = tableDiv.querySelectorAll(".el-table__body")[0].offsetHeight;
      let scrollHeight=contentHeight - tableHeight;
      parent.scrollTop=scrollHeight
      this.selectRow(this.tableData.at(-1));
    },
    //关闭弹框
    handleClose(){
      this.$emit('update:showCarPosition',false);
    },
    handler({ BMap, map }){
      this.handleQuery();
    },
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer=null;
  }
}
</script>

<style lang="scss" scoped>
  .map-box{
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
</style>
