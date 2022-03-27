<template>
  <div class="login-account">
    <el-form label-width="60px" :rules="rules" :model="account" ref="fromRef">
      <el-form-item label="账号" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="account.password" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElForm } from "element-plus"
import { defineComponent, reactive, ref } from "vue"
import { rules } from "../config/account-config"
import localCache from "../../../utils/cache"
import { useStore } from "vuex"

export default defineComponent({
  setup() {
    const account = reactive({
      name: localCache.getCache("name") || "",
      password: localCache.getCache("password") || ""
    })

    const fromRef = ref<InstanceType<typeof ElForm>>()
    const store = useStore()

    const loginAction = (isKeepPassword: boolean) => {
      // 1验证表单是否通过
      fromRef.value?.validate((valid) => {
        if (valid) {
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
      rules,
      loginAction,
      fromRef
    }
  }
})
</script>

<style scoped></style>
