<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size='mini'
             :inline="true"
             v-show="showSearch"
             label-width="124px">
      <el-form-item label="登录账号"
                    prop="loginName">
        <el-input v-model="queryParams.loginName"
                  placeholder="请输入登录账号"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户昵称"
                    prop="userName">
        <el-input v-model="queryParams.userName"
                  placeholder="请输入用户昵称"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="用户类型" prop="userType">
        <el-select
          v-model="queryParams.userType"
          placeholder="请选择用户类型"
          clearable
          size="mini"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="用户邮箱"
                    prop="email">
        <el-input v-model="queryParams.email"
                  placeholder="请输入用户邮箱"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码"
                    prop="phonenumber">
        <el-input v-model="queryParams.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="用户性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择用户性别"
          clearable
          size="mini"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="头像路径" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入头像路径"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="盐加密" prop="salt">
        <el-input
          v-model="queryParams.salt"
          placeholder="请输入盐加密"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="帐号状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择帐号状态" clearable size="mini">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="最后登录IP" prop="loginIp">
        <el-input
          v-model="queryParams.loginIp"
          placeholder="请输入最后登录IP"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后登录时间" prop="loginDate">
        <el-date-picker clearable size="mini"
          v-model="queryParams.loginDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择最后登录时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="密码最后更新时间" prop="pwdUpdateDate">
        <el-date-picker clearable size="mini"
          v-model="queryParams.pwdUpdateDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择密码最后更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="微信唯一标识符" prop="openid">
        <el-input
          v-model="queryParams.openid"
          placeholder="请输入微信唯一标识符"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="身份证号" prop="cano">
        <el-input
          v-model="queryParams.cano"
          placeholder="请输入身份证号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证正面" prop="caimg">
        <el-input
          v-model="queryParams.caimg"
          placeholder="请输入身份证正面"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证反面" prop="cfimg">
        <el-input
          v-model="queryParams.cfimg"
          placeholder="请输入身份证反面"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:hexuser:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['system:hexuser:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:hexuser:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:hexuser:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border
              size="mini"
              align="center"
              stripe
              v-loading="loading"
              :data="hexuserList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="用户ID"
                       align="center"
                       prop="userId" />
      <el-table-column label="登录账号"
                       align="center"
                       prop="loginName" />
      <el-table-column label="用户昵称"
                       align="center"
                       prop="userName" />
      <!-- <el-table-column label="用户状态" align="center" prop="sex" style="display:none">
       <template slot-scope="hexuserList">
          <span v-if="hexuserList.row.status==0">通过</span>
          <span v-else-if="hexuserList.row.status==1">不通过</span>
        </template>
        </el-table-column> -->
      <el-table-column label="用户类型"
                       align="center"
                       prop="userType" />
      <el-table-column label="用户邮箱"
                       align="center"
                       prop="email" />
      <el-table-column label="手机号码"
                       align="center"
                       prop="phonenumber" />
      <el-table-column label="用户性别"
                       align="center"
                       prop="sex">
        <template slot-scope="hexuserList">
          <span v-if="hexuserList.row.sex==0">男</span>
          <span v-else-if="hexuserList.row.sex==1">女</span>
          <span v-else-if="hexuserList.row.sex==2">未知</span>
        </template>
      </el-table-column>
      <el-table-column label="头像路径"
                       align="center"
                       prop="avatar">
        <template slot-scope="hexuserList">
          <img :src="hexuserList.row.avatar"
               width="30"
               height="30" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="密码" align="center" prop="password" /> -->
      <!-- <el-table-column label="盐加密" align="center" prop="salt" />
      <el-table-column label="帐号状态" align="center" prop="status" />
      <el-table-column label="最后登录IP" align="center" prop="loginIp" />
      <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码最后更新时间" align="center" prop="pwdUpdateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pwdUpdateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="微信唯一标识符" align="center" prop="openid" />
      <el-table-column label="身份证号" align="center" prop="cano" />
      <el-table-column label="身份证正面" align="center" prop="caimg" />
      <el-table-column label="身份证反面" align="center" prop="cfimg" />-->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:hexuser:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:hexuser:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px"
               append-to-body>
      <el-form size='mini'
               ref="form"
               :model="form"
               :rules="rules"
               label-width="126px">
        <el-form-item label="登录账号"
                      prop="loginName">
          <el-input v-model="form.loginName"
                    placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    v-model="form.password"
                    placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="用户昵称"
                      prop="userName">
          <el-input v-model="form.userName"
                    placeholder="请输入用户昵称" />
        </el-form-item>
        <!-- <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>         -->
        <el-form-item label="用户状态">
          <el-select v-model="form.status"
                     placeholder="请选择">
            <el-option v-for="item in statusList"
                       :key="item.index"
                       :label="item.name"
                       :value="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户邮箱"
                      prop="email">
          <el-input v-model="form.email"
                    placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机号码"
                      prop="phonenumber">
          <el-input v-model="form.phonenumber"
                    placeholder="请输入手机号码" />
        </el-form-item>
        <!-- <el-form-item label="用户性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择用户性别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="用户性别">
          <el-select v-model="form.sex"
                     placeholder="请选择">
            <el-option v-for="dict in sexOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像路径"
                      prop="avatar">
          <el-input v-model="form.avatar"
                    placeholder="请输入头像路径" />
        </el-form-item>

        <!-- <el-form-item label="盐加密" prop="salt">
          <el-input v-model="form.salt" placeholder="请输入盐加密" />
        </el-form-item>
        <el-form-item label="帐号状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="最后登录IP" prop="loginIp">
          <el-input v-model="form.loginIp" placeholder="请输入最后登录IP" />
        </el-form-item>
        <el-form-item label="最后登录时间" prop="loginDate">
          <el-date-picker clearable size="mini"
            v-model="form.loginDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后登录时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="密码最后更新时间" prop="pwdUpdateDate">
          <el-date-picker clearable size="mini"
            v-model="form.pwdUpdateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择密码最后更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="微信唯一标识符" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入微信唯一标识符" />
        </el-form-item> -->
        <el-form-item label="身份证号"
                      prop="cano">
          <el-input v-model="form.cano"
                    placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="身份证正面"
                      prop="caimg">
          <el-input v-model="form.caimg"
                    placeholder="请输入身份证正面" />
        </el-form-item>
        <el-form-item label="身份证反面"
                      prop="cfimg">
          <el-input v-model="form.cfimg"
                    placeholder="请输入身份证反面" />
        </el-form-item>
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
  listHexuser,
  getHexuser,
  delHexuser,
  addHexuser,
  updateHexuser,
} from '@/api/app/hexuser'

