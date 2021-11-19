<template>
  <div class="app-container">
    <el-form size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="预约人id" prop="yuid">
        <el-input
          v-model="queryParams.yuid"
          placeholder="请输入预约人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约人名字" prop="yname">
        <el-input
          v-model="queryParams.yname"
          placeholder="请输入预约人名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约时间" prop="addtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.addtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择预约时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="站点id" prop="sid">
        <el-input
          v-model="queryParams.sid"
          placeholder="请输入站点id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点名字" prop="sname">
        <el-input
          v-model="queryParams.sname"
          placeholder="请输入站点名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0预约成功1未成功" prop="istype">
        <el-select v-model="queryParams.istype" placeholder="请选择0预约成功1未成功" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌" prop="cno">
        <el-input
          v-model="queryParams.cno"
          placeholder="请输入车牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="换电完成状态0未完成1已完成" prop="wctype">
        <el-select v-model="queryParams.wctype" placeholder="请选择换电完成状态0未完成1已完成" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="电池情况0通过1未通过" prop="dctype">
        <el-select v-model="queryParams.dctype" placeholder="请选择电池情况0通过1未通过" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          v-hasPermi="['system:reserve:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:reserve:edit']"
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
          v-hasPermi="['system:reserve:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:reserve:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border size='mini' align="center" stripe v-loading="loading" :data="reserveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="预约id" align="center" prop="id" />
      <el-table-column label="预约人id" align="center" prop="yuid" />
      <el-table-column label="预约人名字" align="center" prop="yname" />
      <el-table-column label="预约时间" align="center" prop="addtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="站点id" align="center" prop="sid" />
      <el-table-column label="站点名字" align="center" prop="sname" />
      <el-table-column label="0预约成功1未成功" align="center" prop="istype" />
      <el-table-column label="车牌" align="center" prop="cno" />
      <el-table-column label="换电完成状态0未完成1已完成" align="center" prop="wctype" />
      <el-table-column label="电池情况0通过1未通过" align="center" prop="dctype" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:reserve:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:reserve:remove']"
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

    <!-- 添加或修改预约记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form size='mini' ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="预约人id" prop="yuid">
          <el-input v-model="form.yuid" placeholder="请输入预约人id" />
        </el-form-item>
        <el-form-item label="预约人名字" prop="yname">
          <el-input v-model="form.yname" placeholder="请输入预约人名字" />
        </el-form-item>
        <el-form-item label="预约时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择预约时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="站点id" prop="sid">
          <el-input v-model="form.sid" placeholder="请输入站点id" />
        </el-form-item>
        <el-form-item label="站点名字" prop="sname">
          <el-input v-model="form.sname" placeholder="请输入站点名字" />
        </el-form-item>
        <el-form-item label="0预约成功1未成功" prop="istype">
          <el-select v-model="form.istype" placeholder="请选择0预约成功1未成功">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌" prop="cno">
          <el-input v-model="form.cno" placeholder="请输入车牌" />
        </el-form-item>
        <el-form-item label="换电完成状态0未完成1已完成" prop="wctype">
          <el-select v-model="form.wctype" placeholder="请选择换电完成状态0未完成1已完成">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="电池情况0通过1未通过" prop="dctype">
          <el-select v-model="form.dctype" placeholder="请选择电池情况0通过1未通过">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import { listReserve, getReserve, delReserve, addReserve, updateReserve } from "@/api/app/reserve";

export default {
  name: "Reserve",
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
      // 预约记录表格数据
      reserveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        yuid: null,
        yname: null,
        addtime: null,
        sid: null,
        sname: null,
        istype: null,
        cno: null,
        wctype: null,
        dctype: null,
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
    /** 查询预约记录列表 */
    getList() {
      this.loading = true;
      listReserve(this.queryParams).then(response => {
        this.reserveList = response.rows;
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
        yuid: null,
        yname: null,
        addtime: null,
        sid: null,
        sname: null,
        istype: null,
        cno: null,
        wctype: null,
        dctype: null,
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
      this.title = "添加预约记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReserve(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改预约记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReserve(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReserve(this.form).then(response => {
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
      this.$confirm('是否确认删除预约记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReserve(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/reserve/export', {
        ...this.queryParams
      }, `system_reserve.xlsx`)
    }
  }
};
</script>