<template>
  <el-dialog title="实时位置" :visible="showCarPosition"  :before-close="handleClose" width="60%" append-to-body>
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
  </el-dialog>
</template>

<script>
import { getCarPosition }  from '@/api/app/car'
export default {
  name: 'carPositionDialog',
  props:{
    showCarPosition:Boolean,
    vin:[Number,String]
  },
  data() {
    return {
      carIcon:require('@/assets/images/map/car1.png'),
      position:null,
      center:{ lng: 116.404, lat: 39.915},
      timer:null,
      query:{
        vin:this.vin
      }
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
          let position={lng: '', lat: ''}
          position.lng=response.data.positionX;
          position.lat=response.data.positionY;
          this.position=position;
          this.center=position;
        }else{
          this.msgError('暂无实时位置信息！');
        }
      }).catch((err)=>{
        this.msgError('暂无实时位置信息！');
      })
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
</style>
