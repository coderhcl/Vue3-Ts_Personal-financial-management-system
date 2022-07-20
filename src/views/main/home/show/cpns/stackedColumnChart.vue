<template>
  <div class="stackedColumnChart">
    <div
      class="stackedColumnChartContainer"
      ref="stackedColumnChartContainer"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue"
import * as echarts from "echarts"
import { getYearDebtListApi } from "@/service/main/property/property"
import { useStore } from "@/store"
import getYearNumList from "@/utils/getYearNumList"
import {
  getYearExpenseListApi,
  getYearIncomeListApi
} from "@/service/main/home/home"

export default defineComponent({
  setup() {
    onMounted(() => {
      stackedColumnChart.value = echarts.init(stackedColumnChartContainer.value)
      getStackedColumnChartData()
    })
    onUnmounted(() => {
      stackedColumnChart.value.dispose
    })
    // 获取堆叠柱状图
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data._id
    const stackedColumnChartContainer = ref()
    let stackedColumnChart = ref()
    const getStackedColumnChartData = async () => {
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
          text: "全年收支全览-柱状图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
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
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "收入",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series"
            },
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            },
            data: incomeData
          },
          {
            name: "支出",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series"
            },
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            },
            data: expenseData
          },
          {
            name: "债务",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series"
            },
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            },
            data: debtData
          },
          {
            name: "剩余",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series"
            },
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            },
            data: remainMoney
          }
        ]
      }
      window.onresize = function () {
        //自适应大小
        stackedColumnChart.value.resize()
      }
      stackedColumnChart.value.setOption(options)
    }
    // 刷新

    return {
      stackedColumnChartContainer,
      stackedColumnChart,
      getStackedColumnChartData
    }
  }
})
</script>

<style scoped lang="less">
.stackedColumnChart {
  background-color: #fff;
  padding: 15px;
  .stackedColumnChartContainer {
    width: 100%;
    height: 500px;
  }
}
</style>
