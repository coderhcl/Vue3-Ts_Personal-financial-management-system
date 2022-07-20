<template>
  <div class="expensemanage">
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
            <el-form-item label="金钱">
              <el-input
                placeholder="请输入金钱"
                v-model="searchFormData.money"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请选择时间">
              <el-date-picker
                v-model="searchFormData.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
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
        <el-button type="primary" :icon="Search" @click="searchExpense"
          >搜索</el-button
        >
        <el-button :icon="RefreshRight" @click="cleanFormData">重置</el-button>
      </div>
    </div>
    <div class="content">
      <el-row>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="message">
            <div class="title">
              <span>支出列表</span>
              <div class="handleBtn">
                <el-button type="primary" @click="FormVisible = true"
                  >添加支出</el-button
                >
                <el-button class="refresh" @click="refresh">
                  <el-icon><refresh /></el-icon>
                </el-button>
                <!-- 添加收入弹出卡面 -->
                <el-dialog v-model="FormVisible" title="添加支出" :width="400">
                  <el-form
                    :label-width="100"
                    :model="addExpenseFormData"
                    :rules="rules"
                    ref="addExpenseForm"
                  >
                    <el-form-item label="类别:" prop="category">
                      <el-select
                        filterable
                        v-model="addExpenseFormData.category"
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
                    <el-form-item label="金钱:" prop="money">
                      <el-input
                        v-model="addExpenseFormData.money"
                      /> </el-form-item
                    ><el-form-item label="备注:" prop="remark">
                      <el-input
                        v-model="addExpenseFormData.remark"
                      /> </el-form-item
                    ><el-form-item label="创建时间:" prop="createTime">
                      <el-date-picker
                        v-model="addExpenseFormData.createTime"
                        type="date"
                        placeholder="请选择时间"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="FormVisible = false">取消</el-button>
                      <el-button type="primary" @click="addExpense"
                        >添加</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </div>
            </div>
            <div class="table">
              <el-table border :data="tableData" stripe size="small">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="55"
                ></el-table-column>
                <el-table-column
                  prop="category"
                  label="类别"
                  align="center"
                  width="100"
                />
                <el-table-column
                  sortable
                  prop="money"
                  label="金钱"
                  align="center"
                  width="100"
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center"
                  width="180"
                />
                <el-table-column
                  sortable
                  prop="createTime"
                  label="创建时间"
                  align="center"
                  ref="createTime"
                  :formatter="FormateCreateTime"
                >
                </el-table-column>
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
              v-model="editExpenseVisible"
              title="编辑支出"
              :width="400"
            >
              <el-form
                :label-width="100"
                :model="editExpenseFormData"
                :rules="rules"
                ref="editExpenseForm"
              >
                <el-form-item label="类别:" prop="category">
                  <el-select
                    filterable
                    v-model="editExpenseFormData.category"
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
                <el-form-item label="金钱:" prop="money">
                  <el-input
                    v-model="editExpenseFormData.money"
                  /> </el-form-item
                ><el-form-item label="备注:" prop="remark">
                  <el-input
                    v-model="editExpenseFormData.remark"
                  /> </el-form-item
                ><el-form-item label="创建时间:" prop="createTime">
                  <el-date-picker
                    v-model="editExpenseFormData.createTime"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editExpenseVisible = false"
                    >取消</el-button
                  >
                  <el-button type="primary" @click="editExpense"
                    >添加</el-button
                  >
                </span>
              </template>
            </el-dialog>
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:currentPage="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[9, 10, 11, 12]"
                small
                :background="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="expenseCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="lineChart">
            <line-chart ref="lineChartRef"></line-chart>
          </div>
        </el-col>
      </el-row>
      <div class="yearMessage">
        <span>详细信息</span>
        <div class="total">
          全年支出:<span>{{ totalYearExpense }} RMB</span> 月均:
          <span>{{ (totalYearExpense / 12).toFixed(2) }} RMB</span>
        </div>
      </div>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="nightingaleChart">
            <nightingale-chart ref="nightingaleChartRef"></nightingale-chart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="barChart">
            <bar-chart ref="barChartRef"></bar-chart>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import {
  addExpenseApi,
  deleteExpenseApi,
  getExpenseCategory,
  getExpenseListApi,
  getYearExpenseListApi,
  updateExpenseApi
} from "@/service/main/property/property"
import { useStore } from "@/store"
import { ElForm, ElMessage, ElMessageBox, ElNotification } from "element-plus"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/rules"
import nightingaleChart from "./cpns/nightingaleChart.vue"
import lineChart from "./cpns/lineChart.vue"
import barChart from "./cpns/barChart.vue"
import getYearNumList from "@/utils/getYearNumList"
export default defineComponent({
  name: "expenseManage",
  components: {
    nightingaleChart,
    lineChart,
    barChart
  },
  setup() {
    onMounted(() => {
      getExpenseCategoryList()
      getExpenseList()
      getYearExpense()
    })
    const nightingaleChartRef = ref<InstanceType<typeof nightingaleChart>>()
    const lineChartRef = ref<InstanceType<typeof lineChart>>()
    const barChartRef = ref<InstanceType<typeof barChart>>()

    // 查询数据
    const searchFormData = ref({
      category: "",
      money: "",
      remark: "",
      createTime: ""
    })
    // 搜索
    const searchExpense = () => {
      getExpenseList()
    }
    // 搜索重置
    const cleanFormData = () => {
      searchFormData.value.category = ""
      searchFormData.value.remark = ""
      searchFormData.value.createTime = ""
      searchFormData.value.money = ""
      getExpenseList()
    }

    const tableData = ref([])
    // 分页
    // 每页展示条数
    const pageSize = ref(11)
    // 偏移量
    const currentPage = ref(1)
    // 数据总数
    const expenseCount = ref(0)

    // 获取收入信息列表
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data._id
    // 获取页面信息
    const getExpenseList = async () => {
      const result = await getExpenseListApi({
        userId: id,
        offset: currentPage.value,
        size: pageSize.value,
        formData: searchFormData.value
      })
      if (result.code > 0) {
        tableData.value = result.data.incomeList
        expenseCount.value = result.data.totalCount
      }
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getExpenseList()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getExpenseList()
    }
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime, "YYYY-MM-DD")
    }
    //新建收入
    const FormVisible = ref(false)
    // 获取收入分类数据
    const categories = ref({})
    // 添加收入表单数据
    const addExpenseFormData = ref({
      userId: "",
      category: "",
      money: 0,
      remark: "",
      createTime: ""
    })
    // 获取收入类别
    const getExpenseCategoryList = async () => {
      const result = await getExpenseCategory()
      if (result.code > 0) {
        categories.value = result.data.categoryList
      }
    }
    const addExpenseForm = ref<InstanceType<typeof ElForm>>()
    // 添加收入
    const addExpense = async () => {
      addExpenseForm.value?.validate(async (valid) => {
        if (valid) {
          addExpenseFormData.value.userId = id
          const result = await addExpenseApi({ ...addExpenseFormData.value })
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getExpenseList()
            getYearExpense()
            nightingaleChartRef.value?.getChartData()
            lineChartRef.value?.getChartData()
            barChartRef.value?.getChartData()
            FormVisible.value = false
            addExpenseFormData.value.category = ""
            addExpenseFormData.value.money = 0
            addExpenseFormData.value.remark = ""
            addExpenseFormData.value.createTime = ""
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
      getExpenseList()
    }
    // 编辑收入操作
    const editExpenseForm = ref<InstanceType<typeof ElForm>>()
    const editExpenseVisible = ref(false)
    const editExpenseFormData = ref({
      category: "",
      money: 0,
      remark: "",
      createTime: ""
    })
    const updateId = ref()
    // 打开边界收入卡片
    const open = (row: any) => {
      editExpenseVisible.value = true
      updateId.value = row._id
      editExpenseFormData.value.category = row.category
      editExpenseFormData.value.money = row.money
      editExpenseFormData.value.remark = row.remark
      editExpenseFormData.value.createTime = row.createTime
    }
    // 编辑操作
    const editExpense = () => {
      editExpenseForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await updateExpenseApi(updateId.value, {
            ...editExpenseFormData.value
          })
          if (result.code > 0) {
            nightingaleChartRef.value?.getChartData()
            lineChartRef.value?.getChartData()
            barChartRef.value?.getChartData()
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getExpenseList()
            getYearExpense()
            editExpenseVisible.value = false
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
        `确定要删除支出 ` + row.category + row.money,
        "请确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const deleteResult = await deleteExpenseApi(row._id)
        if (deleteResult.code > 0) {
          nightingaleChartRef.value?.getChartData()
          lineChartRef.value?.getChartData()
          barChartRef.value?.getChartData()
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
        getExpenseList()
        getYearExpense()
      })
    }
    // 获取一年收入
    // totalYearIncome
    const totalYearExpense = ref(0)
    const getYearExpense = async () => {
      totalYearExpense.value = 0
      const result = await getYearExpenseListApi({ userId: id })
      const listData = getYearNumList(result)

      for (let i = 0; i < listData.length; i++) {
        totalYearExpense.value += listData[i]
      }
      return totalYearExpense.value
    }

    return {
      searchFormData,
      searchExpense,
      categories,
      cleanFormData,
      // initChart,
      FormVisible,
      addExpenseFormData,
      pageSize,
      currentPage,
      expenseCount,
      handleSizeChange,
      handleCurrentChange,
      getExpenseCategoryList,
      addExpense,
      getExpenseList,
      tableData,
      Search,
      RefreshRight,
      Delete,
      Edit,
      FormateCreateTime,
      refresh,
      handleDelete,
      editExpenseFormData,
      editExpenseForm,
      editExpenseVisible,
      open,
      editExpense,
      rules,
      addExpenseForm,
      getYearExpense,
      totalYearExpense,
      barChartRef,
      nightingaleChartRef,
      lineChartRef
    }
  }
})
</script>

<style scoped lang="less">
.expensemanage {
  background-color: #f0f2f5;
  .search {
    padding: 10px;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    .el-form {
      margin-left: 10px;
      margin-right: 10px;
    }
    .handleBtn {
      text-align: right;
      margin-top: 10px;
      margin-right: 20px;
    }
    .el-input {
      width: 250px;
    }
  }
  .content {
    margin-top: 20px;
    background-color: #f0f2f5;
    height: 500px;
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
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }
        width: 100%;
      }
    }
    .lineChart {
      margin-left: 10px;
      background-color: #fff;
      width: 100%;
    }

    .yearMessage {
      padding: 15px;
      margin-top: 10px;
      width: 100%;
      height: 30px;
      background-color: #fff;
      display: flex;
      border-left: 6px solid #91cc75;
      span {
        line-height: 50px;
        font-size: 25px;
        margin-left: 10px;
        color: grey;
      }
      .total {
        font-size: 25px;
        color: #ee6666;
        margin-left: 130px;
        span {
          margin-right: 50px;
        }
        &:hover {
          color: grey;
          span {
            font-size: 40px;
            color: #ee6666;
          }
        }
      }
    }
    .nightingaleChart {
      background-color: #fff;
      padding: 15px;
    }
    .barChart {
      background-color: #fff;
      width: 100%;
    }
  }
}
</style>
