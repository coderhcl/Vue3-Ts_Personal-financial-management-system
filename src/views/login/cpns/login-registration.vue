<template>
  <div class="login-registration">
    <el-form
      label-width="80px"
      :rules="rules"
      :model="registration"
      ref="RegifromRef"
    >
      <el-form-item label="账号" prop="name">
        <el-input v-model="registration.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="registration.password"
          show-password
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="phone" v-model="registration.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="registration.email" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import { rules } from "../config/account-registration"
import { ElForm } from "element-plus"
import { useStore } from "vuex"

export default defineComponent({
  setup() {
    const registration = reactive({
      name: "",
      password: "",
      phone: "",
      email: ""
    })
    const RegifromRef = ref<InstanceType<typeof ElForm>>()
    const store = useStore()
    const registrationAction = () => {
      RegifromRef.value?.validate((valid) => {
        if (valid) {
          store.dispatch("login/accountRegiAction", { ...registration })
        }
      })
    }
    return {
      registration,
      rules,
      registrationAction,
      RegifromRef
    }
  }
})
</script>

<style scoped></style>
