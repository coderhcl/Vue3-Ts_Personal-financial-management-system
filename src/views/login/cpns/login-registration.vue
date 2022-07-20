<template>
  <div class="login-registration">
    <el-form :rules="registerRules" :model="registration" ref="RegifromRef">
      <el-form-item prop="name">
        <el-input v-model="registration.name" placeholder="请输入账号">
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="registration.password"
          show-password
          placeholder="请输入密码"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          type="phone"
          v-model="registration.phone"
          placeholder="请输入手机号码"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><phone /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          type="email"
          v-model="registration.email"
          placeholder="请输入邮箱"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="emailcode">
        <el-input v-model="registration.code" placeholder="请输入邮箱验证码">
          <template #prefix>
            <el-icon class="el-input__icon"><key /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="sendCode">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import { registerRules } from "../config/registration-config"
import { ElForm, ElNotification } from "element-plus"
import { useStore } from "vuex"
import { sendCodeApi } from "@/service/login/registration"

export default defineComponent({
  setup() {
    const registration = reactive({
      name: "",
      password: "",
      email: "",
      phone: "",
      code: ""
    })
    const sendCode = async () => {
      const result = await sendCodeApi({
        email: registration.email,
        code: parseInt(registration.code)
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
          message: "邮件已发送，请稍后",
          type: "success"
        })
      }
    }
    const RegifromRef = ref<InstanceType<typeof ElForm>>()
    const store = useStore()
    const registrationAction = () => {
      RegifromRef.value?.validate((valid) => {
        if (valid) {
          if (!registration.code) {
            ElNotification({
              title: "Warning",
              message: "请输入验证码",
              type: "warning"
            })
            return
          }
          store.dispatch("login/accountRegiAction", { ...registration })
        }
      })
    }
    return {
      registration,
      registerRules,
      registrationAction,
      RegifromRef,
      sendCode
    }
  }
})
</script>

<style scoped lang="less">
.emailcode {
  display: flex;
  .el-input {
    width: 55%;
    margin-right: 30px;
  }
}
</style>
