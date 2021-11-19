<template>
  <div class="app-container">
    <el-form size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入用户电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号码" prop="cno">
        <el-input
          v-model="queryParams.cno"
          placeholder="请输入车牌号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:orderManage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:orderManage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border size='mini'  stripe v-loading="loading" :data="changeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户姓名" align="center" prop="userName"/>
      <el-table-column label="用户电话" align="center" prop="phonenumber"/>
      <el-table-column label="车牌号码" align="center" prop="cno"/>
      <el-table-column label="品牌型号" align="center" prop="xhname"/>
      <el-table-column label="发动机号" align="center" prop="fdjno"/>
      <el-table-column label="车辆照片" align="center" prop="climg">
        <template slot-scope="scope">
          <el-image :src="scope.row.climg" style="width: 50px;height: 25px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="cano"/>
      <el-table-column label="注册时间" align="center" prop="createTime"/>
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
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>

    <!--用户信息查看、编辑弹框-->
    <userInfoDialog :showUserInfo.sync="showUserInfo" :title="title" :rowId.sync="rowId" :isEdit="isEdit" :carTypeList="carTypeList" @reload="getList"/>
  </div>
</template>

<script>
import userInfoDialog from "@/views/app/business/user/userInfoDialog"
import { listHexUser,delHexUser } from "@/api/business/user";
import {listCarType} from "@/api/app/battery";
export default {
  name: 'index',
  components:{
    userInfoDialog
  },
  data(){
    return{
      //遮罩层
      loading:false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 5,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName:'',
        phonenumber:'',
        cno:''
      },
      //预约列表
      changeList:[],
      showUserInfo:false,
      isEdit:false,
      title:'',
      rowId:'',
      carTypeList:[],
    }
  },
  methods:{
    //查询列表
    getList() {
      this.loading = true;
      listHexUser(this.queryParams).then(response => {
        this.changeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询电池适配车辆列表 */
    getCarTypeList() {
      listCarType().then(response => {
        this.carTypeList = response.rows;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认下线电池编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delHexUser(ids);
      }).then(() => {
        // this.getList();
        this.msgSuccess("成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('app/hexuser/export', {
        ...this.queryParams
      }, `user.xlsx`)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    //编辑
    handleUpdate(row){
      this.showUserInfo=!this.showUserInfo;
      this.title='编辑';
      this.rowId=row.userId;
      this.isEdit=true;
    },
    //查看
    handleView(row){
      this.showUserInfo=!this.showUserInfo;
      this.title='查看';
      this.rowId=row.userId;
      this.isEdit=false;
    }
  },
  created() {
    this.getList();
    this.getCarTypeList();
  }
}
</script>

<style  scoped>
::v-deep .el-image__error{
  font-size: 12px!important;
  background-color: transparent!important;
}
</style>
