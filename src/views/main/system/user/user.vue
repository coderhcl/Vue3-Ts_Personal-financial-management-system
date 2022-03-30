<template>
  <div class="user">
    <cl-form v-bind="searchFormConfig" v-model="formData" />
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import clForm from "@/base-ui/form"
import { searchFormConfig } from "./config/search.config"
export default defineComponent({
  name: "user",
  components: {
    clForm
  },
  setup() {
    const formData = ref({
      name: "",
      phone: "",
      email: "",
      role: "",
      createTime: ""
    })
    return { searchFormConfig, formData }
  }
})
</script>

<style scoped lang="less">
.user {
  width: 100%;
}
</style>
