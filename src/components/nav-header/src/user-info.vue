<template>
  <div>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :size="30">{{ name }}</el-avatar>
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
          <el-dropdown-item @click="handleUserExitClick" divided>
            <el-icon><circle-close /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
import localCache from "@/utils/cache"
import router from "@/router"
import { ElMessage, ElMessageBox } from "element-plus"
export default defineComponent({
  setup() {
    const store = useStore()
    const name = computed(() => store.state.login.userInfo.data.name)
    const handleUserExitClick = () => {
      ElMessageBox.confirm("确定退出？", "是否退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "退出成功！欢迎再次使用"
          })
          localCache.clearCache()
          router.push("/login")
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "退出已取消！"
          })
        })

      console.log("退出")
    }
    const handleUserMessageClick = () => {
      console.log("xingx")
    }
    return { name, handleUserExitClick, handleUserMessageClick }
  }
})
</script>

<style scoped lang="less">
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  .el-avatar {
    font-size: 1px;
    margin-right: 5px;
    background-color: darkgray;
    color: white;
  }
}
</style>
