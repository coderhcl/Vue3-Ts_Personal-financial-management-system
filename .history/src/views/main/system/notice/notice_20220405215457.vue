<template>
  <div class="incomeCategory">
    <div class="search">
      <el-form :model="formData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题">
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
        <span>公告列表</span>
        <div class="handleBtn">
          <el-button type="primary" @click="categoryFormVisible = true"
            >新建公告</el-button
          >
          <el-button class="refresh" @click="refresh">
            <el-icon><refresh /></el-icon>
          </el-button>
          <!-- 弹出卡面 -->
          <el-dialog
            v-model="categoryFormVisible"
            title="添加公告"
            :width="800"
          >
            <el-form
              :label-width="100"
              :model="addNoticeFormData"
              :rules="rules"
              ref="addCategoryForm"
            >
              <el-form-item label="标题" prop="name">
                <el-input v-model="addNoticeFormData.title" />
              </el-form-item>
              <el-form-item label="内容">
                <el-input type="textarea" v-model="addNoticeFormData.content" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="categoryFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addCategory">添加</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
      <el-table border :data="TableData" stripe>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column prop="title" label="标题" align="center" width="200" />
        <el-table-column
          prop="content"
          label="内容"
          align="center"
          width="500"
        />

        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          ref="createTime"
          :width="240"
          :formatter="FormateCreateTime"
        >
        </el-table-column>

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
          :model="aditCategoryFormData"
          :rules="rules"
          ref="aditCategoryForm"
        >
          <el-form-item label="分类" prop="name">
            <el-input v-model="aditCategoryFormData.name" />
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
  addNoticeData,
  deleteNotice,
  getPageListData,
  update
} from "@/service/main/system/system"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/addCategoryRoules"
import { ElForm, ElMessage, ElMessageBox } from "element-plus"

export default defineComponent({
  name: "notice",
  components: {},
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
    const TableData = ref([])
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
      const pageResult = await getPageListData("/investment/category/list", {
        offset: currentPage.value,
        size: pageSize.value,
        formData: formData.value
      })
      if (pageResult.code > 0) {
        categoryCount.value = pageResult.data.totalCount
        TableData.value = pageResult.data.list
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

    // 添加公告数据
    const categoryFormVisible = ref(false)
    const addNoticeFormData = ref({
      title: "",
      content: ""
    })
    const addCategoryForm = ref<InstanceType<typeof ElForm>>()
    // 添加分类函数实现
    const addCategory = async () => {
      addCategoryForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await addInvestmentCategoryData({
            ...addNoticeFormData.value
          })
          // console.log(result)
          if (result.code > 0) {
            ElMessage({
              message: result.data.message,
              type: "success"
            })
            getCategoryList()
            addNoticeFormData.value.title = ""
            addNoticeFormData.value.content = ""
            categoryFormVisible.value = false
          } else {
            ElMessage({
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
    const aditCategoryFormData = ref({
      name: "",
      updateTime: ""
    })
    const updateId = ref("")
    const openEdit = (row: any) => {
      updateId.value = row._id
      aditCategoryFormData.value.name = row.name
      editCategoryVisible.value = true
    }
    // 确认更改操作
    const editCategory = async () => {
      aditCategoryForm.value?.validate(async (valid) => {
        if (valid) {
          aditCategoryFormData.value.updateTime = new Date().toISOString()
          const result = await updateInvestmentCategory(updateId.value, {
            ...aditCategoryFormData.value
          })
          if (result.code > 0) {
            ElMessage({
              message: result.data.message,
              type: "success"
            })
            getCategoryList()
            editCategoryVisible.value = false
          } else {
            ElMessage({
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
        const deleteCategoryResult = await deleteInvestmentCategory(row._id)
        if (deleteCategoryResult.code > 0) {
          ElMessage({
            type: "info",
            message: row.name + `删除成功`
          })
        } else {
          ElMessage({
            type: "info",
            message: row.name + `删除失败`
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
      TableData,
      parseDate,
      FormateCreateTime,
      FormateUpdateTime,
      formData,
      cleanFormData,
      searchCategory,
      categoryFormVisible,
      addNoticeFormData,
      addCategory,
      rules,
      addCategoryForm,
      refresh,
      editCategoryVisible,
      aditCategoryForm,
      aditCategoryFormData,
      editCategory,
      openEdit,
      updateId,
      updateInvestmentCategory,
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
