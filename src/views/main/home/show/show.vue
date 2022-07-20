<template>
  <div class="show">
    <!-- 顶部四大模块，收入支出等 -->
    <div class="top-show">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :md="6" class="card-panel-col">
          <div class="card-panel" v-if="roleId === 1">
            <!-- icon -->
            <div class="card-panel-icon-wrapper-avatar">
              <el-icon><avatar /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">用户数量</div>
              <div class="card-panel-num">{{ userNum }}人</div>
            </div>
          </div>
          <div class="card-panel" v-else>
            <!-- icon -->
            <div class="card-panel-icon-wrapper-avatar">
              <el-icon><calendar /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">签到天数</div>
              <div class="card-panel-num">{{ signNum }}天</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" class="card-panel-col">
          <div class="card-panel">
            <!-- icon -->
            <div class="card-panel-icon-wrapper-money">
              <el-icon><money /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">当月收入</div>
              <div class="card-panel-num">￥{{ incomeListData[mon] }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" class="card-panel-col">
          <div class="card-panel">
            <!-- icon -->
            <div class="card-panel-icon-wrapper-shopping">
              <el-icon><shopping-cart /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">当月支出</div>
              <div class="card-panel-num">
                ￥{{ expenseListData[mon] + debtListData[mon] }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" class="card-panel-col">
          <div class="card-panel">
            <!-- icon -->
            <div class="card-panel-icon-wrapper-document">
              <el-icon><document class="card-panel-icon" /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">当月剩余</div>
              <div class="card-panel-num">
                ￥{{
                  incomeListData[mon] - expenseListData[mon] - debtListData[mon]
                }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 平滑直线图 -->
    <div class="stackedLineChart">
      <el-row>
        <el-col :span="24">
          <div
            class="stackedLineChartContainer"
            ref="stackedLineChartContainer"
          ></div>
        </el-col>
      </el-row>
    </div>
    <div class="buttonChart">
      <el-row>
        <el-col :span="24">
          <stacked-column-chart></stacked-column-chart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue"
import * as echarts from "echarts"
import { ElMessageBox } from "element-plus"
import { useStore } from "@/store/index"
import { requestNotice } from "@/service/login/login"
import {
  getUserNumApi,
  getYearDebtListApi,
  getYearExpenseListApi,
  getYearIncomeListApi,
  requestUserInfoById
} from "@/service/main/home/home"
import getYearNumList from "@/utils/getYearNumList"
import stackedColumnChart from "./cpns/stackedColumnChart.vue"

export default defineComponent({
  name: "show",
  components: { stackedColumnChart },
  setup() {
    /// 声明定义一下echart
    let echart = echarts
    onMounted(() => {
      // 弹出公告，暂时关闭
      showNotice()
      getUserNum()
      getYearIncome()
      getYearExpense()
      getYearDebt()
      stackedLineChart.value = echarts.init(stackedLineChartContainer.value)
      getStackedLineChartData()
      getUserInfo()
    })
    onUnmounted(() => {
      echart.dispose
    })
    // 获取用户数量
    const userNum = ref(0)
    const getUserNum = async () => {
      const result = await getUserNumApi()

      if (result.code > 0) {
        userNum.value = result.data.userNum
      }
    }
    // 获取当年和月收入
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data._id
    const roleId = store.state.login.userInfo.data.user.roleId
    const signNum = ref(0)
    // 获取用户信息
    const getUserInfo = async () => {
      const result = await requestUserInfoById(id)
      if (result.code > 0) {
        signNum.value = result.data.user.sign
      }
    }
    // 获取收入和支出以及债务数据
    const incomeListData = ref<any>([])
    const expenseListData = ref<any>([])
    const debtListData = ref<any>([])
    const mon = new Date().getMonth()
    const getYearIncome = async () => {
      const result = await getYearIncomeListApi({ userId: id })
      incomeListData.value = getYearNumList(result)
    }
    const getYearExpense = async () => {
      const result = await getYearExpenseListApi({ userId: id })
      expenseListData.value = getYearNumList(result)
    }
    const getYearDebt = async () => {
      const debtResult = await getYearDebtListApi({ userId: id })
      debtListData.value = getYearNumList(debtResult.notPayList)
    }

    // 获取堆叠折线图
    const stackedLineChartContainer = ref()
    let stackedLineChart = ref()
    const getStackedLineChartData = async () => {
      const incomeResult = await getYearIncomeListApi({ userId: id })
      const incomeData = getYearNumList(incomeResult)
      const expenseResult = await getYearExpenseListApi({ userId: id })
      const expenseData = getYearNumList(expenseResult)
      const debtResult = await getYearDebtListApi({ userId: id })
      const debtData = getYearNumList(debtResult.notPayList)
      const remainMoney = []
      for (let i = 0; i < 12; i++) {
        remainMoney[i] = incomeData[i] - expenseData[i] - debtData[i]
      }

      const options = {
        title: {
          text: "全年收支全览-折线图"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          data: ["收入", "支出", "债务", "剩余"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "收入",
            type: "line",
            data: incomeData,
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            }
          },
          {
            name: "支出",
            type: "line",
            data: expenseData,
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            }
          },
          {
            name: "债务",
            type: "line",
            data: debtData,
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            }
          },
          {
            name: "剩余",
            type: "line",
            data: remainMoney,
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            }
          }
        ]
      }
      window.onresize = function () {
        //自适应大小
        stackedLineChart.value.resize()
      }
      stackedLineChart.value.setOption(options)
    }

    // 显示公告
    const showNotice = async () => {
      const noticeresult = await requestNotice()
      const notice = noticeresult.data.noticeList[0]
      const title = notice.title
      const content = notice.content
      ElMessageBox.alert(content, title, {
        confirmButtonText: "OK"
      })
    }

    return {
      showNotice,
      getUserNum,
      userNum,
      id,
      getYearIncome,
      incomeListData,
      mon,
      getYearExpense,
      expenseListData,
      debtListData,
      getYearDebt,
      stackedLineChartContainer,
      stackedLineChart,
      getStackedLineChartData,
      getUserInfo,
      roleId,
      signNum
    }
  }
})
</script>

