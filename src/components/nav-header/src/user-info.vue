<template>
  <div class="content">
    <div class="user">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar v-if="srcIcon" :size="30" :src="srcIcon"></el-avatar>
          <el-avatar v-else :size="30">{{ name }}</el-avatar>
          {{ name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUserMessageClick">
              <el-icon><chat-line-round /></el-icon>
              用户信息
            </el-dropdown-item>
            <el-dropdown-item @click="changePassword" divided>
              <el-icon><set-up /></el-icon>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="handleUserExitClick" divided>
              <el-icon><circle-close /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 修改密码提示框 -->
    <el-dialog v-model="passwordFormVisible" title="请输入新密码" :width="400">
      <el-form :model="form" :rules="passwordRules" ref="passwordForm">
        <el-form-item label="新密码" prop="password" :label-width="100">
          <el-input v-model="form.password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          :label-width="100"
        >
          <el-input
            v-model="form.confirmPassword"
            autocomplete="off"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordFormVisible = false">取消</el-button>
          <el-button type="primary" @click="changePasswordConfirm"
            >修改</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { useStore } from "vuex"
import localCache from "@/utils/cache"
import router from "@/router"
import { ElForm, ElMessageBox, ElNotification } from "element-plus"
import { passwordRules } from "./config/rules"
import { checkPassword } from "@/service/login/forgetPassword"
export default defineComponent({
  setup() {
    const store = useStore()
    // const id: string = store.state.login.userInfo.data._id
    const name = computed(() => store.state.login.userInfo.data.name)
    let srcIcon: any = ""
    if (store.state.message.userList.icon) {
      srcIcon = computed(() => store.state.message.userList.icon)
    } else {
      srcIcon = store.state.login.userInfo.data.user.icon
    }
    // console.log(srcIcon)
    // 退出登录
    const handleUserExitClick = () => {
      ElMessageBox.confirm("确定退出？", "是否退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ElNotification({
            title: "退出成功",
            type: "success",
            message: "欢迎再次使用！"
          })

          localCache.deleteCache("userInfo")
          localCache.deleteCache("userMenus")
          localCache.deleteCache("token")
          localCache.deleteCache("notice")
          localCache.deleteCache("changeUser")
          router.push("/login")
        })
        .catch(() => {
          ElNotification({
            title: "Info",
            type: "info",
            message: "退出已取消！"
          })
        })
    }
    const handleUserMessageClick = () => {
      router.push("/main/message/person")
    }

    const form = ref({
      id: "",
      password: "",
      confirmPassword: ""
    })
    const passwordForm = ref<InstanceType<typeof ElForm>>()
    const passwordFormVisible = ref(false)
    const changePassword = () => {
      passwordFormVisible.value = true
    }
    const changePasswordConfirm = () => {
      passwordForm.value?.validate(async (validate) => {
        if (validate) {
          if (form.value.password !== form.value.confirmPassword) {
            ElNotification({
              title: "操作失败",
              message: "两次密码不一致",
              type: "warning"
            })
            return
          }
          form.value.id = store.state.login.userInfo.data._id
          const result = await checkPassword({ ...form.value })
          if (result.code > 0) {
            localCache.deleteCache("userInfo")
            localCache.deleteCache("userMenus")
            localCache.deleteCache("token")
            localCache.deleteCache("name")
            localCache.deleteCache("password")
            localCache.deleteCache("notice")
            router.push("/login")
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
          } else {
            ElNotification({
              title: "Warning",
              message: result.data.message,
              type: "warning"
            })
          }
        }
      })
    }
    return {
      name,
      srcIcon,
      handleUserExitClick,
      handleUserMessageClick,
      changePassword,
      passwordFormVisible,
      form,
      passwordRules,
      passwordForm,
      changePasswordConfirm
    }
  }
})
</script>

<style scoped lang="less">
.el-dropdown-link {
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  .el-avatar {
    font-size: 1px;
    margin-right: 5px;
    // background-color: darkgray;
    // color: white;
  }
}
</style>
