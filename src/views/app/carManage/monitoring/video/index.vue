<template>
  <el-dialog :title="title"
             center
             :visible="open"
             :before-close="handleClose"
             append-to-body
             width="80%">
    <div class="el-dialog-div">
      <div class="page-video">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item,index) in videoData" :key="index">
            <div class="grid-content bg-purple">
              <video autoplay
                     controls
                     muted
                     width="100%"
                     height="240"
                     ref="videoPlayer"
                     :id="'videoElement'+index+1"
                     style="object-fit: fill;"
              ></video>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--    <div slot="footer"-->
    <!--         class="dialog-footer">-->
    <!--      <el-button type="primary"-->
    <!--                 @click="submitForm">确 定</el-button>-->
    <!--      <el-button @click="cancel">取 消</el-button>-->
    <!--    </div>-->
  </el-dialog>

</template>
<script>
import flvjs from 'flv.js'

export default {
  props: {
    open: Boolean,
    title: String,
    carId: [Number, String]
  },
  watch: {
    open(val) {
      if(val&&this.carId){
        this.$nextTick(()=>{
          this.createVideo();
        })
      }else{
        this.clearAllVideo();
      }
    }
  },
  data() {
    return {
      videoData:[
        {
          id:1,
          url:'http://121.37.12.126:8080/monitor-control/media/test.flv'
        },
        {
          id:2,
          url:'http://121.37.12.126:8080/monitor-control/media/test.flv'
        },
        {
          id:3,
          url:'http://121.37.12.126:8080/monitor-control/media/test.flv'
        },
        {
          id:4,
          url:'http://121.37.12.126:8080/monitor-control/media/test.flv'
        },
      ],
      flvPlayerObjData:[]
    }
  },
  methods: {
    //flv视频播放
    createVideo() {
      this.flvPlayerObjData=[];
      if(this.videoData.length){
        if (flvjs.isSupported()) {
          this.videoData.forEach((item,index)=>{
            var videoElement = document.getElementById('videoElement'+index+1);
            var flvPlayer = flvjs.createPlayer( {
                type: "flv",
                isLive: true,
                hasAudio: false,
                url: item.url
              },
              {
                enableWorker: false, //不启用分离线程
                enableStashBuffer: false, //关闭IO隐藏缓冲区
                reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
                autoCleanupSourceBuffer: true //自动清除缓存
              });
            flvPlayer.attachMediaElement(videoElement);
            this.flvPlayerObjData.push(flvPlayer);
            if (item.url !== "" && item.url !== null) {
              flvPlayer.load();
              flvPlayer.play();
            }
          })
        }
      }
    },
    handleClose() {
      this.$emit('update:open', false);
    },
    //关闭所有视频
    clearAllVideo(){
      if(this.flvPlayerObjData.length){
        this.flvPlayerObjData.forEach((item,index)=>{
          this.destroyVideo(item);
        })
      }
      this.flvPlayerObjData=[];
    },
    //清除所有已经生成的视频对像
    destroyVideo(flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
      flvPlayer = null;
    },
  },
  beforeDestroy() {

  }
}
</script>
<style lang="scss" scoped>
</style>

