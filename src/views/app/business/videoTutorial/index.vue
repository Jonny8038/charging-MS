<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>

    <el-table border size='mini'  stripe v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="内容" align="center" prop="content" show-overflow-tooltip width="200"/>
      <el-table-column label="创建者" align="center" prop="createBy"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>

    <!--消息新增，编辑弹框-->
    <videoDialog :showVideoInfo.sync="showVideoInfo" :title="title" :isEdit.sync="isEdit" :rowId="rowId" @reload="getList"/>
  </div>
</template>

<script>
import {listVideo ,delVideoList} from '@/api/business/videoTutorial'
import videoDialog from "@/views/app/business/videoTutorial/videoDialog"
export default {
  name: 'newsSend',
  components:{
    videoDialog
  },
  data() {
    return {
      //遮罩层
      loading:false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title:'',
        content:''
      },
      tableList:[],
      showVideoInfo:false,
      isEdit:false,
      title:'',
      rowId:''
    }
  },
  methods: {
    //查询列表
    getList(){
      this.loading = true;
      listVideo(this.queryParams).then((response) => {
        this.tableList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    //新增
    handleAdd(){
      this.showVideoInfo=!this.showVideoInfo;
      this.title='新增';
      this.rowId='';
      this.isEdit=false;
    },
    //删除
    handleDelete(row){
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除该消息', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return  delVideoList(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //修改编辑
    handleUpdate(row){
      this.showVideoInfo=!this.showVideoInfo;
      this.title='编辑';
      this.rowId=row.id;
      this.isEdit=true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
  },
  created(){
    this.getList();
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
