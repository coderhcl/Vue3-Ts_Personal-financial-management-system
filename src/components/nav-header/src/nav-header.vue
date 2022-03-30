<template>
  <!-- Fold  <el-icon><expand /></el-icon>-->
  <div class="nav-header">
    <div @click="handleFlodClick">
      <el-icon v-if="isFold"><expand /></el-icon>
      <el-icon v-else><fold /></el-icon>
    </div>
    <div class="content">
      <cl-breadcrumb :breadcrumbs="breadcrumbs" />
      <user-info />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import UserInfo from "./uesr-info.vue"
import clBreadcrumb, { IBreadcrumb } from "@/base-ui/breadcrumb"
import { pathMapBreadcrumbs } from "@/utils/map-menus"
import { useStore } from "@/store"
import { useRoute } from "vue-router"
export default defineComponent({
  components: {
    UserInfo,
    clBreadcrumb
  },
  emits: ["foladChange"],
  setup(prop, { emit }) {
    const isFold = ref(false)
    const handleFlodClick = () => {
      isFold.value = !isFold.value
      emit("foladChange", isFold.value)
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

    return { isFold, handleFlodClick, breadcrumbs }
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
  }
}
</style>
