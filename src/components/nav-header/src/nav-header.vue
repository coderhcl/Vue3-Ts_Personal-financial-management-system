<template>
  <!-- Fold  <el-icon><expand /></el-icon>-->
  <div class="nav-header">
    <div @click="handleFlodClick">
      <el-icon v-if="isFold"><expand /></el-icon>
      <el-icon v-else><fold /></el-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  emits: ["foladChange"],
  setup(prop, { emit }) {
    const isFold = ref(false)
    const handleFlodClick = () => {
      isFold.value = !isFold.value
      emit("foladChange", isFold.value)
    }
    return { isFold, handleFlodClick }
  }
})
</script>

<style scoped lang="less">
.nav-header {
  .el-icon {
    font-size: 25px;
    cursor: pointer;
  }
}
</style>
