<template>
  <el-dialog :title="title+'消息'"
             :visible="showNewsInfo"
             :before-close="handleClose"
             :close-on-click-modal="false"
             width="800px"
             append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="消息类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择消息类型" clearable :disabled="isEdit">
          <el-option label="系统公告" :value="1"></el-option>
          <el-option label="系统消息" :value="2"></el-option>
          <el-option label="系统轮播图" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title" v-if="form.type==2">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="描述" prop="description" v-if="form.type==2">
        <el-input v-model="form.description" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="内容" prop="content" v-if="form.type==1">
        <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"  placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="内容" prop="content" v-if="form.type==2">
        <editor v-model="form.content" :min-height="192"/>
      </el-form-item>
      <el-form-item label="图片" v-if="form.type==3">
        <el-upload
          class="upload-demo"
          :action="uploadImgUrl"
          :show-file-list="false"
          :headers="headers"
          name="file"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload"
          :on-error="handleUploadError">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸750*300</div>
        </el-upload>
        <el-image
          v-show="form.banner"
          style="width: 100px; height: 100px"
          :src="form.banner"
          :preview-src-list="srcList">
        </el-image>
      </el-form-item>
      <el-form-item label="查看类型" prop="contentType" v-if="form.type==1||form.type==2">
        <el-select v-model="form.contentType" placeholder="请选择查看类型" clearable :disabled="isEdit">
          <el-option label="文本形式" :value="1"></el-option>
          <el-option label="链接跳转" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接" prop="url" v-if="form.contentType==2||form.type==3">
        <el-input v-model="form.url" placeholder="请输入链接" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click.native.prevent="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addNews ,getNewsDetail} from '@/api/business/newsSend'
import { getToken } from "@/utils/auth";
import Editor from '@/components/Editor';
export default {
  name: 'newsDialog',
  components: {
    Editor
  },
  props:{
    showNewsInfo:Boolean,
    isEdit:Boolean,
    title:String,
    rowId:[String,Number],
  },
  data() {
    return {
      form:{
        type:'',
        title:'',
        description:'',
        content:'',
        url:'',
        contentType:'',
        banner:''
      },
      rules:{},
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      loading:null,
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
    getNewsInfo(id){
      getNewsDetail(id).then((response) => {
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
          if(this.form.type==3&&this.form.banner==''){
            this.msgError("上传图片不能为空！");
            return false;
          }
          if (!this.isEdit) {
            addNews(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit('reload');
              this.handleClose();
            });
          } else {
            addNews(this.form).then((response) => {
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
        type:'',
        title:'',
        description:'',
        content:'',
        url:'',
        contentType:'',
        banner:''
      }
      this.srcList=[]
      // this.resetForm("form");
    },
    //关闭弹框
    handleClose(){
      this.reset();
      this.$emit('update:showNewsInfo',false);
      this.$emit('update:isEdit',false);
    },
    handleUploadSuccess(res) {
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
    handleBeforeUpload(file) {
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
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
