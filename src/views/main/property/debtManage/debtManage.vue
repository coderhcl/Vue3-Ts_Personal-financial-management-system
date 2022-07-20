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
            <el-form-item label="名称">
              <el-input
                placeholder="请输入债务名称"
                v-model="searchFormData.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期时间">
              <el-date-picker
                v-model="searchFormData.expirationTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否还清">
              <el-select
                filterable
                v-model="searchFormData.mark"
                placeholder="请选择"
              >
                <el-option label="已还清" :value="1" />
                <el-option label="未还清" :value="2" />
              </el-select>
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
        <el-button type="primary" :icon="Search" @click="searchDebt"
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
              <span>债务列表</span>
              <div class="handleBtn">
                <el-button type="primary" @click="FormVisible = true">
                  添加债务
                </el-button>
                <el-button class="refresh" @click="refresh">
                  <el-icon><refresh /></el-icon>
                </el-button>
                <!-- 添加债务弹出卡面 -->
                <el-dialog
                  v-model="FormVisible"
                  title="添加债务详情"
                  :width="400"
                >
                  <el-form
                    :label-width="100"
                    :model="addDebtFormData"
                    :rules="rules"
                    ref="addDebtForm"
                  >
                    <el-form-item label="类别:" prop="category">
                      <el-select
                        filterable
                        v-model="addDebtFormData.category"
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
                      <el-input v-model="addDebtFormData.name" />
                    </el-form-item>

                    <el-form-item label="金钱:" prop="money">
                      <el-input v-model="addDebtFormData.money" />
                    </el-form-item>

                    <el-form-item label="备注:" prop="remark">
                      <el-input v-model="addDebtFormData.remark" />
                    </el-form-item>

                    <el-form-item label="贷款时间:" prop="createTime">
                      <el-date-picker
                        v-model="addDebtFormData.createTime"
                        type="date"
                        placeholder="请选择时间"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item label="到期时间:" prop="expirationTime">
                      <el-date-picker
                        v-model="addDebtFormData.expirationTime"
                        type="date"
                        placeholder="请选择时间"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="FormVisible = false">取消</el-button>
                      <el-button type="primary" @click="addDebt"
                        >添加</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </div>
            </div>
            <div class="table">
              <el-table :data="tableDebtData" border stripe size="small">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="category"
                  label="类别"
                  align="center"
                  width="130"
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
                  width="130"
                />
                <el-table-column label="是否还清" align="center" width="150">
                  <template v-slot="scope">
                    <el-switch
                      @click="changeSelect(scope.row)"
                      v-model="scope.row.mark"
                      size="large"
                      inline-prompt
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                      :active-value="1"
                      :inactive-value="2"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center"
                  width="190"
                />
                <el-table-column
                  sortable
                  prop="createTime"
                  label="创建时间"
                  align="center"
                  ref="createTime"
                  width="200"
                  :formatter="FormateCreateTime"
                />
                <el-table-column
                  sortable
                  prop="expirationTime"
                  label="到期时间"
                  align="center"
                  ref="expirationTime"
                  width="180"
                  :formatter="FormateExpirationTime"
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
            <el-dialog v-model="editDebtVisible" title="编辑债务" :width="400">
              <el-form
                :label-width="100"
                :model="editDebtFormData"
                :rules="rules"
                ref="editDebtForm"
              >
                <el-form-item label="类别:" prop="category">
                  <el-select
                    filterable
                    v-model="editDebtFormData.category"
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
                  <el-input v-model="editDebtFormData.name" />
                </el-form-item>
                <el-form-item label="金钱:" prop="money">
                  <el-input v-model="editDebtFormData.money" /> </el-form-item
                ><el-form-item label="备注:" prop="remark">
                  <el-input v-model="editDebtFormData.remark" /> </el-form-item
                ><el-form-item label="是否已还:">
                  <el-switch
                    v-model="editDebtFormData.mark"
                    size="large"
                    inline-prompt
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
                <el-form-item label="创建时间:" prop="createTime">
                  <el-date-picker
                    v-model="editDebtFormData.createTime"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="到期时间:" prop="expirationTime">
                  <el-date-picker
                    v-model="editDebtFormData.expirationTime"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDebtVisible = false">取消</el-button>
                  <el-button type="primary" @click="editDebt">添加</el-button>
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
                :total="debtCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="debtMessage">
      <el-row>
        <el-col :span="12">
          <div class="debtmoney">
            <span class="bill">本期账单(元)</span>
            <div class="bill-num">
              <span>¥ </span>
              <count-to
                :startVal="0"
                :endVal="totalPayMoney + totalNotPayMoney"
                :decimals="2"
                :duration="1000"
              />
            </div>
            <div class="paymessage">
              <span class="pay">
                本期已还：¥
                <count-to
                  :startVal="0"
                  :endVal="totalPayMoney"
                  :decimals="2"
                  :duration="1000"
                />
              </span>
              <span class="not-pay">
                本期未还：¥
                <count-to
                  :startVal="0"
                  :endVal="totalNotPayMoney"
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
          <div class="pieChart">
            <pie-chart ref="pieChartRef" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import {
  addDebtApi,
  deleteDebtApi,
  getDebtCategory,
  getDebtListApi,
  getYearDebtListApi,
  updateDebtApi
} from "@/service/main/property/property"
import { useStore } from "@/store"
import { ElForm, ElMessageBox, ElNotification } from "element-plus"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/rules"
import pieChart from "./cpns/pieChart.vue"
import doughnutChart from "./cpns/doughnutChart.vue"
import { CountTo } from "vue3-count-to"
export default defineComponent({
  name: "debtManage",
  components: { pieChart, doughnutChart, CountTo },
  setup() {
    onMounted(() => {
      getDebtList()
      getDebtCategoryList()
      getPayDebt()
      getNotPayDebt()
    })
    const pieChartRef = ref<InstanceType<typeof pieChart>>()
    const doughnutChartRef = ref<InstanceType<typeof doughnutChart>>()

    // 查询数据
    const searchFormData = ref({
      category: "",
      name: "",
      remark: "",
      expirationTime: "",
      mark: ""
    })
    // 搜索
    const searchDebt = () => {
      getDebtList()
    }
    // 搜索重置
    const cleanFormData = () => {
      searchFormData.value.category = ""
      searchFormData.value.remark = ""
      searchFormData.value.name = ""
      searchFormData.value.mark = ""
      searchFormData.value.expirationTime = ""
      getDebtList()
    }

    let tableDebtData = ref([])
    // 分页
    // 每页展示条数
    const pageSize = ref(10)
    // 偏移量
    const currentPage = ref(1)
    // 数据总数
    const debtCount = ref(0)

    // 获取收入信息列表
    const store = useStore()
    // 获取当前用户id
    const id = store.state.login.userInfo.data.user._id
    // 获取页面信息
    const getDebtList = async () => {
      const result = await getDebtListApi({
        userId: id,
        offset: currentPage.value,
        size: pageSize.value,
        formData: searchFormData.value
      })

      if (result.code > 0) {
        tableDebtData.value = result.data.list
        debtCount.value = result.data.totalCount
      }
    }
    // 获取债务钱
    const totalPayMoney = ref(0)
    const totalNotPayMoney = ref(0)

    const getPayDebt = async () => {
      const result = await getYearDebtListApi({ userId: id })
      totalPayMoney.value = result.payNum
    }
    const getNotPayDebt = async () => {
      const result = await getYearDebtListApi({ userId: id })
      totalNotPayMoney.value = result.notPayNum
    }

    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getDebtList()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getDebtList()
    }
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime, "YYYY-MM-DD")
    }
    const FormateExpirationTime = (row: any) => {
      return parseDate(row.expirationTime, "YYYY-MM-DD")
    }
    //新建收入
    const FormVisible = ref(false)
    // 获取收入分类数据
    const categories = ref({})
    // 添加收入表单数据
    const addDebtFormData = ref({
      userId: "",
      category: "",
      name: "",
      money: "",
      remark: "",
      createTime: "",
      expirationTime: ""
    })
    // 获取债务类别
    const getDebtCategoryList = async () => {
      const result = await getDebtCategory()
      if (result.code > 0) {
        categories.value = result.data.categoryList
      }
    }
    const addDebtForm = ref<InstanceType<typeof ElForm>>()
    // 添加
    const addDebt = async () => {
      addDebtForm.value?.validate(async (valid) => {
        if (valid) {
          addDebtFormData.value.userId = id
          const result = await addDebtApi({ ...addDebtFormData.value })
          if (result.code > 0) {
            getPayDebt()
            getNotPayDebt()
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getDebtList()
            pieChartRef.value?.getChartData()
            doughnutChartRef.value?.getChartData()

            FormVisible.value = false
            addDebtFormData.value.category = ""
            addDebtFormData.value.money = ""
            addDebtFormData.value.remark = ""
            addDebtFormData.value.createTime = ""
            addDebtFormData.value.name = ""
            addDebtFormData.value.expirationTime = ""
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
      getDebtList()
      getPayDebt()
      getNotPayDebt()
    }
    // 编辑收入操作
    const editDebtForm = ref<InstanceType<typeof ElForm>>()
    const editDebtVisible = ref(false)
    const editDebtFormData = ref({
      category: "",
      name: "",
      money: 0,
      remark: "",
      mark: "",
      createTime: "",
      expirationTime: ""
    })
    const updateId = ref()
    // 打开编辑收入卡片
    const open = (row: any) => {
      editDebtVisible.value = true
      updateId.value = row._id
      editDebtFormData.value.name = row.name
      editDebtFormData.value.category = row.category
      editDebtFormData.value.money = row.money
      editDebtFormData.value.remark = row.remark
      editDebtFormData.value.mark = row.mark
      editDebtFormData.value.createTime = row.createTime
      editDebtFormData.value.expirationTime = row.expirationTime
    }
    // 编辑债务
    const editDebt = () => {
      editDebtForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await updateDebtApi(updateId.value, {
            ...editDebtFormData.value
          })
          if (result.code > 0) {
            getDebtList()
            pieChartRef.value?.getChartData()
            doughnutChartRef.value?.getChartData()
            getPayDebt()
            getNotPayDebt()
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            editDebtVisible.value = false
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
    // 改变是否已还清操作
    const changeSelect = async (row: any) => {
      updateId.value = row._id
      editDebtFormData.value.name = row.name
      editDebtFormData.value.category = row.category
      editDebtFormData.value.money = row.money
      editDebtFormData.value.remark = row.remark
      editDebtFormData.value.mark = row.mark
      editDebtFormData.value.createTime = row.createTime
      editDebtFormData.value.expirationTime = row.expirationTime
      const result = await updateDebtApi(updateId.value, {
        ...editDebtFormData.value
      })
      if (result.code > 0) {
        ElNotification({
          title: "Success",
          message: "操作成功",
          type: "success"
        })
        getDebtList()
        pieChartRef.value?.getChartData()
        doughnutChartRef.value?.getChartData()
        getPayDebt()
        getNotPayDebt()
      }
    }
    // 删除收入操作
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(
        `确定要删除债务 ` + row.category + row.money,
        "请确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const deleteResult = await deleteDebtApi(row._id)
        if (deleteResult.code > 0) {
          pieChartRef.value?.getChartData()
          doughnutChartRef.value?.getChartData()
          getPayDebt()
          getNotPayDebt()
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
        getDebtList()
      })
    }
    //

    return {
      searchFormData,
      searchDebt,
      categories,
      cleanFormData,
      // initChart,
      FormVisible,
      addDebtFormData,
      pageSize,
      currentPage,
      debtCount,
      handleSizeChange,
      handleCurrentChange,
      getDebtCategoryList,
      addDebt,
      getDebtList,
      tableDebtData,
      Search,
      RefreshRight,
      Delete,
      Edit,
      FormateCreateTime,
      FormateExpirationTime,
      refresh,
      handleDelete,
      editDebtFormData,
      changeSelect,
      editDebtForm,
      editDebtVisible,
      open,
      editDebt,
      rules,
      addDebtForm,
      getPayDebt,
      totalPayMoney,
      totalNotPayMoney,
      getNotPayDebt,
      pieChartRef,
      doughnutChartRef
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
  .debtMessage {
    width: 100%;
    margin-top: 20px;
    background-color: #ffffff;
    .debtmoney {
      background-color: #9698f5;
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
          font-size: 20px;
          color: #ffffff;
        }
        .not-pay {
          font-size: 20px;
          margin-left: 15px;
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
