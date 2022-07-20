<template>
  <div class="investmentmanage">
    <div class="search">
      <el-form :model="searchFormData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="类别">
              <el-select
                filterable
                v-model="searchFormData.category"
                placeholder="请选择分类"
              >
                <el-option
                  v-for="item in categories"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input
                placeholder="请输入投资名称"
                v-model="searchFormData.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起始时间">
              <el-date-picker
                v-model="searchFormData.createTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金钱">
              <el-input
                placeholder="请输入投资金钱"
                v-model="searchFormData.money"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input
                placeholder="请输入备注"
                v-model="searchFormData.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="handleBtn">
        <el-button type="primary" :icon="Search" @click="searchInvestment"
          >搜索</el-button
        >
        <el-button :icon="RefreshRight" @click="cleanFormData">重置</el-button>
      </div>
    </div>
    <div class="content">
      <el-row>
        <el-col :span="24">
          <div class="message">
            <div class="title">
              <span>投资列表</span>
              <div class="handleBtn">
                <el-button type="primary" @click="FormVisible = true">
                  添加投资
                </el-button>
                <el-button class="refresh" @click="refresh">
                  <el-icon><refresh /></el-icon>
                </el-button>
                <!-- 添加债务弹出卡面 -->
                <el-dialog
                  v-model="FormVisible"
                  title="添加投资详情"
                  :width="400"
                >
                  <el-form
                    :label-width="100"
                    :model="addInvestmentFormData"
                    :rules="rules"
                    ref="addInvestmentForm"
                  >
                    <el-form-item label="类别:" prop="category">
                      <el-select
                        filterable
                        v-model="addInvestmentFormData.category"
                        placeholder="请选择分类"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in categories"
                          :key="item._id"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="名称:" prop="name">
                      <el-input v-model="addInvestmentFormData.name" />
                    </el-form-item>

                    <el-form-item label="金钱:" prop="money">
                      <el-input v-model="addInvestmentFormData.money" />
                    </el-form-item>

                    <el-form-item label="年利率:" prop="rate">
                      <el-input v-model="addInvestmentFormData.rate" />
                    </el-form-item>

                    <el-form-item label="年份:" prop="age">
                      <el-input v-model="addInvestmentFormData.age" />
                    </el-form-item>

                    <el-form-item label="投资时间:" prop="createTime">
                      <el-date-picker
                        v-model="addInvestmentFormData.createTime"
                        type="date"
                        placeholder="请选择时间"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item label="备注:" prop="remark">
                      <el-input v-model="addInvestmentFormData.remark" />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="FormVisible = false">取消</el-button>
                      <el-button type="primary" @click="addInvestment"
                        >添加</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </div>
            </div>
            <div class="table">
              <el-table :data="tableInvestmentData" border stripe size="small">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="55"
                />
                <el-table-column
                  prop="category"
                  label="类别"
                  align="center"
                  width="120"
                />
                <el-table-column
                  prop="name"
                  label="名称"
                  align="center"
                  width="150"
                />
                <el-table-column
                  sortable
                  prop="money"
                  label="金钱"
                  align="center"
                  width="150"
                />
                <el-table-column
                  sortable
                  prop="rate"
                  label="年利率"
                  align="center"
                  width="130"
                />
                <el-table-column
                  sortable
                  prop="age"
                  label="年份"
                  align="center"
                  width="100"
                />
                <el-table-column
                  sortable
                  prop="createTime"
                  label="创建时间"
                  align="center"
                  ref="createTime"
                  width="170"
                  :formatter="FormateCreateTime"
                />

                <el-table-column label="到期应得" align="center">
                  <template v-slot="scope">
                    {{
                      scope.row.money +
                      scope.row.money * scope.row.rate * scope.row.age
                    }}
                    元
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center"
                  width="200"
                />
                <el-table-column fixed="right" label="操作" align="center">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      size="small"
                      circle
                      :icon="Edit"
                      @click="open(scope.row)"
                    ></el-button>
                    <el-button
                      type="danger"
                      circle
                      size="small"
                      :icon="Delete"
                      class="delete"
                      @click="handleDelete(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 编辑收入弹出卡面 -->
            <el-dialog
              v-model="editInvestmentVisible"
              title="编辑投资"
              :width="400"
            >
              <el-form
                :label-width="100"
                :model="editInvestmentFormData"
                :rules="rules"
                ref="editInvestmentForm"
              >
                <el-form-item label="类别:" prop="category">
                  <el-select
                    filterable
                    v-model="editInvestmentFormData.category"
                    placeholder="请选择分类"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in categories"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                  <el-input v-model="editInvestmentFormData.name" />
                </el-form-item>
                <el-form-item label="金钱:" prop="money">
                  <el-input v-model="editInvestmentFormData.money" />
                </el-form-item>
                <el-form-item label="年利率:" prop="rate">
                  <el-input v-model="editInvestmentFormData.rate" />
                </el-form-item>
                <el-form-item label="年份:" prop="age">
                  <el-input v-model="editInvestmentFormData.age" />
                </el-form-item>

                <el-form-item label="创建时间:" prop="createTime">
                  <el-date-picker
                    v-model="editInvestmentFormData.createTime"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                  <el-input v-model="editInvestmentFormData.remark" />
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editInvestmentVisible = false">
                    取消
                  </el-button>
                  <el-button type="primary" @click="editInvestment">
                    添加
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:currentPage="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[6, 8, 10, 12]"
                small
                :background="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="investmentCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="investmentMessage">
      <el-row>
        <el-col :span="12">
          <div class="debtmoney">
            <span class="bill">本年累计投资(元)</span>
            <div class="bill-num">
              <span>¥ </span>
              <count-to
                :startVal="0"
                :endVal="totalYearInvestmentMoney"
                :decimals="2"
                :duration="1000"
              />
            </div>
            <div class="paymessage">
              <span class="pay">
                本月投资：¥
                <count-to
                  :startVal="0"
                  :endVal="thisYearInvestmentList[mon]"
                  :decimals="2"
                  :duration="1000"
                />
              </span>
            </div>
          </div>
          <div class="doughnutChart">
            <doughnut-chart ref="doughnutChartRef" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="pieChart"><pie-chart ref="pieChartRef"></pie-chart></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import {
  addInvestmentApi,
  deleteInvestmentApi,
  getInvestmentCategory,
  getInvestmentListApi,
  getYearInvestmentListApi,
  updateInvestmentApi
} from "@/service/main/property/property"
import { useStore } from "@/store"
import { ElForm, ElMessageBox, ElNotification } from "element-plus"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/rules"
import pieChart from "./cpns/pieChart.vue"
import doughnutChart from "./cpns/doughnutChart.vue"
import { CountTo } from "vue3-count-to"
import getYearNumList from "@/utils/getYearNumList"
export default defineComponent({
  name: "debtManage",
  components: { pieChart, doughnutChart, CountTo },
  setup() {
    onMounted(() => {
      getInvestmentList()
      getInvestmentCategoryList()
      getInvestmentMoney()
    })
    const pieChartRef = ref<InstanceType<typeof pieChart>>()
    const doughnutChartRef = ref<InstanceType<typeof doughnutChart>>()

    // 查询数据
    const searchFormData = ref({
      category: "",
      name: "",
      remark: "",
      createTime: "",
      money: ""
    })
    // 搜索
    const searchInvestment = () => {
      getInvestmentList()
    }
    // 搜索重置
    const cleanFormData = () => {
      searchFormData.value.category = ""
      searchFormData.value.remark = ""
      searchFormData.value.name = ""
      searchFormData.value.money = ""
      searchFormData.value.createTime = ""
      getInvestmentList()
    }

    let tableInvestmentData = ref([])
    // 分页
    // 每页展示条数
    const pageSize = ref(10)
    // 偏移量
    const currentPage = ref(1)
    // 数据总数
    const investmentCount = ref(0)

    // 获取收入信息列表
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data.user._id
    // 获取页面信息
    const getInvestmentList = async () => {
      const result = await getInvestmentListApi({
        userId: id,
        offset: currentPage.value,
        size: pageSize.value,
        formData: searchFormData.value
      })

      if (result.code > 0) {
        tableInvestmentData.value = result.data.list
        investmentCount.value = result.data.totalCount
      }
    }
    // 获取投资数组 getYearInvestmentListApi
    const mon = new Date().getMonth()
    const thisYearInvestmentList = ref<any>([])
    const totalYearInvestmentMoney = ref(0)
    const getInvestmentMoney = async () => {
      totalYearInvestmentMoney.value = 0
      const result = await getYearInvestmentListApi({ userId: id })
      thisYearInvestmentList.value = getYearNumList(result.data.list)
      thisYearInvestmentList.value.forEach((item: any) => {
        totalYearInvestmentMoney.value += item
      })
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getInvestmentList()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getInvestmentList()
    }
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime, "YYYY-MM-DD")
    }
    //新建收入
    const FormVisible = ref(false)
    // 获取分类数据
    const categories = ref({})
    // 添加表单数据
    const addInvestmentFormData = ref({
      userId: "",
      category: "",
      name: "",
      money: "",
      remark: "",
      createTime: "",
      age: "",
      rate: ""
    })
    // 获取类别
    const getInvestmentCategoryList = async () => {
      const result = await getInvestmentCategory()
      if (result.code > 0) {
        categories.value = result.data.categoryList
      }
    }
    const addInvestmentForm = ref<InstanceType<typeof ElForm>>()
    // 添加收入
    const addInvestment = async () => {
      addInvestmentForm.value?.validate(async (valid) => {
        if (valid) {
          addInvestmentFormData.value.userId = id
          const result = await addInvestmentApi({
            ...addInvestmentFormData.value
          })
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getInvestmentList()
            getInvestmentMoney()
            pieChartRef.value?.getChartData()
            doughnutChartRef.value?.getChartData()
            FormVisible.value = false
            addInvestmentFormData.value.category = ""
            addInvestmentFormData.value.money = ""
            addInvestmentFormData.value.remark = ""
            addInvestmentFormData.value.createTime = ""
            addInvestmentFormData.value.name = ""
            addInvestmentFormData.value.rate = ""
            addInvestmentFormData.value.age = ""
          } else {
            ElNotification({
              title: "Warning",
              message: result.data.message,
              type: "warning"
            })
          }
        }
      })
    }
    // 刷新
    const refresh = () => {
      getInvestmentList()

      ElNotification({
        title: "Success",
        message: "刷新成功",
        type: "success"
      })
    }
    // 编辑收入操作
    const editInvestmentForm = ref<InstanceType<typeof ElForm>>()
    const editInvestmentVisible = ref(false)
    const editInvestmentFormData = ref({
      category: "",
      name: "",
      money: 0,
      remark: "",
      createTime: "",
      age: "",
      rate: ""
    })
    const updateId = ref()
    // 打开编辑收入卡片
    const open = (row: any) => {
      editInvestmentVisible.value = true
      updateId.value = row._id
      editInvestmentFormData.value.name = row.name
      editInvestmentFormData.value.category = row.category
      editInvestmentFormData.value.money = row.money
      editInvestmentFormData.value.remark = row.remark
      editInvestmentFormData.value.age = row.age
      editInvestmentFormData.value.rate = row.rate
      editInvestmentFormData.value.createTime = row.createTime
    }
    // 编辑债务
    const editInvestment = () => {
      editInvestmentForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await updateInvestmentApi(updateId.value, {
            ...editInvestmentFormData.value
          })
          if (result.code > 0) {
            getInvestmentList()
            getInvestmentMoney()
            pieChartRef.value?.getChartData()
            doughnutChartRef.value?.getChartData()
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            editInvestmentVisible.value = false
          } else {
            ElNotification({
              title: "Warning",
              message: result.data.message,
              type: "warning"
            })
          }
        }
      })
    }

    // 删除收入操作
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(
        `确定要删除投资 ` + row.category + row.money,
        "请确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const deleteResult = await deleteInvestmentApi(row._id)
        if (deleteResult.code > 0) {
          pieChartRef.value?.getChartData()
          doughnutChartRef.value?.getChartData()
          ElNotification({
            title: "Success",
            message: row.category + row.money + `删除成功`,
            type: "success"
          })
        } else {
          ElNotification({
            title: "Warning",
            message: row.category + row.money + `删除失败`,
            type: "warning"
          })
        }
        getInvestmentList()
        getInvestmentMoney()
      })
    }
    //

    return {
      searchFormData,
      searchInvestment,
      categories,
      cleanFormData,
      // initChart,
      FormVisible,
      addInvestmentFormData,
      pageSize,
      currentPage,
      investmentCount,
      handleSizeChange,
      handleCurrentChange,
      getInvestmentCategoryList,
      addInvestment,
      getInvestmentList,
      tableInvestmentData,
      Search,
      RefreshRight,
      Delete,
      Edit,
      FormateCreateTime,
      refresh,
      handleDelete,
      editInvestmentFormData,
      editInvestmentForm,
      editInvestmentVisible,
      open,
      editInvestment,
      rules,
      addInvestmentForm,
      getInvestmentMoney,
      thisYearInvestmentList,
      mon,
      totalYearInvestmentMoney,
      pieChartRef,
      doughnutChartRef
    }
  }
})
</script>

