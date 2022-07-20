<template>
  <div class="login-account">
    <el-form :rules="loginRules" :model="account" ref="fromRef">
      <el-form-item prop="name">
        <el-input v-model="account.name" placeholder="请输入账号">
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model="account.password"
          placeholder="请输入密码"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="valid">
        <el-input v-model="account.validCode" placeholder="请输入验证码">
          <template #prefix>
            <el-icon class="el-input__icon"><key /></el-icon>
          </template>
        </el-input>
        <valid-code @input="createValidCode" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElForm, ElNotification } from "element-plus"
import { defineComponent, reactive, ref } from "vue"
import { loginRules } from "../config/login-config"
import localCache from "../../../utils/cache"
import { useStore } from "vuex"
import ValidCode from "./ValidCode.vue"
export default defineComponent({
  components: { ValidCode },
  setup() {
    const account = reactive({
      name: localCache.getCache("name") || "",
      password: localCache.getCache("password") || "",
      validCode: ""
    })
    const toValidCode = ref("")
    const createValidCode = (data: any) => {
      toValidCode.value = data
    }
    const fromRef = ref<InstanceType<typeof ElForm>>()
    const store = useStore()

    const loginAction = (isKeepPassword: boolean) => {
      // 1验证表单是否通过
      fromRef.value?.validate((valid) => {
        if (valid) {
          if (!account.validCode) {
            ElNotification({
              title: "Warning",
              message: "请输入验证码",
              type: "warning"
            })
            return
          }
          if (
            account.validCode.toLowerCase() !== toValidCode.value.toLowerCase()
          ) {
            ElNotification({
              title: "Warning",
              message: "验证码错误",
              type: "warning"
            })
            return
          }
          // 是否需要记住密码
          if (isKeepPassword) {
            // 保存账号密码到本地
            localCache.setCache("name", account.name)
            localCache.setCache("password", account.password)
          } else {
            localCache.deleteCache("name")
            localCache.deleteCache("password")
          }
          // 2开始登录验证
          store.dispatch("login/accountLoginAction", { ...account })
        }
      })
    }
    return {
      account,
      loginRules,
      loginAction,
      fromRef,
      createValidCode,
      toValidCode
    }
  }
})
</script>

<style scoped lang="less">
.login-account {
  .valid {
    width: 100%;
    display: flex;
    .el-input {
      width: 60%;
      margin-right: 5px;
    }
  }
}
</style>
