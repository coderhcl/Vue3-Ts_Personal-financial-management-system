<template>
  <div class="container-box">
    <div class="select">
      <div class="time">
        <span>选择时间：</span>
        <el-date-picker
          v-model="chartData.createTime"
          size="small"
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
            size="small"
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
          <el-button
            type="success"
            :icon="Search"
            size="small"
            @click="selectData"
          />
          <el-button :icon="RefreshRight" @click="cleanFormData" size="small" />
        </div>
      </div>
    </div>
    <div class="container" ref="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue"
import * as echarts from "echarts"
import { getIncomeChartData } from "@/service/main/property/property"
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
    const data = ref<any>()
    const getChartData = async () => {
      data.value = await getIncomeChartData({ ...chartData.value })
      const options = {
        title: {
          text: "收入占比",
          subtext: `收入前 ${chartData.value.limitNum} 占比`,
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
            name: "收入详情",
            type: "pie",
            radius: "50%",
            data: data.value,
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
    height: 500px;
  }
  .select {
    width: 100%;
    // display: flex;
    margin-bottom: 20px;
    .time {
      span {
        width: 80px;
        font-size: 12px;
        line-height: 20px;
      }
      display: flex;
      margin-bottom: 5px;
      height: 30px;
    }
    .num {
      width: 70%;
      display: flex;
      justify-content: space-between;
      .select-num {
        display: flex;
        span {
          width: 80px;
          font-size: 12px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
