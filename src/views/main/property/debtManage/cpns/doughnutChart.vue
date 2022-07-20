<template>
  <div class="lineChart">
    <div class="title">
      <span>{{ year }} 年全年偿还图表</span>
      <div>
        <el-button
          :icon="RefreshRight"
          @click="refreshData"
          size="small"
          type="success"
          >刷新</el-button
        >
      </div>
    </div>
    <div class="container" ref="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue"
import * as echarts from "echarts"
import { getYearDebtListApi } from "@/service/main/property/property"
import { useStore } from "@/store"
import getYearNumList from "@/utils/getYearNumList"
import { RefreshRight } from "@element-plus/icons-vue"

export default defineComponent({
  setup() {
    onMounted(() => {
      lineChart.value = echarts.init(container.value)
      getChartData()
    })
    onUnmounted(() => {
      lineChart.value.dispose
    })
    const container = ref()
    let lineChart = ref()
    const year = new Date().getFullYear()
    const store = useStore()
    const id = store.state.login.userInfo.data._id

    const getChartData = async () => {
      const totalPayMoney = ref(0)
      const totalNotPayMoney = ref(0)
      const result = await getYearDebtListApi({ userId: id })
      totalPayMoney.value = result.payNum
      totalNotPayMoney.value = result.notPayNum
      const showData = [
        { value: totalPayMoney.value, name: "已还清账务" },
        { value: totalNotPayMoney.value, name: "未还清账务" }
      ]

      const options = {
        color: ["#5fbf68", "#de6a66", "#ece269", "#1983DB", "#55bfc0"],
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "5%",
          left: "center"
        },
        series: [
          {
            name: "账务详情",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30"
              }
            },
            labelLine: {
              show: false
            },
            data: showData
          }
        ]
      }
      window.onresize = function () {
        //自适应大小
        lineChart.value.resize()
      }
      lineChart.value.setOption(options)
      let currentIndex = 0
      setInterval(function () {
        let dataLen = options.series[0].data.length
        // 取消之前高亮的图形
        lineChart.value.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        currentIndex = (currentIndex + 1) % dataLen
        // 高亮当前图形
        lineChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        // 显示 tooltip
        lineChart.value.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: currentIndex
        })
      }, 8000)
    }
    // 刷新
    const refreshData = () => {
      getChartData()
    }
    return {
      container,
      lineChart,
      getChartData,
      getYearNumList,
      year,
      RefreshRight,
      refreshData
    }
  }
})
</script>

<style scoped lang="less">
.lineChart {
  width: 100%;
  .container {
    margin-top: 20px;
    height: 400px;
  }
  .title {
    width: 100%;
    display: flex;
    margin-top: 10px;
    span {
      margin-left: 5px;
      font-size: 20px;
    }
    .el-button {
      margin-left: 250px;
    }
  }
}
</style>
//
