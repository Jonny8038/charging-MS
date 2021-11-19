<template>
  <el-dialog :title="title+'用户详情'" :visible="showUserInfo"  :before-close="handleClose" width="800px"   :close-on-click-modal="false" append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="24"><div class="info-title">用户信息</div></el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="form.userName"  :readonly="!isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户电话" prop="phonenumber">
            <el-input v-model="form.phonenumber"  :readonly="!isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="cano">
            <el-input v-model="form.cano"  :readonly="!isEdit" />
          </el-form-item>
        </el-col>
        </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="证件照片" prop="userPics">
            <el-image
              style="width: 100px; height: 50px"
              v-for="(item,index) in idCardPic"
              :key="index"
              :src="item"
              :preview-src-list="idCardPic">
            </el-image>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="info-title">车辆信息</div></el-col>
        <el-col :span="12">
          <el-form-item label="车牌号码" prop="cno">
            <el-input v-model="form.cno"  :readonly="!isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌型号" prop="xhid">
<!--            <el-input v-model="form.xhname" placeholder="请输入品牌型号" />-->
            <el-select v-model="form.xhid"   :disabled="!isEdit" style="width: 100%;">
              <el-option
                v-for="item in carTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号" prop="fdjno">
            <el-input v-model="form.fdjno"  :readonly="!isEdit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="证件照片" prop="carPics">
            <el-image
              style="width: 100px; height: 50px"
              v-for="(item,index) in carPic"
              :key="index"
              :src="item"
              :preview-src-list="carPic">
            </el-image>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核不通过原因"
                        prop="remark">
            <el-input type='textarea'
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="remarkContent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer" v-if="!isView">
      <el-button type="primary"
                 @click="pass">审核通过</el-button>
      <el-button @click="faild">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getHexUser } from "@/api/business/user";
import { checkPort} from '@/api/app/car'
export default {
  name: 'userInfoDialog',
  props:{
    showUserInfo:Boolean,
    isEdit:Boolean,
    isView:Boolean,
    title:String,
    carTypeList:Array,
    rowId:[String,Number],
    carId:[String,Number],
  },
  data() {
    return {
      form:{
        userName:'',
        phonenumber:'',
        cano:'',
        cno:'',
        xhid:'',
        fdjno:'',
        caimg:'',
        cfimg:'',
        climg:'',
      },
      rules:{},
      idCardPic:[],
      carPic:[],
      remarkContent:''
    }
  },
  watch:{
    rowId(val){
      if(val){
        this.getUserInfo(val);
      }
    }
  },
  methods: {
    //获取用户信息
    getUserInfo(id){
      this.carPic=[];
      this.idCardPic=[];
      getHexUser(id).then((response) => {
        console.log(response)
        this.form=response.data;
        this.carPic.push(this.form.climg);
        this.idCardPic.push(this.form.caimg);
        this.idCardPic.push(this.form.cfimg);
      });
    },
    //审核成功接口
    pass() {
      let query = {
        apprContent: this.remarkContent,
        carId: this.carId,
        status: 1,
      }
      checkPort(query).then((response) => {
        this.msgSuccess("操作成功！");
        this.$emit('reload');
        this.handleClose();
      })
    },
    //审核失败接口
    faild() {
      this.loading = true
      let query = {
        apprContent: this.remarkContent,
        carId: this.carId,
        status: 2,
      }
      checkPort(query).then((response) => {
        this.msgSuccess("操作成功！");
        this.$emit('reload');
        this.handleClose();
      })
    },
    cancel(){
      this.handleClose();
    },
    reset() {
      this.form={
        userName:'',
        phonenumber:'',
        cano:'',
        cno:'',
        xhname:'',
        fdjno:'',
        caimg:'',
        cfimg:'',
        climg:'',
      }
      this.remarkContent='';
      // this.resetForm("form");
    },
    handleClose(){
      this.$emit('update:rowId','');
      this.$emit('update:showUserInfo',false);
      this.reset();
    },
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .info-title{
    //width:90px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    padding:0 12px 10px 0;
  }
  ::v-deep.el-image{
    margin-right: 5px;
  }
</style>
