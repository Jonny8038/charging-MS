<template>
  <div class="app-container">
    <el-form size='mini'
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
      <el-form-item label="是否异常"
                    prop="isAbnormal">
        <el-select v-model="queryParams.isAbnormal"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态"
                    prop="apprStatus">
        <el-select v-model="queryParams.apprStatus"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in checks"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
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
    <el-table border
              size='mini'
              align="center"
              stripe
              v-loading="loading"
              :data="registerList"
              @selection-change="handleSelectionChange">
      <el-table-column label="序号"
                       type="index"
                       align="center"
                        />
      <el-table-column label="姓名"
                       width="100"
                       align="center"
                       prop="name" />
      <el-table-column label="车牌号"
                       width="100"
                       align="center"
                       prop="cno" />
      <el-table-column label="车机编号"
                       align="center"
                       prop="dqgls" />
      <el-table-column label="行驶证号"
                       align="center"
                       prop="xszno" />
      <el-table-column label="驾驶证号"
                       width='150'
                       align="center"
                       prop="jsno" />
      <el-table-column label="手机号"
                       width='120'
                       align="center"
                       prop="phonenumber" />
      <el-table-column label="注册时间"
                       align="center"
                       prop="createTime"
                       width="150">
      </el-table-column>
      <el-table-column label="审核时间"
                       align="center"
                       prop="apprTime"
                       width="150">
      </el-table-column>
      <el-table-column label="审核状态"
                       align="center"
                       prop="apprStatus">
        <template slot-scope="scope">
          <span class="success"
                v-if="scope.row.apprStatus==0">未审核</span>
          <span class="warning"
                v-if="scope.row.apprStatus==1">审核通过</span>
          <span class="danger"
                v-if="scope.row.apprStatus==2">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column label="行驶里程"
                       align="center"
                       prop="dqgls" />
      <el-table-column label="ICCID"
                       align="center"
                       width='100'
                       prop="iccid" />
      <el-table-column label="VIN"
                       align="center"
                       prop="vin" />
      <el-table-column label="型号"
                       align="center"
                       prop="xhname" />
      <el-table-column label="驱动电机位置"
                       align="center"
                       prop="drivePos"
                       width="150"/>
      <el-table-column label="最高车速（KM/H)"
                       align="center"
                       prop="maxSpeed"
                       width="150"/>
      <el-table-column label="纯电继航里程（KM)"
                       align="center"
                       prop="fullPowerRange"
                       width="150"/>
      <el-table-column label="操作"
                       align="center"
                       width='80'
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     :disabled="scope.row.apprStatus==1||scope.row.apprStatus==2"
                     @click="showAudit(scope.row)"
                     v-hasPermi="['system:car:audit']">审核</el-button>
          <el-button size="mini"
                     type="text"
                     @click="viewAudit(scope.row)"
                     >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!--用户信息审核弹框-->
    <userInfoDialog :showUserInfo.sync="showUserInfo" :title="title" :rowId.sync="rowId" :carId="carId" :isEdit="isEdit" :isView="isView" :carTypeList="carTypeList" @reload="getList"/>
  </div>
</template>

<script>
import userInfoDialog from "@/views/app/business/user/userInfoDialog"
import {
  listReg,
  getCar,
  delCar,
  addCar,
  updateCar,
  checkPort,
  exportReport,
} from '@/api/app/car'

import {listCarType} from "@/api/app/battery";

export default {
  name: 'Register',
  components:{
    userInfoDialog
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
      registerList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        check: null,
        status: null,
        endtime: null,
        carktime: null,
        carjtime: null,
        keywords: '',
        isAbnormal: '',
        apprStatus: '',
        registerTime: [],
      },
      // 表单参数
      form: {
        textarea: '',
      },
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
      showUserInfo:false,
      isEdit:false,
      isView:false,
      title:'',
      rowId:'',
      carId:'',
      carTypeList:[],
    }
  },
  created() {
    this.getList()
    this.getCarTypeList()
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true
      listReg(this.queryParams).then((response) => {
        this.registerList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询电池适配车辆列表 */
    getCarTypeList() {
      listCarType().then(response => {
        this.carTypeList = response.rows;
      });
    },
    //查询功能按钮
    handleQuery() {
      this.loading = true
      this.queryParams.registerTime = JSON.stringify(
        this.queryParams.registerTime
      )
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
      this.getList()
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
        'app/car/export/reg',
        {
          ...this.queryParams,
        },
        `register_car.xlsx`
      )
    },
    // 审核弹窗
    showAudit(row) {
      this.showUserInfo=!this.showUserInfo;
      this.title='审核';
      this.rowId=row.uid;
      this.carId=row.id;
      this.isEdit=false;
      this.isView=false;
    },
    //查看用户信息
    viewAudit(row){
      this.showUserInfo=!this.showUserInfo;
      this.title='查看';
      this.rowId=row.uid;
      this.carId=row.id;
      this.isEdit=false;
      this.isView=true;
    },
    //审核成功接口
    pass() {
      this.loading = true
      let query = {
        apprContent: this.form.textarea,
        carId: this.rowInfoData.id,
        status: 1,
      }
      checkPort(query).then((response) => {
        this.loading = false
        this.audit = false
        this.getList()
      })
    },
    //审核失败接口
    faild() {
      this.loading = true
      let query = {
        apprContent: this.form.textarea,
        carId: this.rowInfoData.id,
        status: 2,
      }
      checkPort(query).then((response) => {
        this.loading = false
        this.audit = false
        this.getList()
      })
    },
  },
}
</script>
<style scoped>
.success {
  color: #67c23a;
}
.warning {
  color: #e6a23c;
}
.danger {
  color: #f56c6c;
}
</style>
