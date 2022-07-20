<template>
  <div class="login-panel">
    <h2 class="title">个人财务管理系统</h2>
    <el-tabs type="border-card" stretch>
      <el-tab-pane>
        <template #label>
          <span class="login-tab" @click="controlShow">
            <el-icon><Avatar /></el-icon>
            <span>账号登录</span>
          </span>
        </template>
        <login-account ref="accountRef" />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="registration-tab" @click="controlNoShow">
            <el-icon><EditPen /></el-icon>
            <span>注册账号</span>
          </span>
        </template>
        <login-registration ref="registrationRef" />
      </el-tab-pane>
    </el-tabs>
    <div v-if="isShowControl" class="account-control">
      <el-checkbox size="small" v-model="isKeepPassword">记住密码</el-checkbox>
      <el-button type="text" @click="dialogFormVisible = true"
        >忘记密码</el-button
      >
      <el-dialog v-model="dialogFormVisible" title="找回密码" width="400px">
        <el-form :model="getPasswordForm" :rules="numberRules">
          <el-form-item label="请输入用户名:" label-width="140px" prop="name">
            <el-input v-model="getPasswordForm.name" />
          </el-form-item>
          <el-form-item
            label="请输入注册手机号:"
            label-width="140px"
            prop="phone"
          >
            <el-input v-model="getPasswordForm.phone" />
          </el-form-item>
          <el-form-item
            label="请输入注册邮箱:"
            label-width="140px"
            prop="email"
          >
            <el-input v-model="getPasswordForm.email" />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="checkForm()">确认</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="checkFormVisible" title="更改密码" width="400px">
        <el-form :model="checkPasswordForm" :rules="passwordRules">
          <el-form-item
            label="请输入新密码:"
            label-width="140px"
            prop="password"
          >
            <el-input v-model="checkPasswordForm.password" show-password />
          </el-form-item>
          <el-form-item
            label="请确认密码:"
            label-width="140px"
            prop="confirmPassword"
          >
            <el-input
              v-model="checkPasswordForm.confirmPassword"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmPasswordClick"
              >提交</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-if="isShowControl">
      <el-button type="primary" class="loginBtn" @click="handleLoginClick">
        立即登录
      </el-button>
    </div>
    <div v-else>
      <el-button
        type="primary"
        class="registrationBtn"
        @click="handleRegistrationClick"
      >
        注册并登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import LoginAccount from "./login-account.vue"
import LoginRegistration from "./login-registration.vue"
import { numberRules, passwordRules } from "../config/forget-password-config"
import {
  checkPassword,
  forgetPassword
} from "../../../service/login/forgetPassword"
import { ElMessage, ElNotification } from "element-plus"

export default defineComponent({
  components: { LoginAccount, LoginRegistration },
  setup() {
    const isKeepPassword = ref(true)
    // 注册不展示记住密码
    const isShowControl = ref(true)
    const controlNoShow = (): void => {
      isShowControl.value = false
    }
    const controlShow = (): void => {
      isShowControl.value = true
    }
    // 登录相关操作
    const accountRef = ref<InstanceType<typeof LoginAccount>>()
    const handleLoginClick = () => {
      accountRef.value?.loginAction(isKeepPassword.value)
    }
    // 注册相关操作
    const registrationRef = ref<InstanceType<typeof LoginRegistration>>()
    const handleRegistrationClick = () => {
      registrationRef.value?.registrationAction()
    }

    // 忘记密码-找回密码
    const getPasswordForm = reactive({
      name: "",
      phone: "",
      email: "",
      id: ""
    })

    const checkPasswordForm = reactive({
      password: "",
      confirmPassword: "",
      id: ""
    })
    const dialogFormVisible = ref(false)
    const checkFormVisible = ref(false)

    // 校验用户名和手机号和邮箱
    const checkForm = async () => {
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
      } else {
        ElMessage({
          showClose: true,
          message: result.data.message,
          type: "warning"
        })
      }
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
        ElMessage({
          showClose: true,
          message: "两次密码不相同",
          type: "warning"
        })
      }
    }

    return {
      isKeepPassword,
      isShowControl,
      controlNoShow,
      controlShow,
      handleLoginClick,
      handleRegistrationClick,
      accountRef,
      registrationRef,
      checkForm,
      getPasswordForm,
      dialogFormVisible,
      numberRules,
      passwordRules,
      forgetPassword,
      checkFormVisible,
      checkPasswordForm,
      confirmPasswordClick
    }
  }
})
</script>

<style scoped lang="less">
.login-panel {
  margin-bottom: 120px;
  width: 320px;
  .title {
    text-align: center;
  }
  .login-tab .el-icon {
    vertical-align: middle;
  }
  .login-tab span {
    vertical-align: middle;
    margin-left: 4px;
  }
  .registration-tab .el-icon {
    vertical-align: middle;
  }
  .registration-tab span {
    vertical-align: middle;
    margin-left: 4px;
  }
  .account-control {
    display: flex;
    justify-content: space-between;
    .el-button {
      font-size: 12px;
      height: 0;
      margin-top: 4px;
    }
    .dialog-footer .el-button {
      margin-top: 0px;
      height: 30px;
    }
  }
  .loginBtn,
  .registrationBtn {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
