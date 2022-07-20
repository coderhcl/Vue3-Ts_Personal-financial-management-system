<template>
  <!-- Fold  <el-icon><expand /></el-icon>-->
  <div class="nav-header">
    <div @click="handleFoldClick">
      <el-icon v-if="isFold"><expand /></el-icon>
      <el-icon v-else><fold /></el-icon>
    </div>
    <!-- 面包屑 -->
    <div class="content">
      <cl-breadcrumb :breadcrumbs="breadcrumbs" />
      <!-- 签到 -->
      <div class="user">
        <el-button :disabled="isHiddenAndDisable" @click="handleSignClick">
          <el-badge is-dot class="item" :hidden="isHiddenAndDisable">
            <el-tooltip content="签到" placement="bottom" effect="dark">
              <el-icon class="sign" :size="22">
                <document-checked />
              </el-icon>
            </el-tooltip>
          </el-badge>
        </el-button>
        <!-- 用户 -->
        <user-info />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import UserInfo from "./user-info.vue"
import clBreadcrumb from "@/base-ui/breadcrumb"
import { pathMapBreadcrumbs } from "@/utils/map-menus"
import { useStore } from "@/store"
import { useRoute } from "vue-router"
import { updateUser } from "@/service/main/system/system"
import { ElMessage, ElNotification } from "element-plus"
import localCache from "@/utils/cache"

export default defineComponent({
  components: {
    UserInfo,
    clBreadcrumb
  },
  emits: ["foldChange"],
  setup(prop, { emit }) {
    const isFold = ref(false)
    const handleFoldClick = () => {
      isFold.value = !isFold.value
      emit("foldChange", isFold.value)
    }

    // 面包屑数据[{name:name,path:path}]
    const store = useStore()
    // 利用保存在store里面的菜单数据中的url和当前url进行匹配，拿到对应的name
    const breadcrumbs = computed(() => {
      const userMenus = store.state.login.userMenus.menus
      const route = useRoute()
      const currentPath = route.path
      return pathMapBreadcrumbs(userMenus, currentPath)
    })
    const FormData = ref({
      sign: 0
    })
    // 展示红点和是否能点击
    const isHiddenAndDisable = ref(false)
    const id = store.state.login.userInfo.data.user._id
    const name = store.state.login.userInfo.data.user.name
    FormData.value.sign = store.state.login.userInfo.data.user.sign

    // 判断如果今天和存在本地的时间是否一样
    let today = new Date().toLocaleDateString()
    // console.log(today)

    const isToday = localCache.getCache(`${name}+isToday`)
    //如果时间一样，不可点击
    if (today === isToday) {
      isHiddenAndDisable.value = true
    }
    // 处理点击签到功能
    const handleSignClick = async () => {
      const day = new Date().toLocaleDateString()
      isHiddenAndDisable.value = true
      FormData.value.sign++
      const result = await updateUser(id, { ...FormData.value })
      if (result.code > 0) {
        localCache.setCache(`${name}+isToday`, day)
        ElNotification({
          title: "Success",
          message: "签到成功",
          type: "success"
        })
      }
    }
    return {
      isFold,
      handleFoldClick,
      breadcrumbs,
      FormData,
      handleSignClick,
      isHiddenAndDisable
    }
  }
})
</script>

<style scoped lang="less">
.nav-header {
  width: 100%;
  display: flex;
  align-items: center;

  .el-icon {
    margin-top: 5px;
    font-size: 25px;
    cursor: pointer;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 10px 0 15px;
    .user {
      display: flex;
      .el-button {
        width: 20px;
        border: 0;
      }

      .sign {
        color: grey;
      }
    }
  }
}
</style>
