<template>
  <el-dialog title="站点电池列表"
             width="90%"
             :visible="showBatteryList"
             :before-close="handleClose"
             :modal-append-to-body="false"
             :close-on-click-modal="false">
    <el-form size='mini' :model="queryParams" ref="queryListForm" :inline="true"  label-width="82px">
      <el-form-item label="站场名称" prop="sname">
        <el-input
          v-model="queryParams.sname"
          placeholder="请输入站场名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="适配车型" prop="spcx">-->
<!--        <el-input-->
<!--          v-model="queryParams.spcx"-->
<!--          placeholder="请输入适配车型"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="适配车型"  prop="type">
        <el-select v-model="queryParams.spcx" multiple  placeholder="请选择适配车型" style="width: 100%;">
          <el-option
            v-for="item in carTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电池型号" prop="type">
        <el-select v-model="queryParams.type"
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
      <el-form-item label="电池编号" prop="bno">
        <el-input
          v-model="queryParams.bno"
          placeholder="请输入电池编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border size='mini' align="center" stripe v-loading="loading" :data="batteryList">
      <el-table-column label="序号" type="index" align="center" width="60"/>
      <el-table-column label="站场名称" align="center" prop="sname" />
      <el-table-column label="电池编号" align="center" prop="bno" />
      <el-table-column label="充电状态" align="center" prop="chargeStatus">
        <template slot-scope="scope">
          <span>{{scope.row.chargeStatus==1?'充电中':'未充电'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="适配车型" align="center" prop="spcx">
        <template slot-scope="scope">
          <div v-for="(item,index) in adaptCarType(scope.row.spcx)">{{item}}</div>
        </template>
      </el-table-column>
      <el-table-column label="电池型号" align="center" prop="type">
        <template slot-scope="scope"><span>{{batteryType(scope.row.type)}}</span></template>
      </el-table-column>
      <el-table-column label="厂家" align="center" prop="factoryName" />
      <el-table-column label="出厂时间" align="center" prop="factoryTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:battery:edit']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['system:battery:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['system:battery:edit']"
              v-if="scope.row.chargeStatus==1"
            >结束充电</el-button>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['system:battery:edit']"
              v-if="scope.row.chargeStatus==2"
            >开启充电</el-button>
        </template>
      </el-table-column>
    </el-table>

  <addBatteryModule :open.sync="open" :title="title" :rowId.sync="rowId" :siteOptions="siteOptions" :carTypeList="carTypeList" @reload="getSiteBatteryList"/>
  </el-dialog>
</template>

<script>
import { listSite } from "@/api/system/site";
import { listSiteBattery,delBatteryList } from "@/api/app/battery";
import addBatteryModule from "@/views/app/battery/addBattery"
export default {
  name: 'batteryList',
  props:{
    showBatteryList:Boolean,
    siteId:[Number,String],
    carTypeList:Array
  },
  components:{
    addBatteryModule
  },
  watch:{
    siteId(val){
      if(val){
        this.batteryList=[];
        this.queryParams.sid=val;
        this.getSiteBatteryList();
        this.getlistSite();
      }
    }
  },
  data(){
    return{
      queryParams:{
        pageNum: 1,
        pageSize: 10,
        sname:'',
        spcx:'',
        type:'',
        bno:'',
        sid:''
      },
      siteOptions:[],
      loading:false,
      batteryList:[],
      open:false,
      title:'',
      rowId:'',
    }
  },
  methods:{
    /** 查询站点名字列表 */
    getlistSite() {
      listSite().then(response => {
        this.siteOptions = response.rows;
      });
    },
    /** 查询站点电池列表 */
    getSiteBatteryList(){
      let data={
        sname:this.queryParams.sname,
        spcx:this.queryParams.spcx.length?this.queryParams.spcx.join(','):'',
        type:this.queryParams.type,
        bno:this.queryParams.bno,
        sid:this.queryParams.sid
      }
      this.loading=true;
      listSiteBattery(data).then(response => {
        this.loading=false;
        this.batteryList=response.rows;
      });
    },
    /** 电池型号过滤 */
    batteryType(val){
      let obj={
        '01':'磷酸铁锂电池',
        '02':'锰酸锂电池',
        '03':'钴酸锂电池',
        '04':'三元材料电池',
        '05':'聚合物锂离子电池',
      }
      return obj[val]
    },
    /** 适配车型过滤 */
    adaptCarType(val){
      let strArr=[]
      let arr=val.split(',');
      arr.forEach((items)=>{
        this.carTypeList.forEach((item)=>{
          if(Number(items)==item.id){
            strArr.push(item.name)
          }
        })
      })
      return strArr
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getSiteBatteryList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryListForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.open = true;
      this.title = "修改电池";
      this.rowId=row.id;
    },
    handleDelete(row){
      let ids=row.id;
      this.$confirm('是否确认删除该电池信息?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        delBatteryList(ids).then(response => {
          console.log(response)
          this.msgSuccess("删除成功");
          this.getSiteBatteryList();
        });
      })
    },
    handleClose(){
      this.$emit('update:showBatteryList',false);
      this.resetForm("queryListForm");
      this.$emit('update:siteId','');
      this.rowId='';
      this.batteryList=[];
    }
  }
}
</script>

<style scoped>

</style>