<style scoped lang="less">
.investmentmanage {
  background-color: #f0f2f5;
  .search {
    background-color: #fff;
    padding: 20px;
    .el-form {
      margin-left: 10px;
    }
    .handleBtn {
      text-align: right;
      margin-top: 10px;
    }
    .el-input {
      width: 250px;
    }
  }
  .content {
    width: 100%;
    margin-top: 20px;
    background-color: #f0f2f5;
    height: 100%;
    .message {
      background-color: #fff;
      height: 100%;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 15px;
      }
      .table {
        width: 100%;
      }
      .pagination {
        .el-pagination {
          margin: 10px;
          display: flex;
          justify-content: center;
        }
        width: 100%;
      }
    }
  }
  .investmentMessage {
    width: 100%;
    margin-top: 20px;
    background-color: #ffffff;
    .debtmoney {
      background-color: #de6a66;
      height: 180px;
      padding: 30px;
      .bill {
        display: flex;
        font-size: 25px;
        color: #cacbfa;
      }
      .bill-num {
        display: flex;
        margin-top: 25px;
        font-size: 60px;
        color: #ffffff;
      }
      .paymessage {
        display: flex;
        margin-top: 25px;
        .pay {
          font-size: 25px;
          color: #ffffff;
        }
        .not-pay {
          font-size: 25px;
          margin-left: 50px;
          color: #ffffff;
        }
      }
    }
    .doughnutChart {
      padding: 10px;
    }
  }
  .pieChart {
    margin-left: 10px;
    width: 100%;
    height: 100%;
  }
}
</style>
