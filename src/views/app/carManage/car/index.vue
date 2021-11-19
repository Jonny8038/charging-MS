<template>
  <div class="app-container">
    <el-form size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="110px">
      <el-form-item label="车辆名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车辆名字"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌" prop="cno">
        <el-input
          v-model="queryParams.cno"
          placeholder="请输入车牌"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车的品牌" prop="pname">
        <el-input
          v-model="queryParams.pname"
          placeholder="请输入车的品牌"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="型号" prop="xhname">
        <el-input
          v-model="queryParams.xhname"
          placeholder="请输入型号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名字" prop="uname">
        <el-input
          v-model="queryParams.uname"
          placeholder="请输入用户名字"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="驾驶证图片" prop="jsimg">
        <el-input
          v-model="queryParams.jsimg"
          placeholder="请输入驾驶证图片"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行驶证正面" prop="xszimg">
        <el-input
          v-model="queryParams.xszimg"
          placeholder="请输入行驶证正面"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行驶证反面" prop="xszfimg">
        <el-input
          v-model="queryParams.xszfimg"
          placeholder="请输入行驶证反面"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车辆图片" prop="climg">
        <el-input
          v-model="queryParams.climg"
          placeholder="请输入车辆图片"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="区域" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入区域"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="区域id" prop="aid">
        <el-input
          v-model="queryParams.aid"
          placeholder="请输入区域id"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="联系电话" prop="photo">
        <el-input
          v-model="queryParams.photo"
          placeholder="请输入联系电话"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="行驶证注册日期" prop="starttime">
        <el-date-picker clearable size="mini"
          v-model="queryParams.starttime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择行驶证注册日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行驶证发证日期" prop="endtime">
        <el-date-picker clearable size="mini"
          v-model="queryParams.endtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择行驶证发证日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="驾驶证开始日期" prop="carktime">
        <el-date-picker clearable size="mini"
          v-model="queryParams.carktime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择驾驶证开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="驾驶证结束日期" prop="carjtime">
        <el-date-picker clearable size="mini"
          v-model="queryParams.carjtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择驾驶证结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:car:add']"
        >新增1</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:car:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:car:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:car:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> 

    <el-table border size='mini' align="center" stripe v-loading="loading" :data="carList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="车辆id" align="center" prop="id" /> -->
      <el-table-column label="车辆名字" align="center" prop="name" />
      <el-table-column label="车牌"  width="100" align="center" prop="cno" />
      <el-table-column label="车的品牌" align="center" prop="pname" />
      <!-- <el-table-column label="型号id" align="center" prop="xhid" />
      <el-table-column label="品牌id" align="center" prop="pid" /> -->
      <el-table-column label="型号" align="center" prop="xhname" />
      <!-- <el-table-column label="用户id" align="center" prop="uid" /> -->
      <el-table-column label="用户名字" align="center" prop="uname" />
      <!-- <el-table-column label="驾驶证图片" align="center" prop="jsimg" />
      <el-table-column label="行驶证正面" align="center" prop="xszimg" />
      <el-table-column label="行驶证反面" align="center" prop="xszfimg" />
      <el-table-column label="车辆图片" align="center" prop="climg" /> -->
      <el-table-column label="区域" align="center" prop="area" />
      <!-- <el-table-column label="区域id" align="center" prop="aid" /> -->
      <el-table-column label="联系电话" align="center" prop="photo" />
      <el-table-column label="行驶证注册日期" align="center" prop="starttime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.starttime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行驶证发证日期" align="center" prop="endtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证开始日期" align="center" prop="carktime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.carktime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证结束日期" align="center" prop="carjtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.carjtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width='180' class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:car:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:car:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看车辆信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="车辆名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入车辆名字" />
        </el-form-item>
        <el-form-item label="车牌" prop="cno">
          <el-input v-model="form.cno" placeholder="请输入车牌" />
        </el-form-item>
        <el-form-item label="车的品牌" prop="pname">
          <el-input v-model="form.pname" placeholder="请输入车的品牌" />
        </el-form-item>
        <!-- <el-form-item label="型号id" prop="xhid">
          <el-input v-model="form.xhid" placeholder="请输入型号id" />
        </el-form-item>
        <el-form-item label="品牌id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入品牌id" />
        </el-form-item> -->
        <el-form-item label="型号" prop="xhname">
          <el-input v-model="form.xhname" placeholder="请输入型号" />
        </el-form-item>
        <!-- <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item> -->
        <el-form-item label="用户名字" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入用户名字" />
        </el-form-item>
        <el-form-item label="驾驶证图片" prop="jsimg" style="display: flex;flex-direction: column;">
          <img :src="form.jsimg" width="200" height="150" />
          <!-- <el-input v-model="form.jsimg" placeholder="请输入驾驶证图片" /> -->
        </el-form-item>
        <el-form-item label="行驶证正面" prop="xszimg" style="display: flex;flex-direction: column;">
           <img :src="form.xszimg" width="200" height="150" />
          <!-- <el-input v-model="form.xszimg" placeholder="请输入行驶证正面" /> -->
        </el-form-item>
        <el-form-item label="行驶证反面" prop="xszfimg" style="display: flex;flex-direction: column;">
          <img :src="form.xszfimg" width="200" height="150" />
          <!-- <el-input v-model="form.xszfimg" placeholder="请输入行驶证反面" /> -->
        </el-form-item>
        <el-form-item label="车辆图片" prop="climg" style="display: flex;flex-direction: column;">
          <img :src="form.climg" width="200" height="150" />
          <!-- <el-input v-model="form.climg" placeholder="请输入车辆图片" /> -->
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input v-model="form.area" placeholder="请输入区域" />
        </el-form-item>
        <!-- <el-form-item label="区域id" prop="aid">
          <el-input v-model="form.aid" placeholder="请输入区域id" />
        </el-form-item> -->
        <el-form-item label="联系电话" prop="photo">
          <el-input v-model="form.photo" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="行驶证注册日期" prop="starttime">
          <el-date-picker clearable size="mini"
            v-model="form.starttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择行驶证注册日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="行驶证发证日期" prop="endtime">
          <el-date-picker clearable size="mini"
            v-model="form.endtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择行驶证发证日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶证开始日期" prop="carktime">
          <el-date-picker clearable size="mini"
            v-model="form.carktime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择驾驶证开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶证结束日期" prop="carjtime">
          <el-date-picker clearable size="mini"
            v-model="form.carjtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择驾驶证结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listCar, getCar, delCar, addCar, updateCar } from "@/api/app/car";

export default {
  name: "Car",
  components: {
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
      // 弹出层标题
      title: "",
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
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true;
      listCar(this.queryParams).then(response => {
        this.carList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        remark: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加车辆信息";
    },
    /** 查看按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCar(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看车辆信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCar(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCar(this.form).then(response => {
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
      this.$confirm('是否确认删除车辆信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCar(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/car/export', {
        ...this.queryParams
      }, `system_car.xlsx`)
    }
  }
};
</script>
