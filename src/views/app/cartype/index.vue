<template>
  <div class="app-container">
    <el-form size='mini'
             :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
<!--      <el-form-item label="父id"-->
<!--                    prop="pid">-->
<!--        <el-input v-model="queryParams.pid"-->
<!--                  placeholder="请输入父id"-->
<!--                  clearable-->
<!--                  size="mini"-->
<!--                  @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="祖级列表"-->
<!--                    prop="ancestors">-->
<!--        <el-input v-model="queryParams.ancestors"-->
<!--                  placeholder="请输入祖级列表"-->
<!--                  clearable-->
<!--                  size="mini"-->
<!--                  @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
      <el-form-item label="车辆型号"
                    prop="name">
        <el-input v-model="queryParams.name"
                  placeholder="请输入名称"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
<!--      <el-form-item label="显示顺序"-->
<!--                    prop="orderNum">-->
<!--        <el-input v-model="queryParams.orderNum"-->
<!--                  placeholder="请输入显示顺序"-->
<!--                  clearable-->
<!--                  size="mini"-->
<!--                  @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="负责人"-->
<!--                    prop="leader">-->
<!--        <el-input v-model="queryParams.leader"-->
<!--                  placeholder="请输入负责人"-->
<!--                  clearable-->
<!--                  size="mini"-->
<!--                  @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="联系电话"-->
<!--                    prop="phone">-->
<!--        <el-input v-model="queryParams.phone"-->
<!--                  placeholder="请输入联系电话"-->
<!--                  clearable-->
<!--                  size="mini"-->
<!--                  @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="状态"-->
<!--                    prop="status">-->
<!--        <el-select v-model="queryParams.status"-->
<!--                   placeholder="请选择状态"-->
<!--                   clearable-->
<!--                   size="mini">-->
<!--          <el-option label="请选择字典生成"-->
<!--                     value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:cartype:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['system:cartype:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:cartype:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:cartype:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table text-align="center"
              size="mini"
              stripe
              border
              v-loading="loading"
              :data="cartypeList"
              row-key="pid"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column type="index"  label="序号" align="center" />
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
<!--      <el-table-column label="父id" align="center" prop="pid" />-->
<!--      <el-table-column label="祖级列表" align="center" prop="ancestors" />-->
      <el-table-column label="车辆型号" align="center" prop="name" />
<!--      <el-table-column label="显示顺序" align="center" prop="orderNum" />-->
<!--      <el-table-column label="负责人" align="center" prop="leader" />-->
<!--      <el-table-column label="联系电话" align="center" prop="phone" />-->
<!--      <el-table-column label="状态" align="center" prop="status" />-->
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:cartype:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:cartype:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改车型对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               :close-on-click-modal="false"
               append-to-body>
      <el-form size='mini'
               ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
<!--        <el-form-item label="父id"-->
<!--                      prop="pid">-->
<!--          <el-input v-model="form.pid"-->
<!--                    placeholder="请输入父id" />-->
<!--        </el-form-item>-->
        <el-form-item label="车辆型号"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="请输入名称" />
        </el-form-item>
<!--        <el-form-item label="显示顺序"-->
<!--                      prop="orderNum">-->
<!--          <el-input v-model="form.orderNum"-->
<!--                    placeholder="请输入显示顺序" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="负责人"-->
<!--                      prop="leader">-->
<!--          <el-input v-model="form.leader"-->
<!--                    placeholder="请输入负责人" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="联系电话"-->
<!--                      prop="phone">-->
<!--          <el-input v-model="form.phone"-->
<!--                    placeholder="请输入联系电话" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态">-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio label="1">请选择字典生成</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="删除标志"-->
<!--                      prop="delFlag">-->
<!--          <el-input v-model="form.delFlag"-->
<!--                    placeholder="请输入删除标志" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCartype,
  getCartype,
  delCartype,
  addCartype,
  updateCartype,
} from '@/api/app/cartype'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Cartype',
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
      // 车型表格数据
      cartypeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pid: null,
        ancestors: null,
        name: null,
        orderNum: null,
        leader: null,
        phone: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询车型列表 */
    getList() {
      this.loading = true
      listCartype(this.queryParams).then((response) => {
        this.cartypeList = response.rows
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
        pid: null,
        ancestors: null,
        name: null,
        orderNum: null,
        leader: null,
        phone: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.title = '添加车型'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getCartype(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改车型'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCartype(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCartype(this.form).then((response) => {
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
      this.$confirm('是否确认删除车型编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delCartype(ids)
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
        'system/cartype/export',
        {
          ...this.queryParams,
        },
        `system_cartype.xlsx`
      )
    },
  },
}
</script>
