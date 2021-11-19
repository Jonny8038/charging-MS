<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      size="mini"
      v-show="showSearch"
      label-width="82px">
      <el-form-item label="站场名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入站点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入所属区域"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="cname">
        <el-input
          v-model="queryParams.cname"
          placeholder="请输入站场负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="电话" prop="phone">-->
<!--        <el-input-->
<!--          v-model="queryParams.phone"-->
<!--          placeholder="请输入电话"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <!-- <el-form-item label="管理员id" prop="cid">
        <el-input
          v-model="queryParams.cid"
          placeholder="请输入管理员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['system:site:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:site:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:site:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:site:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="siteList"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站场名字" align="center" prop="name" />
      <el-table-column label="站场编号" align="center" prop="no" />
      <el-table-column label="所属区域" align="center" prop="areas" />
      <el-table-column label="站场位置" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.province+scope.row.city}}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业状态" align="center" prop="istype">
        <template slot-scope="scope">
          <span>{{scope.row.istype=='1'?'营业中':'休息中'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费标准" align="center" prop="feeStyle">
        <template slot-scope="scope">
          <span>{{scope.row.feeStyle==1?scope.row.fee+'元/度':scope.row.fee+'元/公里'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="cname" />
      <el-table-column label="站场电话" align="center" prop="phone" />
      <el-table-column label="营业时间" align="center" prop="bussTime" />
      <el-table-column label="建站时间" align="center" prop="createTime" width="180" />
      <el-table-column
        label="操作"
        align="center"
        class-name="">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:site:edit']"
            >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:site:remove']"
            >删除</el-button>
          <el-button
            size="mini"
            type="success" v-if="scope.row.istype=='1'" @click="updateSiteWorkStatus(scope.row,2)">暂停营业</el-button>
          <el-button
            size="mini"
            type="primary" v-if="scope.row.istype=='2'"  @click="updateSiteWorkStatus(scope.row,1)">开始营业</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>

    <!-- 添加或修改站点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body  :close-on-click-modal="false">
      <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="站场名字" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入站场名字"/>
        </el-form-item>
        <el-form-item label="营业状态" prop="istype">
          <el-select  v-model="form.istype" placeholder="请选择营业状态" style="width: 100%">
            <el-option label="营业中" :value="1"></el-option>
            <el-option label="休息中" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费标准" prop="feeType">
          <el-select  v-model="form.feeType" placeholder="请选择收费标准" style="width: 100%">
            <el-option label="电量" :value="2"></el-option>
            <el-option label="里程" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="fee" v-show="form.feeType==2">
          <el-input
            value="address"
            v-model.number="form.fee"
            type="number"
            placeholder="请输入单价">
            <template slot="append">元/度</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单价" prop="fee" v-show="form.feeType==1">
          <el-input
            value="address"
            v-model.number="form.fee"
            type="number"
            placeholder="请输入单价">
            <template slot="append">元/公里</template>
          </el-input>
        </el-form-item>
        <div class="dtcon" label="地图">
          <baidu-map
            class="bm-view"
            :zoom="12"
            :scroll-wheel-zoom="true"
            @ready="handler"
            :mapClick="false"></baidu-map>
        </div>
        <el-form-item label="所属省份" prop="province">
          <el-select  v-model="form.province" placeholder="请选择省份" @change="getCity" style="width: 100%">
            <el-option v-for="item in provinceData" :label="item.name" :value="item.name" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属城市" prop="city">
          <el-select  v-model="form.city" placeholder="请选择城市" @change="getArea" style="width: 100%">
            <el-option v-for="item in cityData" :label="item.name" :value="item.name" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="areas">
          <el-select  v-model="form.areas" placeholder="请选择区域" @change="areaChange" style="width: 100%">
            <el-option v-for="item in areaData" :label="item.name" :value="item.name" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站场地址" prop="address">
          <el-input
            value="address"
            v-model="form.address"
            placeholder="请输入站场地址" @input="addressChange" style="width:calc(100% - 63px)"/>
          <el-button type="primary" size="mini" style="margin-left:5px" @click="setMarkPosition">定位</el-button>
        </el-form-item>
        <div style="display: flex;">
          <el-form-item label="经度" prop="zx">
            <el-input v-model="form.zx" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度" prop="zy">
            <el-input v-model="form.zy" placeholder="请输入纬度" />
          </el-form-item>
        </div>

        <el-form-item label="联系电话" prop="phone">
          <el-input
            value="phone"
            v-model="form.phone"
            placeholder="请输入电话"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="cname">
          <el-input v-model="form.cname" placeholder="请输入负责人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSite,
  getSite,
  delSite,
  addSite,
  updateSite,
  updateSiteType
} from "@/api/app/site";

import { SitelistUser } from "@/api/system/user";
import {listProvince ,listCity ,listArea} from "@/api/app/provinceCityArea";

import {checkMobile} from '@/utils/validate'

export default {
  name: "Site",
  components: {},
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
      // 站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        address: null,
        zx: null,
        zy: null,
        name: null,
        phone: null,
        cname: null,
        cid: null,
      },
      // 表单参数
      form: {
        id: null,
        province: null,
        city: null,
        areas: null,
        address: null,
        postcode:null,
        zx: null,
        zy: null,
        name: null,
        phone: null,
        cname: null,
        cid: null,
        istype:'',
        feeType: null,
        fee:null
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入站场名字', trigger: 'blur' }
        ],
        istype: [
          { required: true, message: '请选择营业状态', trigger: 'change' }
        ],
        feeType: [
          { required: true, message: '请选择收费标准', trigger: 'change' }
        ],
        fee: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        areas: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入站场地址', trigger: 'blur' }
        ],
        zx: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        zy: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话'},
          { validator: checkMobile }
        ],
        cname: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
      },
      // 用户名字
      userOptions: undefined,
      center:{
        lng:'112.131408',
        lat:'32.015532'
      },
      provinceData:[],
      cityData:[],
      areaData:[],
      provinceCode:'',
      cityCode:'',
      areaCode:'',
    };
  },
  created() {
    this.getList();
    this.getProvince();
    // this.getlistUser();
  },

  methods: {
    handler({ BMap, map }) {
      var point = new BMap.Point(this.center.lng, this.center.lat);
      map.centerAndZoom(point, 13);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      window.map = map;
    },
    getPoint(e) {
      var allOverlay = window.map.getOverlays();
      for (var j = 0; j < allOverlay.length; j++) {
        window.map.removeOverlay(allOverlay[j]); // //删除之前的标记点
      }
      this.form.zx = e.point.lng;
      this.form.zy = e.point.lat;
      this.point = new BMap.Point(e.point.lng, e.point.lat);
      var marker = new BMap.Marker(this.point);
      window.map.addOverlay(marker);
      window.map.centerAndZoom(this.point, 12);

      // var gc = new BMap.Geocoder();
      // gc.getLocation(this.point, (rs)=> {
      //   this.getCity(rs.addressComponents.province)
      //   this.getArea(rs.addressComponents.city)
      //   this.areaChange(rs.addressComponents.district)
      //   this.form.province=rs.addressComponents.province
      //   this.form.city=rs.addressComponents.city
      //   this.form.areas=rs.addressComponents.district
      // });
    },
    setMarkPosition(){
      var allOverlay = window.map.getOverlays();
      for (var j = 0; j < allOverlay.length; j++) {
        window.map.removeOverlay(allOverlay[j]); // //删除之前的标记点
      }
      var myGeo = new BMap.Geocoder();
      myGeo.getPoint(this.form.address,(point)=>{
        if(point){
          console.log(point)
          this.form.zx = point.lng;
          this.form.zy = point.lat;
          this.point = new BMap.Point(point.lng, point.lat);
          var marker = new BMap.Marker(this.point);
          window.map.addOverlay(marker);
          window.map.centerAndZoom(this.point, 12);
        }
      },this.form.city)
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true;
      listSite(this.queryParams).then((response) => {
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询省份
    getProvince(){
      listProvince().then((response)=>{
        this.provinceData=response.data;
      })
    },
    //根据省份查询省份下所属城市
    getCity(val){
      this.form.city='';
      this.form.areas='';
      window.map.centerAndZoom(val,12);
      this.form.address=this.form.province+this.form.city+this.form.areas;
      this.provinceData.forEach((item)=>{
        if(item.name==val){
          this.provinceCode= item.code
        }
      })
      let query={
        province:this.provinceCode
      }
      listCity(query).then((response)=>{
        this.cityData=response.data;
      })
      // provinceName
    },
    //根据所属城市查询城市下所属区
    getArea(val){
      this.form.areas='';
      window.map.centerAndZoom(val,12);
      this.form.address=this.form.province+this.form.city+this.form.areas;
      this.cityData.forEach((item)=>{
        if(item.name==val){
          this.cityCode= item.code
        }
      })
      let query={
        city:this.cityCode
      }
      listArea(query).then((response)=>{
        console.log(response)
        this.areaData=response.data;
      })
    },
    //根据区域变化，获取区域名称，以及邮编
    areaChange(val){
      window.map.centerAndZoom(val,12);
      this.form.address=this.form.province+this.form.city+this.form.areas;
      this.areaData.forEach((item)=>{
        if(item.name==val){
          this.form.postcode=item.code
        }
      })
    },
    //根据地址改变定位
    addressChange(val){

    },
    //更新站点营业状态
    updateSiteWorkStatus(row,istype){
      let query={
        siteId:row.id,
        istype:istype
      }
      this.$confirm('是否确认修改站点营业状态?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        updateSiteType(query).then((response)=>{
          console.log(response)
          this.msgSuccess("营业状态修改成功");
          this.getList();
        })
      })
    },
    // 下拉选择管理员名字
    getCname(val){
      this.userOptions.forEach(item => {
        if(val==item.userId){
          this.form.cname=item.userName
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        province: null,
        city: null,
        areas: null,
        address: null,
        postcode:null,
        zx: null,
        zy: null,
        zname: null,
        phone: null,
        cname: null,
        cid: null,
      };
      this.resetForm("form");
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查询站端列表 */
    getlistUser() {
      SitelistUser().then((response) => {
        // console.log('response.rows',response.rows);
        this.userOptions = response.rows;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.center.lng='112.131408';
      this.center.lat='32.015532';
      // this.getlistUser();
      this.open = true;
      this.title = "添加站点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.getlistUser();
      const id = row.id || this.ids;
      getSite(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改站点";
        this.center.lng=response.data.zx;
        this.center.lat=response.data.zy;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSite(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSite(this.form).then((response) => {
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
      this.$confirm('是否确认删除站点编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
          return delSite(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/site/export",
        {
          ...this.queryParams,
        },
        `app_site.xlsx`
      );
    },
  },
};
</script>
<style scoped>
.app-container{
  width:100%;
  height:100%;
  overflow-y: auto;
}
.dtcon {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.dtcon .el-form-item__content {
  margin-left: 0 !important;
}

.bm-view {
  width: 100%;
  height: 200px;
}
::v-deep.el-form-item--mini.el-form-item{
  margin-bottom: 15px;
}
</style>
