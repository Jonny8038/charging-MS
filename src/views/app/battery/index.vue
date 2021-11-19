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
      <el-form-item label="适配车型" prop="adaptCarTyp">
        <el-select v-model="queryParams.adaptCarTyp" multiple  placeholder="请选择适配车型" style="width: 100%;">
          <el-option
            v-for="item in carTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电池型号" prop="batteryType">
        <el-select v-model="queryParams.batteryType"
                   clearable
                   placeholder="请选择电池型号"
                   style="width: 100%;"
                   @keyup.enter.native="handleQuery">
          <el-option label="磷酸铁锂电池" value="01"></el-option>
          <el-option label="锰酸锂电池" value="02"></el-option>
          <el-option label="钴酸锂电池" value="03"></el-option>
          <el-option label="三元材料电池" value="04"></el-option>
          <el-option label="聚合物锂离子电池" value="05"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="manager">
        <el-input
          v-model="queryParams.manager"
          placeholder="请输入负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站场电话" prop="sitePhone">
        <el-input
          v-model="queryParams.sitePhone"
          placeholder="请输入站场电话"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:battery:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:battery:remove']"-->
<!--        >删除</el-button>-->
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:battery:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border size='mini' align="center" stripe v-loading="loading" :data="batteryList" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="55" align="center" />
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="站场名称" align="center" prop="siteName" />
      <el-table-column label="充电中" align="center" prop="chargingBatteryNum"></el-table-column>
      <el-table-column label="已充电" align="center" prop="fullBatteryNum"></el-table-column>
      <el-table-column label="电池告警数" align="center" prop="warnBatteryNum"></el-table-column>
      <el-table-column label="适配车型" align="center" prop="adaptCarTypes">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.adaptCarTypes" :key="index">{{item}}</div>
        </template>
      </el-table-column>
      <el-table-column label="电池型号" align="center" prop="batteryTypeNumMap">
        <template slot-scope="scope">
          <div  v-for="(val, key, index) in scope.row.batteryTypeNumMap" :key="index">{{key}}:{{val}}块</div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="manager" />
      <el-table-column label="站场电话" align="center" prop="sitePhone" />
      <el-table-column label="预约人数" align="center" prop="reservedNum" />
      <el-table-column label="电池详情" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="showBatteryStatusDialog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['system:battery:edit']"-->
<!--          >修改</el-button>-->
          <el-button
            size="mini"
            type="text" @click="checkSiteBattery(scope.row)">查看站点电池</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['system:battery:edit']"-->
<!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>
    <!-- 添加电池对话框 -->
    <addBatteryModule :open.sync="open" :title="title" :siteOptions="siteOptions" :rowId.sync="rowId" :carTypeList="carTypeList" @reload="getList"/>

    <!-- 电池状态弹框-->
    <batteryStatus :showBatteryStatus.sync="showBatteryStatus" :batteryStationId="batteryStationId" class="battery-status"/>

    <!--站点电池列表弹框-->
    <batteryList :showBatteryList.sync="showBatteryList" :siteId.sync="siteId"  :carTypeList="carTypeList"/>
  </div>
</template>

<script>
import { listBattery, getBattery, delBattery, listCarType} from "@/api/app/battery";

import { listSite } from "@/api/system/site";
import { listUser } from "@/api/system/user";

import batteryStatus from "@/views/app/battery/batteryStatus"
import batteryList from "@/views/app/battery/batteryList"
import addBatteryModule from "@/views/app/battery/addBattery"

export default {
  name: "Battery",
  components: {
    batteryStatus,
    batteryList,
    addBatteryModule
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
      // 电池表格数据
      batteryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 站点名字
      siteOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName:'',
        adaptCarTyp:'',
        batteryType:'',
        manager:'',
        sitePhone:''
      },
      userOptions: undefined,
      yctypeList: [
        { //电池状态
          index: 0,
          name: '正常'
        },
        {
          index: 1,
          name: '异常'
        }],
      showBatteryStatus:false,
      batteryStationId:'',
      showBatteryList:false,
      siteId:'',
      carTypeList:[],
      rowId:''
    };
  },
  created() {
    this.getList();
    this.getlistUser();
    this.getlistSite();
    this.getCarTypeList();
  },
  methods: {
    /** 查询电池列表 */
    getList() {
      this.loading = true;
      let query= {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          siteName:this.queryParams.siteName,
          adaptCarTyp:this.queryParams.adaptCarTyp.length?this.queryParams.adaptCarTyp.join(','):'',
          batteryType:this.queryParams.batteryType,
          manager:this.queryParams.manager,
          sitePhone:this.queryParams.sitePhone
      }
      listBattery(query).then(response => {
        this.batteryList = response.rows;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
     /** 查询管理员列表 */
    getlistUser() {
      listUser().then((response) => {
        this.userOptions = response.rows;
      });
    },
    /** 查询站点名字列表 */
    getlistSite() {
      listSite().then(response => {
        this.siteOptions = response.rows;
      });
    },
    /** 查询电池适配车辆列表 */
    getCarTypeList() {
      listCarType().then(response => {
        console.log('response.rows',response.rows);
        this.carTypeList = response.rows;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.getlistUser();
      this.open = !this.open;
      this.title = "添加电池";
      this.rowId='';
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBattery(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBattery(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认下线电池编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBattery(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/battery/export', {
        ...this.queryParams
      }, `system_battery.xlsx`)
    },
    //电池状态查看
    showBatteryStatusDialog(row){
      this.showBatteryStatus=!this.showBatteryStatus;
      this.batteryStationId=row.id;
    },
    //查看站点电池列表
    checkSiteBattery(row){
      console.log(row)
      this.siteId=row.id;
      this.showBatteryList=!this.showBatteryList;
    }
  },
  mounted(){
    this.getCarTypeList();
  }
};
</script>

<style lang="scss" scoped>
.battery-status{
  ::v-deep.el-dialog__header{
    display: none;
  }
  ::v-deep.el-dialog__body{
    height:100%;
    padding:0;
  }
  ::v-deep.el-dialog.is-fullscreen{
    overflow-y: hidden;
  }
}
</style>
