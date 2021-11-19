<template>
  <el-dialog :title="title" :visible="showPackage" :before-close="handleClose" width="600px" append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="套餐名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入套餐名称"/>
      </el-form-item>
      <el-form-item label="套餐金额" prop="name">
        <el-input
          v-model="form.price"
          placeholder="请输入套餐金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'packageDialog',
  props:{
    title:String,
    rowId:[String,Number],
    showPackage:Boolean
  },
  data() {
    return {
      form:{
        name:'',
        price:''
      },
      rules:{}
    }
  },
  methods: {
    //关闭
    handleClose(){
      this.reset();
      this.$emit('update:showPackage',false);
    },
    //确认
    submitForm(){
      this.handleClose();
    },
    //取消
    cancel(){
      this.handleClose();
    },
    //重置
    reset(){
      this.form = {
        name:'',
        price:''
      };
      this.resetForm("form");
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
