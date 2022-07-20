<template>
  <div class="person">
    <div class="card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="always">
            <div class="today">当前日期</div>
            <div class="today-num">{{ today }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">
            <div class="loginDay">上次登录</div>
            <div class="loginDay-num">{{ loginDay }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">
            <div class="alwayLogin">已签到</div>
            <div class="alwayLogin-num">{{ info.sign }}天</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="message-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="message">
            <template #header>
              <div class="message-header">
                <span>用户信息</span>
                <el-avatar
                  v-if="info.icon"
                  :size="30"
                  :src="info.icon"
                ></el-avatar>
                <el-avatar v-else :size="30">{{ info.userName }}</el-avatar>
              </div>
            </template>
            <div class="message-content">
              <div class="box">
                <div class="title">用户名</div>
                <div class="userName">{{ info.userName }}</div>
              </div>
              <div class="box">
                <div class="title">角色</div>
                <div class="role">
                  {{ info.role === 1 ? "管理员" : "普通用户" }}
                </div>
              </div>
              <div class="box">
                <div class="title">手机号码</div>
                <div class="phone">{{ info.phone }}</div>
              </div>
              <div class="box">
                <div class="title">邮箱</div>
                <div class="email">{{ info.email }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <!-- 进度条 -->
          <div class="progress">
            <span>今天已过</span>
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="passHours"
            />
            <span>这周已过</span>
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="passDay"
              status="success"
            />
            <span>这月已过</span>
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="passMonth"
              status="warning"
            />
            <span>今年已过</span>
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="passYear"
              status="exception"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import localCache from "@/utils/cache"
import { useStore } from "@/store/index"
import { requestUserInfoById } from "@/service/main/message/message"

export default defineComponent({
  name: "person",
  setup() {
    onMounted(() => {
      getUserInfo()
    })
    const store = useStore()

    // 获取当前日期
    const today = new Date().toLocaleDateString()
    const userName = store.state.login.userInfo.data.user.name

    // 获取登录时间
    const loginDay =
      localCache.getCache(`${userName}+loginDay`) || new Date().toLocaleString()
    // 获取时间进度
    // 0-23
    const hour = new Date().getHours()
    // 0-6
    const day = new Date().getDay()
    // 1-31
    const date = new Date().getDate()
    // month 0-11
    const month = new Date().getMonth()
    const passHours = Math.round(((hour + 1) / 24) * 100)
    const passDay = Math.round(((day + 1) / 7) * 100)
    const passMonth = Math.round((date / 31) * 100)
    const passYear = Math.round(((month + 1) / 12) * 100)
    const id = store.state.login.userInfo.data.user._id

    const info = ref({
      userName: "",
      role: 2,
      phone: "",
      email: "",
      sign: "",
      icon: ""
    })
    const getUserInfo = async () => {
      const result = await requestUserInfoById(id)
      if (result.code > 0) {
        info.value.userName = result.data.user.name
        info.value.role = result.data.user.roleId
        info.value.phone = result.data.user.phone
        info.value.email = result.data.user.email
        info.value.sign = result.data.user.sign
        info.value.icon = result.data.user.icon
      }
    }

    return {
      today,
      loginDay,
      day,
      passHours,
      passDay,
      passMonth,
      passYear,
      info,
      // userName,
      // role,
      // phone,
      // email,
      // signDay,
      getUserInfo
    }
  }
})
</script>

<style scoped lang="less">
.person {
  background-color: #f0f2f5;
  .card {
    .el-card {
      border-radius: 6px;
      height: 150px;
      .today {
        height: 60px;
        font-size: 30px;
        color: #67c23a;
      }

      .loginDay {
        height: 60px;
        font-size: 30px;
        color: #409eff;
      }
      .alwayLogin {
        height: 60px;
        font-size: 30px;
        color: #e6a23c;
      }
      .today-num,
      .loginDay-num,
      .alwayLogin-num {
        font-size: 25px;
        font-style: italic;
      }
    }
  }
  .message-box {
    margin-top: 20px;
    padding: 10px;
    .progress {
      margin-right: 10px;
      .el-progress {
        margin: 10px;
      }
    }
    .message {
      .message-header {
        line-height: 30px;
        font-size: 20px;
        display: flex;
        .el-avatar {
          margin-left: 15px;
        }
      }
      .message-content {
        display: flex;
        width: 100%;
        height: 150px;
        flex-wrap: wrap;
        .box {
          margin: 5px;
          width: 45%;
          box-shadow: 5px 2px 6px #6666;
          .title {
            font-size: 18px;
            margin: 10px;
            color: burlywood;
          }
        }
      }
    }
  }
}
</style>
