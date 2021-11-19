<template>
  <el-dialog :title="title+'视频'"
             :visible="showVideoInfo"
             :before-close="handleClose"
             width="800px"
             :close-on-click-modal="false"
             append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          class="upload-demo"
          :action="uploadImgUrl"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleImgUploadSuccess"
          :before-upload="handleImgBeforeUpload"
          :on-error="handleUploadError">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#f00">建议上传jpg/png文件</div>
        </el-upload>
        <el-image
          v-show="form.banner"
          style="width: 200px; height: 100px;margin-top:10px"
          :src="form.banner"
          :preview-src-list="srcList">
        </el-image>
      </el-form-item>
      <el-form-item label="视频">
        <el-upload
          class="upload-demo"
          :action="uploadImgUrl"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload"
          :on-error="handleUploadError">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#f00">建议上传mp4文件,视频文件大小不大于50M</div>
        </el-upload>
        <video v-show="form.videoUrl" :src="form.videoUrl" autoplay controls muted style="width:200px;height: 100px;object-fit: fill;margin-top:10px"></video>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click.native.prevent="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addVideo ,getVideoDetail} from '@/api/business/videoTutorial'
import { getToken } from "@/utils/auth";
export default {
  name: 'newsDialog',
  props:{
    showVideoInfo:Boolean,
    isEdit:Boolean,
    title:String,
    rowId:[String,Number],
  },
  data() {
    return {
      form:{
        title:'',
        description:'',
        banner:'',
        videoUrl:''
      },
      rules:{},
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      loading:null,
      imgsrc:'',
      srcList:[]
    }
  },
  watch:{
    isEdit(val){
      if(val){
        this.getNewsInfo(this.rowId);
      }
    }
  },
  methods: {
    //获取消息详情
    getNewsInfo(videoId){
      let id={
        id:videoId
      }
      getVideoDetail(id).then((response) => {
        console.log(response)
        this.form=response.data;
        this.srcList=[]
        this.srcList.push(this.form.banner);
      });
    },
    //确认
    submitForm(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form)
          // if(this.form.type==3&&this.form.banner==''){
          //   this.msgError("上传图片不能为空！");
          //   return false;
          // }
          if (!this.isEdit) {
            addVideo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit('reload');
              this.handleClose();
            });
          } else {
            addVideo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit('reload');
              this.handleClose();
            });
          }
        }
      });
      //
    },
    //取消
    cancel(){
      this.handleClose();
    },
    //重置表单
    reset() {
      this.form={
        title:'',
        description:'',
        banner:'',
        videoUrl:''
      }
      // this.resetForm("form");
    },
    //关闭弹框
    handleClose(){
      this.reset();
      this.$emit('update:showVideoInfo',false);
      this.$emit('update:isEdit',false);
    },
    handleUploadSuccess(res,file) {
      console.log(res)
      this.form.videoUrl=res.data.url;
      this.$message({
        type: "success",
        message: "上传成功！",
      });
      this.loading.close();
    },
    handleBeforeUpload(file) {
      if ([
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      const isLT50M= file.size / 1024 / 1024 < 50
      if(!isLT50M) {
        this.$message({
          message:'视频大小不能超过50M，请重新选择!',
          type: 'warning'
        });
        return false;
      }
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
    handleImgUploadSuccess(res){
      console.log(res)
      this.srcList=[]
      this.form.banner=res.data.url;
      this.srcList.push(res.data.url)
      this.$message({
        type: "success",
        message: "上传成功！",
      });
      this.loading.close();
    },
    handleImgBeforeUpload(file){
      const typeArr = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg']
      const isJPG = typeArr.indexOf(file.type) !== -1
      if (!isJPG) {
        this.$message.error('只能是图片!')
        this.$refs.upload.clearFiles();
        return false;
      }
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
