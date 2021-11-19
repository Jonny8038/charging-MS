<template>
  <el-dialog :title="title"
             :visible="open"
             :before-close="handleClose"
             :close-on-click-modal="false"
             width="500px"
             append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="站场名字"  prop="sid">
        <!-- <el-input v-model="form.sname" placeholder="请输入站点名字" /> -->
        <el-select v-model="form.sid"  placeholder="请选择站场名字" style="width: 100%;" @change='getSname'>
          <el-option
            v-for="item in siteOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电池编号" prop="bno">
        <el-input v-model="form.bno" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="电池型号" prop="type">
        <el-select v-model="form.type" placeholder="请选择电池型号" style="width: 100%;">
          <el-option label="磷酸铁锂电池" value="01"></el-option>
          <el-option label="锰酸锂电池" value="02"></el-option>
          <el-option label="钴酸锂电池" value="03"></el-option>
          <el-option label="三元材料电池" value="04"></el-option>
          <el-option label="聚合物锂离子电池" value="05"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂家" prop="factoryName">
        <el-input v-model="form.factoryName" placeholder="请输入厂家" />
      </el-form-item>
      <el-form-item label="出厂时间" prop="factoryTime" >
        <el-date-picker clearable
                        size="small"
                        style="width: 100%;"
                        v-model="form.factoryTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择出厂时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="适配车型" prop="spcx">
        <el-select v-model="form.spcx" multiple  placeholder="请选择适配车型" style="width: 100%;">
          <el-option
            v-for="item in carTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {  addBattery,getBattery } from "@/api/app/battery";
export default {
  name: 'addBattery',
  props:{
    open:Boolean,
    title:String,
    rowId:[String,Number],
    siteOptions:Array,
    carTypeList:Array,
  },
  watch:{
    rowId(val){
      if(val){
        this.getBatteryDetail(val);
      }
    }
  },
  data(){
    return{
      // 表单参数
      form: {
        sid:'',
        bno:'',
        type:'',
        factoryName:'',
        factoryTime:'',
        spcx:[],
        remark:''
      },
      // 表单校验
      rules: {
        sid: [
          { required: true, message: '请选择站场名字', trigger: 'change' }
        ],
        bno: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择电池型号', trigger: 'change' }
        ],
        factoryName: [
          { required: true, message: '请输入厂家', trigger: 'blur' }
        ],
        factoryTime: [
          { required: true, message: '选择出厂时间', trigger: 'change' }
        ],
        spcx: [
          { required: true, message: '请选择适配车型', trigger: 'change' }
        ],
      },
    }
  },
  methods:{
    // 下拉选择站点名字
    getSname(val){
      this.siteOptions.forEach(item => {
        if(val==item.id){
          console.log('item',item);
          // this.form.name=item.name
          // this.form.cname=item.cname
          this.form.cid=item.cid
        }
      });
    },
    // 查询每一个的电池详情
    getBatteryDetail(id){
      getBattery(id).then(response => {
        this.form = response.data;
        this.form.spcx=response.data.spcx.split(',');
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.rowId) {
            let query={
              id:this.rowId,
              sid:this.form.sid,
              bno:this.form.bno,
              type:this.form.type,
              factoryName:this.form.factoryName,
              factoryTime:this.form.factoryTime,
              spcx:this.form.spcx.length?this.form.spcx.join(','):'',
              remark:this.form.remark
            }
            addBattery(query).then(response => {
              this.msgSuccess("修改成功");
              this.$emit('reload');
              this.handleClose();
            });
          } else {
            let query={
              sid:this.form.sid,
              bno:this.form.bno,
              type:this.form.type,
              factoryName:this.form.factoryName,
              factoryTime:this.form.factoryTime,
              spcx:this.form.spcx.length?this.form.spcx.join(','):'',
              remark:this.form.remark
            }
            addBattery(query).then(response => {
              this.msgSuccess("新增成功");
              this.$emit('reload');
              this.handleClose();
            });
          }
        }else{
          this.msgError("请完善相关信息！");
        }
      });
    },
    // 取消按钮
    cancel() {
      this.handleClose();
    },
    // 表单重置
    reset() {
      this.form = {
        sid:'',
        bno:'',
        type:'',
        factoryName:'',
        factoryTime:'',
        spcx:'',
        remark:''
      };
      this.resetForm("form");
      this.$emit('update:rowId','')
    },
    handleClose(){
      this.reset();
      this.$emit('update:open',false)
    }
  }
}
</script>

<style scoped>

</style>
