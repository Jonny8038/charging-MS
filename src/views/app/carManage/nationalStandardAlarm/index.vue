<template>
  <div class="app-container">
    <el-form size="mini"
             :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="110px">
      <el-form-item label="关键字"
                    prop="keywords">
        <el-input v-model="queryParams.keywords"
                  placeholder="请输入车牌/ICCID/VIN等"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="注册时间段"
                    prop="registerTime">
        <el-date-picker clearable
                        size="mini"
                        v-model="queryParams.registerTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
<!--      <el-form-item label="是否异常"-->
<!--                    prop="isAbnormal">-->
<!--        <el-select v-model="queryParams.isAbnormal"-->
<!--                   clearable-->
<!--                   placeholder="请选择">-->
<!--          <el-option v-for="item in options"-->
<!--                     :key="item.value"-->
<!--                     :label="item.label"-->
<!--                     :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="审核状态"-->
<!--                    prop="apprStatus">-->
<!--        <el-select v-model="queryParams.apprStatus"-->
<!--                   clearable-->
<!--                   placeholder="请选择">-->
<!--          <el-option v-for="item in checks"-->
<!--                     :key="item.value"-->
<!--                     :label="item.label"-->
<!--                     :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:car:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table class="table-grid-box"
              border
              size="mini"
              align="center"
              stripe
              v-loading="loading"
              :data="carList"
              @selection-change="handleSelectionChange">
      <el-table-column label="序号"
                       align='center'>
        <template slot-scope="scope">
          {{(queryParams.pageNum-1)*queryParams.pageSize+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="姓名"
                       width="100"
                       align="center"
                       prop="uname" />
      <el-table-column label="电话"
                       width="100"
                       align="center"
                       prop="phonenumber" />
      <el-table-column label="车牌号"
                       width="100"
                       align="center"
                       prop="cno" />
      <el-table-column label="车机编号"
                       width="100"
                       align="center"
                       prop="deviceNo" />
      <el-table-column label="注册时间"
                       align="center"
                       prop="createTime"
                       width="150"></el-table-column>
      <el-table-column label="行驶里程"
                       align="center"
                       prop="dqgls" />
      <el-table-column label="换电次数"
                       align="center"
                       prop="changeCount" />
      <el-table-column label="ICCID"
                       align="center"
                       width="100"
                       prop="iccid" />
      <el-table-column label="VIN"
                       align="center"
                       prop="vin">
        <template slot-scope="scope"><span>{{ scope.row.vin }}</span></template>
      </el-table-column>
      <el-table-column label="型号"
                       align="center"
                       prop="xhname" />
      <el-table-column label="驱动电机方式"
                       width="120"
                       align="center"
                       prop="drivePos" />
      <el-table-column label="最高车速（KM/H)"
                       align="center"
                       width="130"
                       prop="maxSpeed" />
      <el-table-column label="纯电继航里程（KM)"
                       align="center"
                       width="140"
                       prop="fullPowerRange" />
      <el-table-column label="通用报警预警值"
                       width="130"
                       align="center"
                       prop="warningValue">
        <template slot-scope="scope">
          <span class="success"
                v-if="scope.row.apprStatus == 0">正常</span>
          <span class="warning"
                v-if="scope.row.apprStatus == 1">异常</span>
          <span class="danger"
                v-if="scope.row.apprStatus == 2">无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width='100px'
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="showCheck(scope.row)"
                     v-hasPermi="['system:car:check']">国标报警</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 表格查看弹窗 -->
    <standardDialog :vin.sync="vin" :showStandardDialog.sync="showStandardDialog" />
  </div>
</template>

<script>
import {
  listCar,
} from '@/api/app/car'
import standardDialog from '@/views/app/carManage/nationalStandardAlarm/standarDialog.vue'
export default {
  name: 'Carlist',
  components: {
    standardDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 车辆信息表格数据
      carList: [],
      //整车数据
      allCarList: [],
      cellList: [],
      electricalList: [],
      theAlarmList:[],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keywords: '',
        // isAbnormal: '',
        // apprStatus: '',
        registerTime: [],
      },
      // 表单参数
      form: {},
      audit: false,
      // 表单校验
      rules: {},
      options: [
        {
          value: '1',
          label: '正常',
        },
        {
          value: '2',
          label: '异常',
        },
      ],
      checks: [
        {
          value: '0',
          label: '未审核',
        },
        {
          value: '1',
          label: '审核通过',
        },
        {
          value: '2',
          label: '审核失败',
        },
      ],
      showStandardDialog: false,
      vin: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 车辆信息列表 */
    getList() {
      let query={
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        // isAbnormal:this.queryParams.isAbnormal,
        keywords: this.queryParams.keywords,
        registerTime: JSON.stringify(this.queryParams.registerTime),
      }
      this.loading = true
      listCar(query).then((response) => {
        this.carList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    showCheck(row) {
      this.vin = row.vin
      this.showStandardDialog = true
    },
    //查询功能按钮
    handleQuery() {
      this.getList()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        cno: null,
        pname: null,
        xhid: null,
        pid: null,
        xhname: null,
        uid: null,
        uname: null,
        jsimg: null,
        xszimg: null,
        xszfimg: null,
        climg: null,
        area: null,
        aid: null,
        photo: null,
        endtime: null,
        carktime: null,
        carjtime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        keywords: '',
        isAbnormal: '',
        apprStatus: '',
        registerTime: [],
      }
      this.resetForm('form')
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'app/car/export',
        {
          ...this.queryParams,
        },
        `car__list.xlsx`
      )
    },
  },
}
</script>
<style lang='scss' scoped>
.success {
  color: #67c23a;
}
.warning {
  color: #e6a23c;
}
.danger {
  color: #f56c6c;
}
::v-deep.table-grid-box .el-button + .el-button{
  margin-left: 0;
}
</style>
<style lang='scss'>
.checkCarlist {
  .el-dialog__header {
    padding: 0;
  }
}
</style>
