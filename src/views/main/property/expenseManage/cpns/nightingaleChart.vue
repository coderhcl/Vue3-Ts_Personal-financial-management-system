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
              v-for="item in 20"
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
import { getExpenseChartData } from "@/service/main/property/property"
import { useStore } from "@/store"
import { Search, RefreshRight } from "@element-plus/icons-vue"

export default defineComponent({
  setup() {
    onMounted(() => {
      nightingaleChart.value = echarts.init(container.value)
      getChartData()
    })
    onUnmounted(() => {
      nightingaleChart.value.dispose
    })

    const container = ref()
    let nightingaleChart = ref()
    const store = useStore()
    const id = store.state.login.userInfo.data._id
    const year = new Date().getFullYear()
    const mon = new Date().getMonth()
    const chartData = ref({
      userId: id,
      limitNum: 10,
      createTime: [
        new Date(year, mon - 1, 31, 23, 59, 59),
        new Date(year, mon, 30, 23, 59, 59)
      ]
    })
    const dataLen = ref(0)
    const getChartData = async () => {
      const result = await getExpenseChartData({ ...chartData.value })
      const options = {
        legend: {
          top: "top"
        },
        tooltip: {
          trigger: "item"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: "支出类别",
            type: "pie",
            radius: [50, 250],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8
            },
            data: result
          }
        ]
      }

      window.onresize = function () {
        //自适应大小
        nightingaleChart.value.resize()
      }
      nightingaleChart.value.setOption(options)
    }

    // 图表搜索
    const selectData = () => {
      getChartData()
    }
    // 清空
    const cleanFormData = () => {
      ;(chartData.value.limitNum = 10),
        (chartData.value.createTime = [
          new Date(year, mon, 1, 0, 0, 0),
          new Date(year, mon, 30, 23, 59, 59)
        ])
      getChartData()
    }
    return {
      container,
      nightingaleChart,
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
    margin-top: 30px;
    height: 680px;
  }
  .select {
    margin-top: 20px;
    width: 100%;
    margin-bottom: 10px;
    .time {
      span {
        width: 80px;
        font-size: 15px;
        line-height: 30px;
      }
      display: flex;
      margin-bottom: 5px;
      height: 30px;
    }
    .num {
      width: 70%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .select-num {
        display: flex;
        span {
          width: 80px;
          font-size: 15px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