export default {
  name: 'Hexuser',
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
      // 用户表格数据
      hexuserList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 性别状态字典
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        loginName: null,
        userName: null,
        userType: null,
        email: null,
        phonenumber: null,
        sex: null,
        avatar: null,
        password: null,
        salt: null,
        status: null,
        loginIp: null,
        loginDate: null,
        pwdUpdateDate: null,
        openid: null,
        cano: null,
        caimg: null,
        cfimg: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        loginName: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' },
        ],
      },
      statusList: [
        {
          //用户状态
          index: 0,
          name: '通过',
        },
        {
          index: 1,
          name: '不通过',
        },
      ],
    }
  },
  created() {
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
    })
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listHexuser(this.queryParams).then((response) => {
        this.hexuserList = response.rows
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
        userId: null,
        loginName: null,
        userName: null,
        userType: null,
        email: null,
        phonenumber: null,
        sex: null,
        avatar: null,
        password: null,
        salt: null,
        status: null,
        delFlag: null,
        loginIp: null,
        loginDate: null,
        pwdUpdateDate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        openid: null,
        cano: null,
        caimg: null,
        cfimg: null,
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
      this.ids = selection.map((item) => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const userId = row.userId || this.ids
      getHexuser(userId).then((response) => {
        console.log('response', response)
        this.form = response.data
        this.open = true
        this.title = '修改用户'
        console.log(response)
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.userId != null) {
            updateHexuser(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addHexuser(this.form).then((response) => {
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
      const userIds = row.userId || this.ids
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delHexuser(userIds)
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
        'system/hexuser/export',
        {
          ...this.queryParams,
        },
        `system_hexuser.xlsx`
      )
    },
  },
}
</script>
