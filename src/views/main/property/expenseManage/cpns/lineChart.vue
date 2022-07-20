<template>
  <div class="lineChart">
    <div class="title">
      <span>{{ year }} 年每月支出折线图</span>
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
import { getYearExpenseListApi } from "@/service/main/property/property"
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
      const result = await getYearExpenseListApi({ userId: id })
      const listData = getYearNumList(result)
      const options = {
        tooltip: {
          trigger: "item"
        },
        xAxis: {
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
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "支出",
            data: listData,
            type: "line",
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            }
            // smooth: true
          }
        ]
      }
      window.onresize = function () {
        //自适应大小
        lineChart.value.resize()
      }
      lineChart.value.setOption(options)
      let currentIndex = 0

      // setInterval(function () {
      //   let dataLen = options.series[0].data.length
      //   // 取消之前高亮的图形
      //   lineChart.value.dispatchAction({
      //     type: "downplay",
      //     seriesIndex: 0,
      //     dataIndex: currentIndex
      //   })
      //   currentIndex = (currentIndex + 1) % dataLen
      //   // 高亮当前图形
      //   lineChart.value.dispatchAction({
      //     type: "highlight",
      //     seriesIndex: 0,
      //     dataIndex: currentIndex
      //   })
      //   // 显示 tooltip
      //   lineChart.value.dispatchAction({
      //     type: "showTip",
      //     seriesIndex: 0,
      //     dataIndex: currentIndex
      //   })
      // }, 1500)
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
  padding: 10px;
  width: 100%;
  .container {
    height: 500px;
  }
  .title {
    width: 100%;
    display: flex;
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
