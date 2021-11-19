<template>
  <el-dialog title="新增设备"
             :visible="showAddDeviceDialog"
             :before-close="handleClose"
             width="800px"
             :close-on-click-modal="false"
             append-to-body>
    <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="设备名称" prop="deviceName" >
        <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceID">
        <el-input v-model="form.description" placeholder="请输入设备ID" />
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
  name: 'addDeviceDialog',
  props:{
    showAddDeviceDialog:Boolean
  },
  data() {
    return {
      form:{
        deviceName:'',
        deviceID:''
      },
      rules:{},
    }
  },
  methods: {
    //关闭弹框
    handleClose(){
      this.$emit('update:showAddDeviceDialog',false)
    },
    //确定
    submitForm(){

    },
    //取消
    cancel(){
      this.handleClose();
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
