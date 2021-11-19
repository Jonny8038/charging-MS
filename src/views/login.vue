<template>
  <div class="login">
    <div class="tit">智能网联换电运营管理系统</div>
    <div class="content">
      <div class="top">
        <h3 class="title">用户登录</h3>
      </div>
      <div class="con">
        <div class="conle"></div>

        <div class="conri">
          <el-form ref="loginForm" 
                   :model="loginForm"
                   :rules="loginRules"
                   class="login-form">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username"
                        type="text"
                        auto-complete="off"
                        placeholder="账号">
                <svg-icon slot="prefix"
                          icon-class="user"
                          class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password"
                        type="password"
                        auto-complete="off"
                        placeholder="密码"
                        @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix"
                          icon-class="password"
                          class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="loginForm.code"
                        auto-complete="off"
                        placeholder="验证码"
                        style="width: 63%"
                        @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix"
                          icon-class="validCode"
                          class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl"
                     @click="getCode"
                     class="login-code-img" />
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe"
                         style="margin: 25px 0px 0px 0px">记住密码</el-checkbox>
            <el-form-item style="width: 100%">
              <el-button :loading="loading"
                         size="medium"
                         type="primary"
                         style="width: 100%"
                         @click.native.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 huandian.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
        ],
        code: [
          { required: true, trigger: 'change', message: '验证码不能为空' },
        ],
      },
      loading: false,
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = 'data:image/gif;base64,' + res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30,
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.png');
  background-size: cover;
  .tit {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }
  .content {
    margin: 0 auto;
    margin-top: 4%;
    width: 950px;
    height: 526px;
    background: url('../assets/images/dlbj.png') no-repeat center center;
    background-size: 100%;
  }
  .title {
    margin: 0 auto;
    margin-top: 3px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    color: #2fd5ff;
    text-align: center;
  }
  .conri {
    float: right;
    margin-right: 65px;
    margin-top: 40px;
    width: 380px;
  }
  .login-form {
    width: 380px;
  }
  .el-form-item {
    margin-top: 25px;
    margin-bottom: 0;
  }
  .el-input {
    height: 40px;
    background: #0944a3;
    border: 1px solid #0083c7;
  }
  .el-input--medium .el-input__inner {
    padding-left: 60px;
    height: 40px;
    line-height: 40px;
    background: none;
    color: #fff;
    border: 0;
  }
  .el-input__prefix {
    width: 38px;
    height: 38px;
    line-height: 38px;
    font-size: 28px;
    background: #0579bf;
    left: 0px;
  }
  .input-icon {
    font-size: 28px;
    color: #fff;
  }

  .el-button--primary {
    height: 40px;
    font-size: 20px;
    color: #fff;
    background: #0091dc;
    padding: 0;
    border-radius: 0;
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 40px;
    line-height: 40px;
    float: right;
    img {
      width: 100%;
      height: 40px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .login-code-img {
    height: 38px;
  }
}
</style>
