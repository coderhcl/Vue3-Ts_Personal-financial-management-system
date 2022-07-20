<template>
  <div class="login-register">
    <!-- <transition
      enter-active-class="animate__animated animate__fadeInDownBig"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <span class="top-title">个人财务管理系统</span>
    </transition> -->
    <span class="top-title">个人财务管理系统</span>
    <div class="contain">
      <div class="big-box" :class="{ active: isLogin }">
        <div class="big-contain" v-if="isLogin">
          <div class="title">账户登录</div>
          <el-form :rules="loginRules" :model="loginForm" ref="fromRef">
            <el-form-item prop="name">
              <el-input v-model="loginForm.name" placeholder="账号">
                <template #prefix>
                  <el-icon class="el-input__icon"><user /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                show-password
                v-model="loginForm.password"
                placeholder="密码"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="validCode" class="valid">
              <el-input v-model="loginForm.validCode" placeholder="验证码">
                <template #prefix>
                  <el-icon class="el-input__icon"><key /></el-icon>
                </template>
              </el-input>
              <valid-code @input="createValidCode" />
            </el-form-item>
          </el-form>
          <div class="handlePass">
            <el-checkbox size="small" v-model="isKeepPassword">
              记住密码
            </el-checkbox>
            <el-button type="text" @click="dialogFormVisible = true">
              忘记密码
            </el-button>
          </div>

          <el-button class="loginButton" @click="login">登录</el-button>
        </div>
        <div class="big-contain" v-else>
          <div class="title">创建账户</div>
          <el-form
            :model="registerForm"
            :rules="registerRules"
            ref="registerFromRef"
          >
            <el-form-item prop="name">
              <el-input v-model="registerForm.name" placeholder="账号">
                <template #prefix>
                  <el-icon class="el-input__icon"><user /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerForm.password"
                show-password
                placeholder="密码"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input
                type="phone"
                v-model="registerForm.phone"
                placeholder="手机号码"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                type="email"
                v-model="registerForm.email"
                placeholder="邮箱"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><message /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" class="emailcode">
              <el-input v-model="registerForm.code" placeholder="邮箱验证码">
                <template #prefix>
                  <el-icon class="el-input__icon"><key /></el-icon>
                </template>
              </el-input>
              <el-button
                @click="handelRegisterSendCode"
                :icon="Promotion"
                :disabled="registerNotClick"
              >
                {{ btnText }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button class="registerButton" @click="register">注册</el-button>
        </div>
      </div>
      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" v-if="isLogin">
          <div class="stitle">你好，朋友!</div>
          <p class="scontent">开始注册，和我们一起旅行</p>
          <button class="sbutton" @click="changeType">注册</button>
        </div>
        <div class="small-contain" v-else>
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
          <button class="sbutton" @click="changeType">登录</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 找回密码 -->
  <el-dialog v-model="dialogFormVisible" title="找回密码" width="350px">
    <el-form
      :model="getPasswordForm"
      :rules="numberRules"
      ref="getPasswordFormRef"
    >
      <el-form-item prop="name">
        <el-input v-model="getPasswordForm.name" placeholder="请输入用户名:">
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          type="phone"
          v-model="getPasswordForm.phone"
          placeholder="请输入注册手机号:"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><phone /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          type="email"
          v-model="getPasswordForm.email"
          placeholder="请输入注册邮箱:"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="emailcode">
        <el-input v-model="getPasswordForm.code" placeholder="邮箱验证码">
          <template #prefix>
            <el-icon class="el-input__icon"><key /></el-icon>
          </template>
        </el-input>
        <el-button
          @click="handleGetPasswordSendCode"
          :icon="Promotion"
          :disabled="getPasswordNotClick"
        >
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="checkForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码 -->
  <el-dialog v-model="checkFormVisible" title="更改密码" width="350px">
    <el-form :model="checkPasswordForm" :rules="passwordRules">
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="checkPasswordForm.password"
          show-password
          placeholder="请输入新密码:"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          type="password"
          v-model="checkPasswordForm.confirmPassword"
          show-password
          placeholder="确认密码:"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPasswordClick">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import { Promotion } from "@element-plus/icons-vue"
import ValidCode from "./cpns/ValidCode.vue"
import localCache from "@/utils/cache"
import { useStore } from "vuex"
import { ElForm, ElNotification } from "element-plus"
import { loginRules } from "./config/login-config"
import { registerRules } from "./config/registration-config"
import { sendCodeApi } from "@/service/login/registration"

import { numberRules, passwordRules } from "./config/forget-password-config"
import { checkPassword, forgetPassword } from "@/service/login/forgetPassword"

export default defineComponent({
  components: { ValidCode },
  setup() {
    const isLogin = ref(true)
    // 改变页面
    const changeType = () => {
      isLogin.value = !isLogin.value
    }
    // 发送验证码按钮文字以及是否可以点击
    const registerNotClick = ref(false)
    const getPasswordNotClick = ref(false)
    const btnText = ref("发送")
    const timer = ref()
    // 登录
    const loginForm = ref({
      name: localCache.getCache("name") || "",
      password: localCache.getCache("password") || "",
      validCode: ""
    })
    const isKeepPassword = ref(true)

    const toValidCode = ref("")
    const createValidCode = (data: any) => {
      toValidCode.value = data
    }
    const fromRef = ref<InstanceType<typeof ElForm>>()
    const store = useStore()
    // 登录
    const login = () => {
      // 1验证表单是否通过
      fromRef.value?.validate((valid) => {
        if (valid) {
          if (
            loginForm.value.validCode.toLowerCase() !==
            toValidCode.value.toLowerCase()
          ) {
            ElNotification({
              title: "Warning",
              message: "验证码错误",
              type: "warning"
            })
            return
          }
          // 是否需要记住密码
          if (isKeepPassword.value) {
            // 保存账号密码到本地
            localCache.setCache("name", loginForm.value.name)
            localCache.setCache("password", loginForm.value.password)
          } else {
            localCache.deleteCache("name")
            localCache.deleteCache("password")
          }
          // 2开始登录验证
          store.dispatch("login/accountLoginAction", { ...loginForm.value })
        }
      })
    }
    // 忘记密码
    const dialogFormVisible = ref(false)
    const checkFormVisible = ref(false)

    // 忘记密码-找回密码表单
    const getPasswordForm = reactive({
      name: "",
      phone: "",
      email: "",
      id: "",
      code: ""
    })

    const handleGetPasswordSendCode = () => {
      if (
        getPasswordForm.email &&
        getPasswordForm.name &&
        getPasswordForm.phone
      ) {
        getPasswordSendCode()
      } else {
        ElNotification({
          title: "无相关信息",
          message: "请输入账号、邮箱等信息",
          type: "warning"
        })
      }
    }
    // 找回密码中的发送邮件
    const getPasswordSendCode = async () => {
      const result = await sendCodeApi({
        email: getPasswordForm.email,
        code: parseInt(getPasswordForm.code)
      })
      if (result.code < 0) {
        ElNotification({
          title: "Warning",
          message: "邮箱已注册",
          type: "warning"
        })
        return
      } else {
        ElNotification({
          title: "Success",
          message: "邮件已发送!请稍后",
          type: "success"
        })
        getPasswordCountDown(60)
      }
    }
    // 修改密码表单
    const checkPasswordForm = reactive({
      password: "",
      confirmPassword: "",
      id: ""
    })
    // 校验用户名和手机号和邮箱
    const getPasswordFormRef = ref<InstanceType<typeof ElForm>>()
    const checkForm = async () => {
      getPasswordFormRef.value?.validate(async (valid) => {
        if (valid) {
          const result = await forgetPassword(getPasswordForm)
          if (result.code > 0) {
            dialogFormVisible.value = false
            checkFormVisible.value = true
            ElNotification({
              title: "验证成功",
              message: result.data.message,
              type: "success"
            })
            checkPasswordForm.id = result.data.id
            getPasswordForm.name = ""
            getPasswordForm.phone = ""
            getPasswordForm.email = ""
            getPasswordForm.code = ""
          } else {
            ElNotification({
              showClose: true,
              message: result.data.message,
              type: "warning"
            })
          }
        }
      })
    }
    // 修改密码
    const confirmPasswordClick = async () => {
      if (
        checkPasswordForm.password == checkPasswordForm.confirmPassword &&
        checkPasswordForm.password != "" &&
        checkPasswordForm.confirmPassword != ""
      ) {
        // 使用id查找对应用户并修改密码
        const result = await checkPassword(checkPasswordForm)
        if (result.code > 0) {
          ElNotification({
            title: "修改密码成功",
            message: result.data.message,
            type: "success"
          })
          // 关闭对话框
          checkFormVisible.value = false
        }
      } else {
        ElNotification({
          title: "Warning",
          message: "两次密码不相同",
          type: "warning"
        })
      }
    }
    // ##########################注册###############################
    // 注册表单数据
    const registerForm = reactive({
      name: "",
      password: "",
      email: "",
      phone: "",
      code: ""
    })
    // 发送验证码
    const handelRegisterSendCode = () => {
      if (registerForm.email && registerForm.name && registerForm.phone) {
        registerSendCode()
      } else {
        ElNotification({
          title: "无相关信息",
          message: "请输入账号、邮箱等信息",
          type: "warning"
        })
      }
    }
    const registerSendCode = async () => {
      const result = await sendCodeApi({
        email: registerForm.email,
        code: parseInt(registerForm.code)
      })
      if (result.code < 0) {
        ElNotification({
          title: "Warning",
          message: "邮箱已注册",
          type: "warning"
        })
        return
      } else {
        ElNotification({
          title: "Success",
          message: "邮件已发送!请稍后",
          type: "success"
        })
        registerCountDown(60)
      }
    }
    const registerFromRef = ref<InstanceType<typeof ElForm>>()
    //  注册
    const register = () => {
      registerFromRef.value?.validate((valid) => {
        if (valid) {
          store.dispatch("login/accountRegiAction", { ...registerForm })
        }
      })
    }

    // 等待时间
    const registerCountDown = (time: number) => {
      if (timer.value) {
        clearInterval(timer.value)
      }
      registerNotClick.value = true
      let tim = time
      timer.value = setInterval(() => {
        tim--
        if (tim === 0) {
          clearInterval(timer.value)
          registerNotClick.value = false
          btnText.value = "发送"
        } else {
          btnText.value = `${tim}S`
        }
      }, 1000)
    }
    const getPasswordCountDown = (time: number) => {
      if (timer.value) {
        clearInterval(timer.value)
      }
      getPasswordNotClick.value = true
      let tim = time
      timer.value = setInterval(() => {
        tim--
        if (tim === 0) {
          clearInterval(timer.value)
          getPasswordNotClick.value = false
          btnText.value = "发送"
        } else {
          btnText.value = `${tim}S`
        }
      }, 1000)
    }
    // 清除时间
    // const clearCountDown = () => {
    //   btnText.value = "更改"
    //   notClick.value = false
    //   clearInterval(timer.value)
    // }
    return {
      Promotion,
      isLogin,
      changeType,
      login,
      register,
      loginForm,
      registerForm,
      toValidCode,
      createValidCode,
      fromRef,
      isKeepPassword,
      loginRules,
      dialogFormVisible,
      checkFormVisible,
      numberRules,
      passwordRules,
      getPasswordForm,
      handleGetPasswordSendCode,
      getPasswordSendCode,
      registerRules,
      handelRegisterSendCode,
      registerFromRef,
      checkForm,
      checkPasswordForm,
      confirmPasswordClick,
      registerNotClick,
      getPasswordNotClick,
      btnText,
      registerCountDown,
      getPasswordCountDown,
      registerSendCode,
      getPasswordFormRef
    }
  }
})
</script>

<style scoped lang="less">
.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  .top-title {
    width: 100%;
    font-size: 30px;
    position: relative;
    top: 15%;
    left: 42%;
    transform: translate(-50%, -50%);
    color: #39a7b0;
  }
}
.contain {
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
}
.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}
.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-input {
    width: 280px;
  }
  .valid {
    display: flex;
    .el-input {
      width: 50%;
      margin-right: 15px;
    }
  }
  .handlePass {
    display: flex;
    width: 280px;
    height: 30px;
    justify-content: space-between;
    margin-bottom: 15px;
    .el-checkbox {
      color: #39a7b0;
    }
    .el-button {
      font-size: 12px;
      margin-right: 30px;
      height: 0;
      color: #39a7b0;
    }
  }
}
.title {
  font-size: 1.5em;
  font-weight: bold;
  color: rgb(57, 167, 176);
  margin-bottom: 20px;
}
.el-form-item {
  margin-top: 20px;
}
.emailcode {
  display: flex;
  .el-input {
    margin-right: 22px;
    width: 60%;
  }
  .el-button {
    width: 25%;
    background-color: rgb(57, 167, 176);
    color: #ffffff;
  }
}

.loginButton,
.registerButton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}
.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}
.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
}
.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}
.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.big-box.active {
  left: 0;
  transition: all 0.5s;
}
.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}
</style>
//
