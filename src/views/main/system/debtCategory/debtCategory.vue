<template>
  <div class="debtCategory">
    <div class="search">
      <el-form :model="formData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类">
              <el-input
                placeholder="请输入分类名称"
                v-model="formData.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请选择时间">
              <el-date-picker
                v-model="formData.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="handleBtn">
        <el-button type="primary" :icon="Search" @click="searchCategory"
          >搜索</el-button
        >
        <el-button :icon="RefreshRight" @click="cleanFormData">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <span>债务分类列表</span>
        <div class="handleBtn">
          <el-button type="primary" @click="debtFormVisible = true"
            >新建分类</el-button
          >
          <el-button class="refresh" @click="refresh">
            <el-icon><refresh /></el-icon>
          </el-button>
          <!-- 弹出卡面 -->
          <el-dialog v-model="debtFormVisible" title="添加新分类" :width="400">
            <el-form
              :label-width="80"
              :model="addCategoryFormData"
              :rules="rules"
              ref="addCategoryForm"
            >
              <el-form-item label="分类" prop="name">
                <el-input v-model="addCategoryFormData.name" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="debtFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addCategory">添加</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
      <el-table border :data="debtTableData" stripe>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column prop="name" label="分类" align="center" width="180" />
        <el-table-column
          sortable
          prop="createTime"
          label="创建时间"
          align="center"
          ref="createTime"
          :formatter="FormateCreateTime"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="updateTime"
          label="更新时间"
          align="center"
          :formatter="FormateUpdateTime"
        />
        <el-table-column fixed="right" label="操作" align="center">
          <template v-slot="scope">
            <el-button
              type="text"
              size="small"
              :icon="Edit"
              @click="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              :icon="Delete"
              class="delete"
              @click="handleDeleteCategory(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出卡面 -->
      <el-dialog v-model="editCategoryVisible" title="编辑分类" :width="400">
        <el-form
          :label-width="80"
          :model="editCategoryFormData"
          :rules="rules"
          ref="aditCategoryForm"
        >
          <el-form-item label="分类" prop="name">
            <el-input v-model="editCategoryFormData.name" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editCategoryVisible = false">取消</el-button>
            <el-button type="primary" @click="editCategory">更改</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[4, 6, 8, 12]"
          small
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="categoryCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue"
import clForm from "@/base-ui/form"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import {
  addDebtCategoryData,
  deleteDebtCategory,
  getPageListData,
  updateDebtCategory
} from "@/service/main/system/system"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/addCategoryRoules"
import { ElForm, ElMessage, ElMessageBox, ElNotification } from "element-plus"

export default defineComponent({
  name: "debtCategory",
  setup() {
    onMounted(() => {
      getCategoryList()
    })
    // 查询数据
    const formData = ref({
      name: "",
      createTime: ""
    })
    // table数据
    const debtTableData = ref([])
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime)
    }
    const FormateUpdateTime = (row: any) => {
      return parseDate(row.updateTime)
    }
    // 搜索
    // 每页展示条数
    const pageSize = ref(8)
    // 偏移量
    const currentPage = ref(1)
    // 获取页面数据
    const getCategoryList = async () => {
      const pageResult = await getPageListData("/debt/category/list", {
        offset: currentPage.value,
        size: pageSize.value,
        formData: formData.value
      })
      if (pageResult.code > 0) {
        categoryCount.value = pageResult.data.totalCount
        debtTableData.value = pageResult.data.list
      }
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      searchCategory()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      searchCategory()
    }

    const categoryCount = ref(0)
    // 搜索功能

    const searchCategory = async () => {
      getCategoryList()
    }

    // 重置
    const cleanFormData = () => {
      formData.value.name = ""
      formData.value.createTime = ""
      getCategoryList()
    }

    // 添加分类数据
    const debtFormVisible = ref(false)
    const addCategoryFormData = ref({
      name: ""
    })
    const addCategoryForm = ref<InstanceType<typeof ElForm>>()
    // 添加分类函数实现
    const addCategory = async () => {
      addCategoryForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await addDebtCategoryData({
            ...addCategoryFormData.value
          })
          // console.log(result)
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getCategoryList()
            addCategoryFormData.value.name = ""
            debtFormVisible.value = false
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
    const refresh = () => {
      getCategoryList()
    }

    // 编辑分类
    const aditCategoryForm = ref<InstanceType<typeof ElForm>>()
    const editCategoryVisible = ref(false)
    const editCategoryFormData = ref({
      name: "",
      updateTime: ""
    })
    const updateId = ref("")
    const openEdit = (row: any) => {
      updateId.value = row._id
      editCategoryFormData.value.name = row.name
      editCategoryVisible.value = true
    }
    // 确认更改操作
    const editCategory = async () => {
      aditCategoryForm.value?.validate(async (valid) => {
        if (valid) {
          editCategoryFormData.value.updateTime = new Date().toISOString()
          const result = await updateDebtCategory(updateId.value, {
            ...editCategoryFormData.value
          })
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getCategoryList()
            editCategoryVisible.value = false
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
    // 删除分类
    const handleDeleteCategory = (row: any) => {
      ElMessageBox.confirm(`确定要删除分类 ` + row.name, "请确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const deleteCategoryResult = await deleteDebtCategory(row._id)
        if (deleteCategoryResult.code > 0) {
          ElNotification({
            title: "Success",
            message: row.name + `删除成功`,
            type: "success"
          })
        } else {
          ElNotification({
            title: "Warning",
            message: row.name + `删除失败`,
            type: "warning"
          })
        }
        getCategoryList()
      })
    }
    return {
      clForm,
      Search,
      RefreshRight,
      Edit,
      Delete,
      debtTableData,
      parseDate,
      FormateCreateTime,
      FormateUpdateTime,
      formData,
      cleanFormData,
      searchCategory,
      debtFormVisible,
      addCategoryFormData,
      addCategory,
      rules,
      addCategoryForm,
      refresh,
      editCategoryVisible,
      aditCategoryForm,
      editCategoryFormData,
      editCategory,
      openEdit,
      updateId,
      updateDebtCategory,
      handleDeleteCategory,
      pageSize,
      currentPage,
      handleSizeChange,
      handleCurrentChange,
      categoryCount
    }
  }
})
</script>

<style scoped lang="less">
.search {
  padding: 20px;
  .el-form {
    margin-left: 10px;
  }
  .handleBtn {
    text-align: right;
    padding: 0 50px 0 0;
  }
  .el-input {
    width: 250px;
  }
}
.content {
  margin-top: 30px;
  border-top: 20px solid #f0f2f5;
  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    padding: 0 10px 0 10px;
  }
  .delete {
    color: #b33131;
  }
  .pagination {
    width: 100%;
    height: 40px;
    margin-top: 15px;
    .el-pagination {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
