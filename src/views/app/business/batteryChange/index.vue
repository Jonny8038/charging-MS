<template>
  <div class="app-container">
    <el-form size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="站场名称" prop="siteName">
        <el-input
          v-model="queryParams.siteName"
          placeholder="请输入站场名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="换电状态" prop="status">
        <el-select    v-model="queryParams.status"
                      placeholder="请选择换电状态"
                      clearable
                      @keyup.enter.native="handleQuery">
          <el-option v-for="(item,index) in statusData" :label="item.label" :value="item.value" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入用户电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入订单编号"
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
      <el-table-column label="站场名称" align="center" prop="siteName" />
      <el-table-column label="用户姓名" align="center" prop="driverName"/>
      <el-table-column label="用户电话" align="center" prop="driverPhone"/>
      <el-table-column label="电池编号" align="center" prop="batteryNo"/>
      <el-table-column label="行驶里程" align="center" prop="mileage">
        <template slot-scope="scope">
          <span>{{scope.row.mileage}}&nbsp;km</span>
        </template>
      </el-table-column>
      <el-table-column label="上次换电时间" align="center" prop="previousTime"/>
      <el-table-column label="车牌号码" align="center" prop="carNo"/>
      <el-table-column label="换电状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{statusFilter(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="换电完成时间" align="center" prop="finishedTime"/>
      <el-table-column label="换电次数" align="center" prop="serialNo">
        <template slot-scope="scope">
          <span>{{scope.row.serialNo}}&nbsp;次</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" prop="no"/>
      <el-table-column
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:site:remove']"
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
  </div>
</template>

<script>
import { listBatteryChange,delBatteryChange } from "@/api/business/batteryChange";
export default {
  name: 'index',
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
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName:'',
        status:'',
        driverName:'',
        driverPhone:'',
        no:''
      },
      //预约列表
      changeList:[],
      //换电状态字段数据
      statusData:[
        {
          value:-3,
          label:'订单超时'
        },
        {
          value:-2,
          label:'订单取消'
        },
        {
          value:-1,
          label:'换电失败'
        },
        {
          value:0,
          label:'进行中'
        },
        {
          value:1,
          label:'换电中'
        },
        {
          value:2,
          label:'换电完成'
        }
      ]
    }
  },
  methods:{
    //列表查询
    getList() {
      this.loading = true;
      listBatteryChange(this.queryParams).then(response => {
        this.changeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //列表换电状态过滤
    statusFilter(val){
      let obj={
        '-3':'订单超时',
        '-2':'订单取消',
        '-1':'换电失败',
        '0':'进行中',
        '1':'换电中',
        '2':'换电完成',
      }
      return obj[val];
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
      this.$confirm('是否确认删除该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delBatteryChange(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功！");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('app/order/export', {
        ...this.queryParams
      }, `battery_change.xlsx`)
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
  }
}
</script>

<style scoped>

</style>
