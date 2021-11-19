<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading"
              :data="packageList">
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="套餐名称" align="center" prop="name" />
      <el-table-column label="套餐金额" align="center" prop="price" />
      <el-table-column
        label="操作"
        align="center"
        class-name="">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增套餐对话框 -->
    <packageDialog :showPackage.sync="showPackage" :title="title" :rowId="rowId"/>
  </div>
</template>

<script>
import packageDialog from '@/views/app/financialManage/package/packageDialog'
export default {
  name: 'index',
  components:{
    packageDialog
  },
  data() {
    return {
      loading:false,
      packageList:[
        {
          name:'套餐一',
          price:200
        },
        {
          name:'套餐二',
          price:200
        }
      ],
      showPackage:false,
      title:'',
      rowId:''
    }
  },
  methods: {
    handleAdd(){
      this.showPackage=!this.showPackage;
      this.title='新增套餐';
      this.rowId='';
    },
    handleUpdate(row){
      this.showPackage=!this.showPackage;
      this.title='修改套餐';
      // this.rowId='';
    },
    handleDelete(row){
      this.$confirm('是否确认删除该套餐？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{

      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
