<template>
  <div class="app-container">
    <el-form size='mini'
             :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="110px">
      <el-form-item label="车牌号码"
                    prop="number">
        <el-input v-model="queryParams.number"
                  placeholder="请输入车牌号码"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户姓名"
                    prop="name">
        <el-input v-model="queryParams.name"
                  placeholder="请输入用户姓名"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
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
              :data="carList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="车牌号码"
                       align="center"
                       prop="cno" />
      <el-table-column label="用户姓名"
                       width="100"
                       align="center"
                       prop="uname" />
      <el-table-column label="品牌型号"
                       align="center"
                       prop="pname" />
      <el-table-column label="车载终端编号"
                       align="center"
                       prop="xhname" />
      <el-table-column label="发动机号"
                       align="center"
                       prop="uname" />
      <el-table-column label="行驶里程"
                       align="center"
                       prop="area">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.starttime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控数量"
                       align="center"
                       prop="photo" />
      <el-table-column label="操作"
                       align="center"
                       width='180'
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:car:edit']">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <!-- 查看车辆信息对话框 -->
    <flvVideo :open.sync="open" :title="title" :carId="carId"></flvVideo>
  </div>
</template>

<script>
import { listCar, getCar, delCar, addCar, updateCar } from '@/api/app/car'

import flvVideo from '@/views/app/carManage/monitoring/video/index.vue'

export default {
  name: 'Monitoring',
  components: { flvVideo },
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
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
        starttime: null,
        endtime: null,
        carktime: null,
        carjtime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      options: [
        {
          value: '0',
          label: '全部故障',
        },
        {
          value: '2',
          label: '电池故障',
        },
        {
          value: '3',
          label: '驱动电机故障',
        },
      ],
      alarms: [
        {
          value: '0',
          label: '全部类型',
        },
        {
          value: '2',
          label: '回路2存在反向压差（Er052)',
        },
        {
          value: '3',
          label: '12V欠压故障（Er004)',
        },
        {
          value: '4',
          label: '控制器过热故障（Er009)',
        },
        {
          value: '5',
          label: '回路2上电超时故障（Er125)',
        },
        {
          value: '6',
          label: '驱动过流故障（Er002)',
        },
        {
          value: '7',
          label: '输出缺相（Er008)',
        },
        {
          value: '8',
          label: '单体电池电压报警',
        },
        {
          value: '9',
          label: '电池电压不在控制器范围（Er124)',
        },
        {
          value: '10',
          label: '主正接触器粘连（Er65)',
        },
        {
          value: '11',
          label: '主负继电器粘连',
        },
        {
          value: '12',
          label: '电机过载故障（Er023)',
        },
      ],
      flvPlayer: null,
      carId:''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      // this.createVideo()

    })
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true
      listCar(this.queryParams).then((response) => {
        this.carList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
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
        starttime: null,
        endtime: null,
        carktime: null,
        carjtime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
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
      this.open = true
      this.title = '添加车辆信息'
    },
    /** 查看按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.open = true
      this.title = '车辆监控'
      this.carId=row.id;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCar(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCar(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm(
        '是否确认删除车辆信息编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delCar(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/car/export',
        {
          ...this.queryParams,
        },
        `system_car.xlsx`
      )
    },

  },
}
</script>
