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
              size="mini"
              align="center"
              stripe
              v-loading="loading"
              :data="carList"
              @selection-change="handleSelectionChange">
      <el-table-column label="序号"
                       align='center'>
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
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
      <el-table-column label="车辆详情"
                       align="center"
                       width='100px'
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="showCheck(scope.row)"
                     v-hasPermi="['system:car:check']">车辆详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width='100px'
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="carLine(scope.row)"
                     v-hasPermi="['system:car:edit']">车辆轨迹</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 表格查看弹窗 
    <el-dialog :visible.sync="checkDialog"
               width="100%"
               fullscreen
               custom-class="checkCarlist"
               center>
      <div class="el-dialog-div">
        <car-check :rowOption="rowOption"></car-check>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="cancel">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog> -->

<el-dialog :visible.sync="checkDialog"
               width="100%"
               fullscreen
               custom-class="checkCarlist"
               center>
      <div class="el-dialog-div">
         <div class="page-carCheck">
          <el-form ref="form"
                  :inline="true"
                  :model="dialogForm"
                  size='mini'>
            <el-form-item>
              <el-date-picker v-model="dialogForm.time"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="dialogQuery">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="page-content">
            <el-tabs v-model="activeName"
                    stretch
                    @tab-click="dialogTabClick">
              <el-tab-pane label="整车数据"
                          name="first">
                <div class="page-allCar">
                    <div class="page-content">
                      <el-table :data="dialogOne.allCarList"
                                border
                                align='center'
                                size='mini'
                                style="width: 100%">
                        <el-table-column label="序号"
                                        align='center'>
                          <template slot-scope="scope">
                            {{scope.$index+1}}
                          </template>
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="obdTime"
                                        label="时间"
                                        width="150">        
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="carStatus"
                                        label="车辆状态"
                                        width="100">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="runningMode"
                                        width="90"
                                        label="运行模式">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="mileage"
                                        width="90"
                                        label="累计里程">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="speed"
                                        width="90"
                                        label="车速">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="voltage"
                                        width="100"
                                        label="总电压">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="current"
                                        width="100"
                                        label="总电流">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="soc"
                                        width="100"
                                        label="SOC">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="dc"
                                        width="100"
                                        label="DC/DC状态">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="gear"
                                        width="100"
                                        label="档位">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="resistance"
                                        width="100"
                                        label="绝缘电阻值">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="gasPedalValue"
                                        width="120"
                                        label="加速踏板行程值">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="brakePedalValue"
                                        width="120"
                                        label="制动踏板状态">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="posX"
                                        width="100"
                                        label="当前经度">
                        </el-table-column>
                        <el-table-column align="center"
                                        prop="posY"
                                        label="当前纬度">
                        </el-table-column>
                      </el-table>
                      <pagination v-show="dialogOne.total > 0"
                                  :total="dialogOne.total"
                                  :page.sync="dialogOne.queryParams.pageNum"
                                  :limit.sync="dialogOne.queryParams.pageSize"
                                  @pagination="getAllCar" />
                    </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="电池数据"
                          name="second">
                <div class="page-allCar">
                  <div class="page-content">
                    <el-table :data="dialogTwo.cellList"
                              height="100%"
                              border
                              align='center'
                              size='mini'
                              style="width: 100%">
                      <el-table-column label="序号"
                                      align='center'>
                        <template slot-scope="scope">
                          {{scope.$index+1}}
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="obdTime"
                                      label="时间"
                                      width="120">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="maxTemper"
                                      label="最高温度值"
                                      width="100">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="minTemper"
                                      width="100"
                                      label="最低温
                                      度值">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="maxTemperSysNo"
                                      width="130"
                                      label="最高温度子系统号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="maxTemperProbeNo"
                                      width="130"
                                      label="最高温度探针序号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="minTemperSysNo"
                                      width="130"
                                      label="最低温度子系统号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="minTemperProbeNo"
                                      width="130"
                                      label="最低温度探针序号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="batteryMinVolt"
                                      width="140"
                                      label="电池单体电压最低值">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="batteryMaxVolt"
                                      width="140"
                                      label="电池单体电压最高值">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="maxVoltBatterySysNo"
                                      width="160"
                                      label="最高电压电池子系统号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="maxVoltBatteryNo"
                                      width="160"
                                      label="最高电压电池单体代号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="minVoltBatterySysNo"
                                      width="160"
                                      label="最低电压电池子系统号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="minVoltBatteryNo"
                                      width="160"
                                      label="最低电压电池单体代号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="batteryVolt"
                                      width="120"
                                      label="燃料电池电压">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="batteryCurrent"
                                      width="100"
                                      label="燃料电池电流">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="consumeRate"
                                      width="100"
                                      label="消耗率">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxDensity"
                                      width="100"
                                      label="氢气最高浓度">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxPressure"
                                      width="100"
                                      label="氢气最高压力">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="probeNum"
                                      width="100"
                                      label="温度探针总数">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="pressureDc"
                                      width="120"
                                      label="高压DC/DC状态">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxTemper"
                                      width="130"
                                      label="氢系统中最高温度">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxDensitySensorCode"
                                      width="180"
                                      label="氢气最高浓度传感器代号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxPressureSensorCode"
                                      width="180"
                                      label="氢气最高压力传感器代号">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="hyMaxTemperProbe"
                                      width="180"
                                      label="氢系统中最高温度探针代号">
                      </el-table-column>
                    </el-table>
                    <pagination v-show="dialogTwo.total > 0"
                                :total="dialogTwo.total"
                                :page.sync="dialogTwo.queryParams.pageNum"
                                :limit.sync="dialogTwo.queryParams.pageSize"
                                @pagination="getBattery" />
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="电机数据"
                          name="third">
               <div class="page-allCar">
                  <div class="page-content">
                    <el-table :data="dialogThree.electricalList"
                              height="100%"
                              border
                              align='center'
                              size='mini'
                              style="width: 100%">
                      <el-table-column label="序号"
                                      align='center'>
                        <template slot-scope="scope">
                          {{scope.$index+1}}
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="obdTime"
                                      label="时间"
                                      width="180">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="status"
                                      label="状态"
                                      width="180">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="rotatingSpeed"
                                      label="转速">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="torque"
                                      label="转矩">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="temper"
                                      label="温度">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="controlTemper"
                                      label="控制器温度">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="controlVolt"
                                      label="控制器输入电压">
                      </el-table-column>
                      <el-table-column align="center"
                                      prop="current"
                                      label="控制器直线母线电流">
                      </el-table-column>
                    </el-table>
                    <pagination v-show="dialogThree.total > 0"
                                :total="dialogThree.total"
                                :page.sync="dialogThree.queryParams.pageNum"
                                :limit.sync="dialogThree.queryParams.pageSize"
                                @pagination="getDriver" />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="cancel">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>


    <!--车辆轨迹弹框-->
    <carLineDialog v-if="showCarLine"
                   :showCarLine.sync="showCarLine"
                   :carId="carId" />
  </div>
