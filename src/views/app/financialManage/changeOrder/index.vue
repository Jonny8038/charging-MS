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
      <el-form-item label="换电状态" prop="orderStatus">
        <el-select    v-model="queryParams.orderStatus"
                      placeholder="请选择换电状态"
                      clearable
                      @keyup.enter.native="handleQuery">
          <el-option label="换电成功" value="1"></el-option>
          <el-option label="换电失败" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="phone">
        <el-input
          v-model="queryParams.manager"
          placeholder="请输入用户电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
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
      <el-col :span="24">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:orderManage:export']">导出</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          size="mini"-->
<!--          @click="getTotal"-->
<!--          v-hasPermi="['system:orderManage:remove']">汇总</el-button>-->
<!--        <div class="total-money">换电总金额：{{totalMoney}}元</div>-->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table border size='mini'  stripe v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站场名称" align="center" prop="siteName" />
      <el-table-column label="用户姓名" align="center" prop="userName"/>
      <el-table-column label="用户电话" align="center" prop="phone"/>
      <el-table-column label="车牌号码" align="center" prop="vehicleNum"/>
      <el-table-column label="换电状态" align="center" prop="changeStatus">
        <template slot-scope="scope">
          <span>{{scope.row.changeStatus==1?'换电成功':'换电失败'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费标准" align="center" prop="feeStyle">
        <template slot-scope="scope">
          <span>{{scope.row.feeStyle==1?'电量（1.25元/度）':'里程（0.25元/公里）'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="换电金额" align="center" prop="totalFee"/>
      <el-table-column label="付款方式" align="center" prop="payType">
        <template slot-scope="scope">
          <span>{{scope.row.payType==1?'微信支付':'支付宝支付'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime"/>
      <el-table-column label="订单编号" align="center" prop="orderNum"/>
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
      total: 5,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName:'',
        orderStatus:'',
        userName:'',
        phone:'',
        orderNum:''
      },
      //预约列表
      orderList:[
        {
          siteName:'新能源换电转',
          userName:'张明',
          phone:'1265458975',
          vehicleNum:'鄂F256452',
          changeStatus:1,
          feeStyle:1,
          totalFee:200,
          payType:1,
          createTime:'2021-06-25 12:25:25',
          orderNum:'HDX25648',
        },
        {
          siteName:'新能源换电转',
          userName:'张明',
          phone:'1265458975',
          vehicleNum:'鄂F256452',
          changeStatus:2,
          feeStyle:2,
          totalFee:400,
          payType:2,
          createTime:'2021-06-25 12:25:25',
          orderNum:'HDX25648',
        },
      ],
      totalMoney:2356
    }
  },
  methods:{
    getList() {
      this.loading = true;
      // listBattery(this.queryParams).then(response => {
      //   this.orderList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 汇总 */
    getTotal() {

    },
    /** 导出按钮操作 */
    handleExport() {
      // this.download('system/battery/export', {
      //   ...this.queryParams
      // }, `system_battery.xlsx`)
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

<style lang="scss" scoped>
  .total-money{
    display: inline-block;
    color:#D9001B;
    font-size: 20px;
    margin-left: 10px;
    height: 28px;
    line-height: 28px;
  }
</style>
