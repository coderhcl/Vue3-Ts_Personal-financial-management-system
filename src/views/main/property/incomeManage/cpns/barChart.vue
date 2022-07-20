<template>
  <div class="barChart">
    <div class="title">
      <span>{{ year }} 年全年工资柱状图</span>
      <div>
        <el-button
          :icon="RefreshRight"
          @click="refreshData"
          size="small"
          type="primary"
          >刷新</el-button
        >
      </div>
    </div>
    <div class="container" ref="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue"
import * as echarts from "echarts"
import { getYearIncomeListApi } from "@/service/main/property/property"
import { useStore } from "@/store"
import getYearNumList from "@/utils/getYearNumList"
import { RefreshRight } from "@element-plus/icons-vue"

export default defineComponent({
  setup() {
    onMounted(() => {
      barchart.value = echarts.init(container.value)
      getChartData()
    })
    onUnmounted(() => {
      barchart.value.dispose
    })
    const container = ref()
    let barchart = ref()
    const store = useStore()
    const id = store.state.login.userInfo.data._id
    const year = new Date().getFullYear()
    const listData = ref<any>([])
    const getChartData = async () => {
      const result = await getYearIncomeListApi({ userId: id })
      listData.value = getYearNumList(result)
      // const result = await getIncomeChartData({ ...chartData.value })
      const options = {
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
            name: "收入",
            label: {
              show: true, // 是否可见
              rotate: 0 // 旋转角度
            },
            data: listData.value,
            type: "bar"
          }
        ],
        tooltip: {
          trigger: "item"
        }
      }
      window.onresize = function () {
        //自适应大小
        barchart.value.resize()
      }
      barchart.value.setOption(options)
    }
    // 刷新
    const refreshData = () => {
      getChartData()
    }

    return {
      container,
      barchart,
      getChartData,
      year,
      RefreshRight,
      refreshData
    }
  }
})
</script>

<style scoped lang="less">
.barChart {
  width: 100%;
  .container {
    height: 500px;
  }
  .title {
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
