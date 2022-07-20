<template>
  <div class="incomemanage">
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
        <el-button type="primary" :icon="Search" @click="searchIncome"
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
              <span>收入列表</span>
              <div class="handleBtn">
                <el-button type="primary" @click="FormVisible = true"
                  >新建收入</el-button
                >
                <el-button class="refresh" @click="refresh">
                  <el-icon><refresh /></el-icon>
                </el-button>
                <!-- 添加收入弹出卡面 -->
                <el-dialog v-model="FormVisible" title="添加收入" :width="400">
                  <el-form
                    :label-width="100"
                    :model="addIncomeFormData"
                    :rules="rules"
                    ref="addIncomeForm"
                  >
                    <el-form-item label="类别:" prop="category">
                      <el-select
                        filterable
                        v-model="addIncomeFormData.category"
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
                        v-model="addIncomeFormData.money"
                      /> </el-form-item
                    ><el-form-item label="备注:" prop="remark">
                      <el-input
                        v-model="addIncomeFormData.remark"
                      /> </el-form-item
                    ><el-form-item label="创建时间:" prop="createTime">
                      <el-date-picker
                        v-model="addIncomeFormData.createTime"
                        type="date"
                        placeholder="请选择时间"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="FormVisible = false">取消</el-button>
                      <el-button type="primary" @click="addIncome"
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
              v-model="editIncomeVisible"
              title="编辑收入"
              :width="400"
            >
              <el-form
                :label-width="100"
                :model="editIncomeFormData"
                :rules="rules"
                ref="editIncomeForm"
              >
                <el-form-item label="类别:" prop="category">
                  <el-select
                    filterable
                    v-model="editIncomeFormData.category"
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
                  <el-input v-model="editIncomeFormData.money" /> </el-form-item
                ><el-form-item label="备注:" prop="remark">
                  <el-input
                    v-model="editIncomeFormData.remark"
                  /> </el-form-item
                ><el-form-item label="创建时间:" prop="createTime">
                  <el-date-picker
                    v-model="editIncomeFormData.createTime"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editIncomeVisible = false">取消</el-button>
                  <el-button type="primary" @click="editIncome">添加</el-button>
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
                :total="incomeCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="pieChart">
            <pie-chart ref="pieChartRef" />
          </div>
        </el-col>
      </el-row>
      <div class="yearMessage">
        <span>详细信息</span>
        <div class="total">
          全年收入:<span>{{ totalYearIncome }} RMB</span> 月均:
          <span>{{ (totalYearIncome / 12).toFixed(2) }} RMB</span>
        </div>
      </div>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="lineChart">
            <line-chart ref="lineChartRef"></line-chart>
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
  addIncomeApi,
  deleteIncomeApi,
  getIncomeCategory,
  getIncomeListApi,
  getYearIncomeListApi,
  updateIncomeApi
} from "@/service/main/property/property"
import { useStore } from "@/store"
import { ElForm, ElMessageBox, ElNotification } from "element-plus"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/rules"
import pieChart from "./cpns/pieChart.vue"
import lineChart from "./cpns/lineChart.vue"
import barChart from "./cpns/barChart.vue"
import getYearNumList from "@/utils/getYearNumList"
export default defineComponent({
  name: "incomeManage",
  components: {
    pieChart,
    lineChart,
    barChart
  },
  setup() {
    onMounted(() => {
      getIncomeCategoryList()
      getIncomeList()
      getYearIncome()
    })

    // 查询数据
    const searchFormData = ref({
      category: "",
      money: "",
      remark: "",
      createTime: ""
    })
    // 搜索
    const searchIncome = () => {
      getIncomeList()
    }
    // 搜索重置
    const cleanFormData = () => {
      searchFormData.value.category = ""
      searchFormData.value.remark = ""
      searchFormData.value.createTime = ""
      searchFormData.value.money = ""
      getIncomeList()
    }

    const tableData = ref([])
    // 分页
    // 每页展示条数
    const pageSize = ref(10)
    // 偏移量
    const currentPage = ref(1)
    // 数据总数
    const incomeCount = ref(0)

    // 获取收入信息列表
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data._id
    // 获取页面信息
    const getIncomeList = async () => {
      const result = await getIncomeListApi({
        userId: id,
        offset: currentPage.value,
        size: pageSize.value,
        formData: searchFormData.value
      })
      if (result.code > 0) {
        tableData.value = result.data.incomeList
        incomeCount.value = result.data.totalCount
      }
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getIncomeList()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getIncomeList()
    }
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime, "YYYY-MM-DD")
    }
    const pieChartRef = ref<InstanceType<typeof pieChart>>()
    const lineChartRef = ref<InstanceType<typeof lineChart>>()
    const barChartRef = ref<InstanceType<typeof barChart>>()

    //新建收入
    const FormVisible = ref(false)
    // 获取收入分类数据
    const categories = ref({})
    // 添加收入表单数据
    const addIncomeFormData = ref({
      userId: "",
      category: "",
      money: 0,
      remark: "",
      createTime: ""
    })
    // 获取收入类别
    const getIncomeCategoryList = async () => {
      const result = await getIncomeCategory()
      if (result.code > 0) {
        categories.value = result.data.categoryList
      }
    }
    const refreshChartData = ref(false)

    const addIncomeForm = ref<InstanceType<typeof ElForm>>()
    // 添加收入
    const addIncome = async () => {
      addIncomeForm.value?.validate(async (valid) => {
        if (valid) {
          addIncomeFormData.value.userId = id
          const result = await addIncomeApi({ ...addIncomeFormData.value })
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getIncomeList()
            getYearIncome()
            pieChartRef.value?.getChartData()
            lineChartRef.value?.getChartData()
            barChartRef.value?.getChartData()
            refreshChartData.value = true
            FormVisible.value = false
            addIncomeFormData.value.category = ""
            addIncomeFormData.value.money = 0
            addIncomeFormData.value.remark = ""
            addIncomeFormData.value.createTime = ""
          } else {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "warning"
            })
          }
        }
      })
    }
    // 刷新
    const refresh = () => {
      getIncomeList()
    }
    // 编辑收入操作
    const editIncomeForm = ref<InstanceType<typeof ElForm>>()
    const editIncomeVisible = ref(false)
    const editIncomeFormData = ref({
      category: "",
      money: 0,
      remark: "",
      createTime: ""
    })
    const updateId = ref()
    // 打开边界收入卡片
    const open = (row: any) => {
      editIncomeVisible.value = true
      updateId.value = row._id
      editIncomeFormData.value.category = row.category
      editIncomeFormData.value.money = row.money
      editIncomeFormData.value.remark = row.remark
      editIncomeFormData.value.createTime = row.createTime
    }
    const editIncome = () => {
      editIncomeForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await updateIncomeApi(updateId.value, {
            ...editIncomeFormData.value
          })
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getIncomeList()
            getYearIncome()
            pieChartRef.value?.getChartData()
            lineChartRef.value?.getChartData()
            barChartRef.value?.getChartData()
            editIncomeVisible.value = false
          } else {
            ElNotification({
              title: "Success",
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
        `确定要删除收入 ` + row.category + row.money,
        "请确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const deleteResult = await deleteIncomeApi(row._id)
        // console.log(deleteResult)
        if (deleteResult.code > 0) {
          pieChartRef.value?.getChartData()
          lineChartRef.value?.getChartData()
          barChartRef.value?.getChartData()
          ElNotification({
            title: "Success",
            message: row.category + row.money + `删除成功`,
            type: "success"
          })
        } else {
          ElNotification({
            title: "Success",
            message: row.category + row.money + `删除失败`,
            type: "warning"
          })
        }
        getIncomeList()
        getYearIncome()
      })
    }
    // 获取一年收入
    // totalYearIncome
    const totalYearIncome = ref(0)
    const getYearIncome = async () => {
      totalYearIncome.value = 0
      const result = await getYearIncomeListApi({ userId: id })
      const listData = getYearNumList(result)
      for (let i = 0; i < listData.length; i++) {
        totalYearIncome.value += listData[i]
      }
      return totalYearIncome.value
    }

    return {
      searchFormData,
      searchIncome,
      categories,
      cleanFormData,
      // initChart,
      FormVisible,
      addIncomeFormData,
      pageSize,
      currentPage,
      incomeCount,
      handleSizeChange,
      handleCurrentChange,
      getIncomeCategoryList,
      addIncome,
      getIncomeList,
      tableData,
      Search,
      RefreshRight,
      Delete,
      Edit,
      FormateCreateTime,
      refresh,
      handleDelete,
      editIncomeFormData,
      editIncomeForm,
      editIncomeVisible,
      open,
      editIncome,
      rules,
      addIncomeForm,
      getYearIncome,
      totalYearIncome,
      refreshChartData,
      pieChartRef,
      lineChartRef,
      barChartRef
    }
  }
})
</script>

<style scoped lang="less">
.incomemanage {
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
    .pieChart {
      background-color: #fff;
      margin-left: 10px;
      width: 100%;
      height: 500px;
      padding: 15px;
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
    .lineChart {
      padding: 15px;
      background-color: #fff;
      width: 100%;
    }
    .barChart {
      padding: 15px;
      background-color: #fff;
      width: 100%;
    }
  }
}
</style>