</template>

<script>
import {
  listCar,
  addCar,
  updateCar,
  AllCar,
  Battery,
  Driver,
} from '@/api/app/car'
import carCheck from '@/views/app/carManage/carlist/carCheck.vue'
import carLineDialog from '@/views/app/carManage/carlist/carLineDialog.vue'

export default {
  name: 'Carlist',
  components: {
    carLineDialog,
    carCheck,
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vin: '',
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
      checkDialog: false,
      editDialog: false,
      showCarLine: false,
      carId: '',
      rowOption:null,
      activeName: 'first',
      dialogTab:'first',
      dialogForm:{},
      dialogOne:{
        allCarList:[],
        total:0,
        queryParams:{
          pageNum:1,
          pageSize:10
        }
      },
       dialogTwo:{
        cellList:[],
        total:0,
        queryParams:{
          pageNum:1,
          pageSize:10
        }
      },
       dialogThree:{
        electricalList:[],
        total:0,
        queryParams:{
          pageNum:1,
          pageSize:10
        }
      }
  
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 车辆信息列表 */
    getList(row) {
      this.loading = true
      listCar(this.queryParams).then((response) => {
        this.carList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    showCheck(row) {
        this.rowOption=row;
        this.dialogOne.allCarList=[];
        this.dialogTwo.cellList=[];
        this.dialogThree.electricalList=[];
        // 查询弹出框中的列表数据,目前查询第一个
        this.getAllCar();
    //   this.getAllCar(row)
    //   this.getBattery(row)
    //   this.getDriver(row)
      this.checkDialog = true
    },
    //查询功能按钮
    handleQuery() {
      this.loading = true
      this.queryParams.registerTime = JSON.stringify(
        this.queryParams.registerTime
      )
      this.loading = false
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.checkDialog = false
      this.reset()
    },
    cancelEdit() {
      this.editDialog = false
      this.reset()
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.addDialog = true
      this.title = '添加车辆信息'
    },
    showEdit(row) {
      this.form = row
      this.editDialog = true
      this.title = '编辑车辆信息'
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCar(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.checkDialog = false
              this.getList()
            })
          } else {
            addCar(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.checkDialog = false
              this.getList()
            })
          }
        }
      })
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
    /** 车辆轨迹 */
    carLine(row) {
      this.carId = row.cno
      this.showCarLine = !this.showCarLine
    },
    getAllCar() {
      this.loading = true
      // 这种情况只处理了分页的情况，如果通过查询按钮需要将pageNum 设置为1
      this.dialogOne.queryParams.vin =this.rowOption.vin;
      AllCar(this.dialogOne.queryParams).then((response) => {
        this.dialogOne.allCarList = response.rows
        //console.log(this.allCarList)
        this.dialogOne.total = response.total
        this.loading = false
      })
    },
    dialogQuery(tab, event){
      if(this.dialogTab == 'first'){
        this.dialogOne.queryParams.pageNum =1;
        this.getAllCar()
      }else if(this.dialogTab  == 'second'){
        this.dialogTwo.queryParams.pageNum =1;
        this.getBattery();
      }else{
        this.dialogThree.queryParams.pageNum =1;
        this.getDriver();
      }
    },
     dialogTabClick(tab, event) {
        this.dialogTab = tab.name;
    },
     getBattery() {
      this.loading = true
      // 这种情况只处理了分页的情况，如果通过查询按钮需要将pageNum 设置为1
      this.dialogTwo.queryParams.vin =this.rowOption.vin;
      Battery(this.dialogTwo.queryParams).then((response) => {
        this.dialogTwo.cellList = response.rows
        this.dialogTwo.total = response.total
        this.loading = false
      })
    },
    getDriver() {
      this.loading = true
      // 这种情况只处理了分页的情况，如果通过查询按钮需要将pageNum 设置为1
      this.dialogThree.queryParams.vin =this.rowOption.vin;
      Driver(this.dialogThree.queryParams).then((response) => {
        this.dialogThree.electricalList = response.rows
        this.dialogThree.total = response.total
        this.loading = false
      })
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
</style>
<style lang='scss'>
.checkCarlist {
  .el-dialog__header {
    padding: 0;
  }
}
</style>
