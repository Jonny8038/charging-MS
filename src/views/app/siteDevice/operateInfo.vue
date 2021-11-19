<template>
  <el-dialog title="操作用户信息"
             :visible="showOperateInfoDialog"
             :before-close="handleClose"
             width="800px"
             :close-on-click-modal="false"
             append-to-body>
    <div class="table-dialog-box">
      <el-table  v-loading="loading"
                 size="mini"
                 height="100%"
                 :data="tableData">
        <el-table-column label="用户姓名" align="center" prop="userName" />
        <el-table-column label="用户电话" align="center" prop="userPhone" />
        <el-table-column label="操作时间" align="center" prop="operateTime" />
        <el-table-column label="操作命令" align="center" prop="operateOrder" />
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
export default {
  name: 'operateInfo',
  props:{
    showOperateInfoDialog:Boolean
  },
  data() {
    return {
      loading:false,
      tableData:[
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        },
        {
          userName:'测试人员',
          userPhone:'13545299578',
          operateOrder:'查询',
          operateTime:'2021-10-09 17:25:20',
        }
      ]
    }
  },
  methods: {
    handleClose(){
      this.$emit('update:showOperateInfoDialog',false)
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .table-dialog-box{
    width:100%;
    height: 400px;
  }
</style>