<style lang="less" scoped>
.show {
  background-color: #ebecef;

  .panel-group {
    background-color: #eeeff2;
  }
  .card-panel {
    height: 100px;
    font-size: 25px;
    color: #666;
    cursor: pointer;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    .card-panel-icon-wrapper-avatar {
      height: 90px;
      width: 90px;
      line-height: 108px;
      font-size: 60px;
      color: #40c9c6;
    }
    .card-panel-icon-wrapper-money {
      height: 90px;
      width: 90px;
      line-height: 108px;
      font-size: 60px;
      color: #36a3f7;
    }
    .card-panel-icon-wrapper-shopping {
      height: 90px;
      width: 90px;
      line-height: 108px;
      font-size: 60px;
      color: #f4516c;
    }
    .card-panel-icon-wrapper-document {
      height: 90px;
      width: 90px;
      line-height: 108px;
      font-size: 60px;
      color: #34bfa3;
    }
    &:hover {
      box-shadow: 5px 2px 6px #6666;
      .card-panel-icon-wrapper-avatar {
        background-color: #40c9c6;
        color: #fff;
        border-radius: 6px;
      }
    }
    &:hover {
      .card-panel-icon-wrapper-money {
        background-color: #36a3f7;
        color: #fff;
        border-radius: 6px;
      }
    }
    &:hover {
      .card-panel-icon-wrapper-shopping {
        background-color: #f4516c;
        color: #fff;
        border-radius: 6px;
      }
    }
    &:hover {
      .card-panel-icon-wrapper-document {
        background-color: #34bfa3;
        color: #fff;
        border-radius: 6px;
      }
    }
    .card-panel-description {
      .card-panel-text {
        width: 100px;
        height: 30px;
        font-weight: bold;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 25px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-style: italic;
        font-size: 30px;
        color: #666666;
      }
      &:hover {
        .card-panel-num {
          font-size: 40px;
          color: #f4516c;
        }
      }
    }
  }
  .stackedLineChart {
    background: #fff;
    margin: 30px 0 20px 0;
    padding: 20px;
    .stackedLineChartContainer {
      width: 100%;
      height: 600px;
    }
  }
}
</style>
