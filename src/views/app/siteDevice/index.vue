<template>
  <div class="app-container">
    <div class="site-box">
      <el-select v-model="queryParams.siteId" placeholder="请选择站点" size="mini">
        <el-option
          v-for="item in siteOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="site-id-box" v-if="queryParams.siteId">换电站ID:{{queryParams.siteId}}</div>
    </div>
    <el-form
      style="padding-top: 10px;"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      size="mini"
      v-show="showSearch"
      label-width="82px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd">新增</el-button-->
<!--        >-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:site:remove']"-->
<!--        >删除</el-button-->
<!--        >-->
<!--      </el-col>-->
<!--      <right-toolbar-->
<!--        :showSearch.sync="showSearch"-->
<!--        @queryTable="getList"-->
<!--      ></right-toolbar>-->
<!--    </el-row>-->

    <el-table
      v-loading="loading"
      :data="deviceList"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备ID" align="center" prop="deviceId" show-overflow-tooltip/>
      <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip/>
      <el-table-column label="在线状态" align="center" prop="onlineStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.onlineStatus==2?'在线':'离线'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作状态" align="center" prop="workStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.workStatus==2?'运行中':'停止'}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作次数" align="center" prop="operCount" show-overflow-tooltip/>-->
      <el-table-column label="异常次数" align="center" prop="errorCount" show-overflow-tooltip>
        <template><span>0</span></template>
      </el-table-column>
      <el-table-column label="参数" align="center" prop="temperature" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.temperature+'℃'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上报时间" align="center" prop="uploadTime" show-overflow-tooltip />
      <el-table-column label="历史操作用户" align="center" prop="historyOperator">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewOperateInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行命令" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="operateCommond(scope.row)">操作</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        align="center"-->
<!--        class-name="">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['system:site:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['system:site:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>
    <!--新增设备-->
    <addDeviceDialog :showAddDeviceDialog.sync="showAddDeviceDialog" />

    <!--执行命令-->
    <commondOrderDialog v-if="showCommondOrderDialog" :showCommondOrderDialog.sync="showCommondOrderDialog" :rowInfo.sync="rowInfo" @reload="getList" />

    <!--历史操作用户-->
    <operateInfo :showOperateInfoDialog.sync="showOperateInfoDialog"/>
  </div>
</template>

<script>
import { listSiteDevice, } from "@/api/app/siteDevice";
import { listSite } from "@/api/app/site";
import addDeviceDialog from '@/views/app/siteDevice/addDeviceDialog'
import commondOrderDialog from '@/views/app/siteDevice/commondOrderDialog'
import operateInfo from '@/views/app/siteDevice/operateInfo'
import {fortTime} from '@/utils/date'
export default {
  name: 'index.vue',
  components:{
    addDeviceDialog,
    commondOrderDialog,
    operateInfo
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //表格数据
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId:'',
        deviceName: '',
        deviceId: '',
      },
      siteOptions:[],
      showAddDeviceDialog:false,
      showCommondOrderDialog:false,
      showOperateInfoDialog:false,
      rowInfo:null,
      updateTime:''
    }
  },
  methods: {
    /** 查询站点列表 */
    getSiteList() {
      listSite({}).then((response) => {
        let siteData = response.rows;
        this.siteOptions=siteData
        if(this.siteOptions.length){
          this.queryParams.siteId=this.siteOptions[0].id
          this.getList();
        }
      });
    },
    /** 查询站内设备列表 */
    getList() {
      this.loading = true;
      listSiteDevice(this.queryParams).then((response) => {
        this.updateTime=fortTime(new Date(),'yyyy-MM-dd HH:mm:ss')
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
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
    //新增
    handleAdd(){
      this.showAddDeviceDialog=true;
    },
    //删除
    handleDelete(row){
      const ids = row.id || this.ids;
      // this.$confirm('是否确认删除站点编号为"' + ids + '"的数据项?', "警告", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(function () {
      //
      // }).then(() => {
      //   this.getList();
      //   this.msgSuccess("删除成功");
      // }).catch(() => {});
    },
    //修改
    handleUpdate(row){

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //执行操作
    operateCommond(row){
      this.rowInfo=row;
      this.rowInfo.updateTime=this.updateTime
      this.showCommondOrderDialog=true;
    },
    //查看历史操作用户
    viewOperateInfo(row){
      this.showOperateInfoDialog=true;
    }
  },
  mounted() {
    this.getSiteList();
  }
}
</script>

<style scoped>
  .site-box{
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid #ccc;
  }
</style>
<style>
.commond-dialog .el-dialog__body{
  padding:15px!important;
}
</style>
