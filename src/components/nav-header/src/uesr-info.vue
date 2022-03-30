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
          <el-dropdown-item>
            <el-icon><chat-line-round /></el-icon>
            用户信息
          </el-dropdown-item>
          <el-dropdown-item divided>
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
export default defineComponent({
  setup() {
    const store = useStore()
    const name = computed(() => store.state.login.userInfo.data.name)
    return { name }
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
