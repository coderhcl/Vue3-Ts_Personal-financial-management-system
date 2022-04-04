<template>
  <div class="show">
    <!-- 顶部四大模块，收入支出等 -->
    <div class="top-show">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :md="6" class="card-panel-col">
          <div class="card-panel">
            <!-- icon -->
            <div class="card-panel-icon-wrapper-avatar">
              <el-icon><avatar /></el-icon>
            </div>
            <!-- 文字数字展示 -->
            <div class="card-panel-description">
              <div class="card-panel-text">用户数量</div>
              <div class="card-panel-num">30</div>
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
              <div class="card-panel-text">收入</div>
              <div class="card-panel-num">3000</div>
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
              <div class="card-panel-text">支出</div>
              <div class="card-panel-num">1030</div>
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
              <div class="card-panel-text">剩余</div>
              <div class="card-panel-num">1970</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 平滑直线图 -->
    <div id="lineChart"></div>
    <!-- 三个图形 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8"
        ><div id="roleChart"></div
      ></el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8"
        ><div id="barChart"></div
      ></el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8"
        ><div id="radarChart"></div
      ></el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue"
// import useEchar from "@/utils/useEach"
import * as echarts from "echarts"
export default defineComponent({
  name: "show",
  setup() {
    /// 声明定义一下echart
    let echart = echarts
    onMounted(() => {
      initChart()
    })
    onUnmounted(() => {
      echart.dispose
    })

    // 基础配置一下Echarts
    function initChart() {
      let lineChart = echart.init(document.getElementById("lineChart")!)
      let roseChart = echart.init(document.getElementById("roleChart")!)
      let barChart = echart.init(document.getElementById("barChart")!)
      let radarChart = echart.init(document.getElementById("radarChart")!)
      // 把配置和数据放这里
      lineChart.setOption({
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [
              820, 932, 901, 934, 1290, 1330, 1320, 801, 102, 230, 4321, 4129
            ],
            type: "line",
            smooth: true
          }
        ]
      })

      roseChart.setOption({
        legend: {
          top: "bottom"
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
            name: "Nightingale Chart",
            type: "pie",
            radius: [50, 250],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 40, name: "rose 1" },
              { value: 38, name: "rose 2" },
              { value: 32, name: "rose 3" },
              { value: 30, name: "rose 4" },
              { value: 28, name: "rose 5" },
              { value: 26, name: "rose 6" },
              { value: 22, name: "rose 7" },
              { value: 18, name: "rose 8" }
            ]
          }
        ]
      })

      barChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["product", "2015", "2016", "2017"],
          source: [
            {
              product: "Matcha Latte",
              "2015": 43.3,
              "2016": 85.8,
              "2017": 93.7
            },
            { product: "Milk Tea", "2015": 83.1, "2016": 73.4, "2017": 55.1 },
            {
              product: "Cheese Cocoa",
              "2015": 86.4,
              "2016": 65.2,
              "2017": 82.5
            },
            {
              product: "Walnut Brownie",
              "2015": 72.4,
              "2016": 53.9,
              "2017": 39.1
            }
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      })

      radarChart.setOption({
        title: {
          text: "Basic Radar Chart"
        },
        legend: {
          data: ["Allocated Budget", "Actual Spending"]
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "Sales", max: 6500 },
            { name: "Administration", max: 16000 },
            { name: "Information Technology", max: 30000 },
            { name: "Customer Support", max: 38000 },
            { name: "Development", max: 52000 },
            { name: "Marketing", max: 25000 }
          ]
        },
        series: [
          {
            name: "Budget vs spending",
            type: "radar",
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: "Allocated Budget"
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: "Actual Spending"
              }
            ]
          }
        ]
      })
      window.onresize = function () {
        //自适应大小
        lineChart.resize()
        roseChart.resize()
        barChart.resize()
      }
    }

    return { initChart }
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
    }
  }
  #lineChart {
    background: #fff;
    margin: 30px 0 30px 0;
    width: 100%;
    height: 500px;
  }
  #roleChart,
  #barChart,
  #radarChart {
    background: #fff;
    width: 100%;
    height: 650px;
    margin-top: 10px;
  }
}
</style>
