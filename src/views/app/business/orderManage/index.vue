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
      <el-form-item label="预约状态" prop="status">
        <el-select    v-model="queryParams.status"
                      placeholder="请选择预约状态"
                      clearable
                      @keyup.enter.native="handleQuery">
          <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in statusData"></el-option>
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
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
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

    <el-table border size='mini'  stripe v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站场名称" align="center" prop="siteName" />
      <el-table-column label="用户姓名" align="center" prop="driverName"></el-table-column>
      <el-table-column label="用户电话" align="center" prop="driverPhone"></el-table-column>
      <el-table-column label="车辆VIN" align="center" prop="vin"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="carNo"></el-table-column>
      <el-table-column label="排队人数" align="center" prop="queuingNum"></el-table-column>
      <el-table-column label="预约状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{filterOrderStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="订单编号" align="center" prop="orderNo"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDelete(scope.row)">删除</el-button>
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
import { listReserve,delReserve } from "@/api/business/reserve";
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
        orderNo:''
      },
      //预约状态字段数据
      statusData:[
        {
          label:'进行中',
          value:0,
        },
        {
          label:'已完成',
          value:1,
        },
        {
          label:'已取消',
          value:-2,
        },
        {
          label:'已超时',
          value:-3,
        },
        {
          label:'检测异常',
          value:-1,
        }
      ],
      //预约列表
      orderList:[]
    }
  },
  created(){
    this.getList();
  },
  methods:{
    //查询列表
    getList() {
      this.loading = true;
      listReserve(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    //预约状态字段过滤
    filterOrderStatus(val){
      let obj={
        '-3':'已超时',
        '-2':'已取消',
        '-1':'检测异常',
        0:'进行中',
        1:'已完成'
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
      this.$confirm('是否确认下线电池编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delReserve(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('app/reserve/export', {
        ...this.queryParams
      }, `reserve.xlsx`)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
  }
}
</script>

<style scoped>

</style>
