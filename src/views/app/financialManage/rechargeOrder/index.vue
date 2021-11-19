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
      <el-form-item label="用户电话" prop="phone">
        <el-input
          v-model="queryParams.manager"
          placeholder="请输入用户电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值类型" prop="rechargeType">
        <el-select    v-model="queryParams.rechargeType"
                      placeholder="请选择充值类型"
                      clearable
                      @keyup.enter.native="handleQuery">
          <el-option label="余额充值" value="1"></el-option>
          <el-option label="购买套餐" value="2"></el-option>
        </el-select>
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
      <el-table-column label="用户姓名" align="center" prop="userName"/>
      <el-table-column label="用户电话" align="center" prop="phone"/>
      <el-table-column label="充值类型" align="center" prop="rechargeType">
        <template slot-scope="scope">
          <span>{{scope.row.rechargeType==1?'余额充值':'购买套餐'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center" prop="chargeTotal">
        <template slot-scope="scope"><span>{{scope.row.chargeTotal}}元</span></template>
      </el-table-column>
      <el-table-column label="充值方式" align="center" prop="chargeType">
        <template slot-scope="scope">
          <span>{{scope.row.chargeType==1?'微信支付':'支付宝支付'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值前余额" align="center" prop="beforeChargeFee">
        <template slot-scope="scope"><span>{{scope.row.beforeChargeFee}}元</span></template>
      </el-table-column>
      <el-table-column label="充值后余额" align="center" prop="afterChargeFee">
        <template slot-scope="scope"><span>{{scope.row.afterChargeFee}}元</span></template>
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
        rechargeType:'',
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
          rechargeType:1,
          chargeTotal:200,
          chargeType:1,
          beforeChargeFee:1200,
          afterChargeFee:1400,
          createTime:'2021-06-25 12:25:25',
          orderNum:'HDX25648',
        },
        {
          siteName:'新能源换电转',
          userName:'张明',
          phone:'1265458975',
          vehicleNum:'鄂F256452',
          rechargeType:2,
          chargeTotal:200,
          chargeType:2,
          beforeChargeFee:1200,
          afterChargeFee:1400,
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
