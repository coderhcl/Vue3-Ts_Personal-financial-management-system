<template>
  <div class="container-box">
    <div class="select">
      <div class="time">
        <span>选择时间：</span>
        <el-date-picker
          v-model="chartData.createTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          small
        />
      </div>
      <div class="num">
        <div class="select-num">
          <span>条数：</span>
          <el-select
            v-model="chartData.limitNum"
            filterable
            placeholder="Select"
          >
            <el-option
              v-for="item in 10"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="handleSelect">
          <el-button type="success" :icon="Search" @click="selectData" />
          <el-button :icon="RefreshRight" @click="cleanFormData" />
        </div>
      </div>
    </div>
    <div class="container" ref="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue"
import * as echarts from "echarts"
import { getDebtChartData } from "@/service/main/property/property"
import { useStore } from "@/store"
import { Search, RefreshRight } from "@element-plus/icons-vue"

export default defineComponent({
  setup() {
    onMounted(() => {
      pieChart.value = echarts.init(container.value)
      getChartData()
    })
    onUnmounted(() => {
      pieChart.value.dispose
    })

    const container = ref()
    let pieChart = ref()
    const store = useStore()
    const id = store.state.login.userInfo.data._id
    const year = new Date().getFullYear()
    const mon = new Date().getMonth()
    const chartData = ref({
      userId: id,
      limitNum: 5,
      createTime: [
        new Date(year, mon - 1, 31, 23, 59, 59),
        new Date(year, mon, 30, 23, 59, 59)
      ]
    })
    const dataLen = ref(0)
    const getChartData = async () => {
      const result = await getDebtChartData({ ...chartData.value })
      const options = {
        color: ["#ece269", "#1983DB", "#55bfc0", "#5fbf68", "#de6a66"],
        title: {
          text: "债务占比",
          subtext: `债务前 ${chartData.value.limitNum} 占比`,
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "债务详情",
            type: "pie",
            radius: "50%",
            data: result,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }

      window.onresize = function () {
        //自适应大小
        pieChart.value.resize()
      }
      pieChart.value.setOption(options)
    }

    // 图表搜索
    const selectData = () => {
      getChartData()
    }
    // 清空
    const cleanFormData = () => {
      ;(chartData.value.limitNum = 5),
        (chartData.value.createTime = [
          new Date(year, mon, 1, 0, 0, 0),
          new Date(year, mon, 30, 23, 59, 59)
        ])
      getChartData()
    }
    return {
      container,
      pieChart,
      chartData,
      Search,
      selectData,
      RefreshRight,
      cleanFormData,
      dataLen,
      getChartData
    }
  }
})
</script>

<style scoped lang="less">
.container-box {
  width: 100%;
  .container {
    width: 100%;
    height: 500px;
  }
  .select {
    margin-top: 30px;
    width: 100%;
    margin-bottom: 70px;
    .time {
      span {
        width: 80px;
        font-size: 15px;
        line-height: 25px;
      }
      display: flex;
      margin-bottom: 5px;
      height: 30px;
    }
    .num {
      margin-top: 20px;
      width: 70%;
      display: flex;
      justify-content: space-between;
      .select-num {
        display: flex;
        span {
          width: 80px;
          font-size: 15px;
          line-height: 35px;
        }
      }
    }
  }
}
</style>
