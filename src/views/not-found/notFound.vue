<template>
  <div class="notFound">
    <el-button class="goBackHome" type="primary" @click="goBackHome"
      >回到首页</el-button
    >
    <img class="pic" src="../../assets/img/404..jpg" alt="" />
  </div>
</template>

<script lang="ts">
import router from "@/router"
import { defineComponent } from "vue"

export default defineComponent({
  setup() {
    const goBackHome = () => {
      router.push("/main")
    }
    return {
      goBackHome
    }
  }
})
</script>

<style scoped lang="less">
.notFound {
  .goBackHome {
    width: 200px;
    height: 60px;
    position: absolute;
    top: 200px;
    left: 46%;
  }
  width: 100%;
  height: 970px;
  .pic {
    width: 100%;
    height: 100%;
  }
}
</style>
