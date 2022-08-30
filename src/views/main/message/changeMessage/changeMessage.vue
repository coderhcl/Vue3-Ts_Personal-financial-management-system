<template>
  <div class="changemessage">
    <div class="title">
      <el-row>
        <el-col :span="24">
          <el-card shadow="always" class="message"> 编辑信息</el-card>
        </el-col>
      </el-row>
    </div>
    <div class="content-box">
      <el-form
        label-width="100px"
        :model="userInfo"
        :rules="rules"
        style="max-width: 400px"
        ref="formRef"
      >
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="userInfo.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="userInfo.phone" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="userInfo.email" />
        </el-form-item>
        <el-form-item label="头像:">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3001/api/upload"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <img v-if="userInfo.icon" :src="userInfo.icon" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="handleChange">
        <el-button
          type="primary"
          @click="changeUserInfoClick"
          :disabled="notClick"
          >{{ btnText }}</el-button
        >
        <el-button type="warning" @click="cancelClick">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  requestUserInfoById,
  changeUserInfo
} from "@/service/main/message/message"
import { defineComponent, onMounted, reactive, ref } from "vue"
import { useStore } from "@/store/index"
import { rules } from "./config/rules"
import { ElForm, ElNotification } from "element-plus"

export default defineComponent({
  name: "changeMessage",
  setup() {
    onMounted(() => {
      getUserInfo()
    })
    const userInfo = reactive({
      name: "",
      password: "",
      phone: "",
      email: "",
      icon: ""
    })

    const store = useStore()
    const id = store.state.login.userInfo.data.user._id
    const getUserInfo = async () => {
      const result = await requestUserInfoById(id)
      if (result.code > 0) {
        userInfo.name = result.data.user.name
        userInfo.password = result.data.user.password
        userInfo.phone = result.data.user.phone
        userInfo.email = result.data.user.email
        userInfo.icon = result.data.user.icon
      }
    }
    const formRef = ref<InstanceType<typeof ElForm>>()
    const afterUpload = (res: any) => {
      userInfo.icon = res.url
    }
    const notClick = ref(false)
    const btnText = ref("更改")
    const timer = ref()
    const countDown = (time: number) => {
      if (timer.value) {
        clearInterval(timer.value)
      }
      notClick.value = true
      let tim = time
      timer.value = setInterval(() => {
        tim--
        if (tim === 0) {
          clearInterval(timer.value)
          notClick.value = false
          btnText.value = "更改"
        } else {
          btnText.value = `${tim}秒`
        }
      }, 1000)
    }

    // 更改用户
    const changeUserInfoClick = async () => {
      formRef.value?.validate(async (valid) => {
        if (valid) {
          const result = await changeUserInfo(id, { ...userInfo })

          if (result.code > 0) {
            console.log(result)
            userInfo.name = result.data.user.name
            userInfo.password = result.data.user.password
            userInfo.phone = result.data.user.phone
            userInfo.email = result.data.user.email
            userInfo.icon = result.data.user.icon
          }
          store.dispatch("message/changeUserInfoAction", {
            id: id,
            userInfo: userInfo
          })
        }
      })

      getUserInfo()
      countDown(5)
    }

    const cancelClick = async () => {
      userInfo.name = store.state.message.userList.name
      userInfo.phone = store.state.message.userList.phone
      userInfo.email = store.state.message.userList.email
      userInfo.icon = store.state.message.userList.icon
      ElNotification({
        title: "Warning",
        message: "操作取消",
        type: "warning"
      })
    }
    return {
      userInfo,
      getUserInfo,
      rules,
      changeUserInfoClick,
      formRef,
      cancelClick,
      afterUpload,
      notClick,
      btnText,
      countDown
      // clearCountDown
    }
  }
})
</script>

<style scoped lang="less">
.changemessage {
  background-color: #f0f2f5;
  .message {
    display: flex;
    border-left: 10px solid #409eff;
  }
  .content-box {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    .avatar-uploader {
      width: 178px;
      height: 178px;
      display: block;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .avatar {
        width: 100%;
        height: 100%;
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
      }
      &:hover {
        border: 1px dashed #409eff;
        .el-icon.avatar-uploader-icon {
          color: #409eff;
        }
      }
    }
  }
}
</style>
