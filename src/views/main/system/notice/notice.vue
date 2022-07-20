<template>
  <div class="notice">
    <div class="search">
      <el-form :model="formData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入公告名称"
                v-model="formData.title"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内容">
              <el-input
                placeholder="请输入公告内容"
                v-model="formData.content"
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
        <el-button type="primary" :icon="Search" @click="searchNotice"
          >搜索</el-button
        >
        <el-button :icon="RefreshRight" @click="cleanFormData">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <span>公告列表</span>
        <div class="handleBtn">
          <el-button type="primary" @click="noticeFormVisible = true"
            >新建公告</el-button
          >
          <el-button class="refresh" @click="refresh">
            <el-icon><refresh /></el-icon>
          </el-button>
          <!-- 弹出卡面 -->
          <el-dialog v-model="noticeFormVisible" title="添加公告" :width="600">
            <el-form
              :label-width="100"
              :model="addNoticeFormData"
              :rules="rules"
              ref="addCategoryForm"
            >
              <el-form-item label="标题" prop="title">
                <el-input v-model="addNoticeFormData.title" />
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="addNoticeFormData.content" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="noticeFormVisible = false">取消</el-button>
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
          sortable
          prop="createTime"
          label="创建时间"
          align="center"
          ref="createTime"
          :width="230"
          :formatter="FormateCreateTime"
        >
        </el-table-column>
        <el-table-column label="是否推送" align="center" width="140">
          <template v-slot="scope">
            <el-switch
              @click="changeShowNotice(scope.row)"
              v-model="scope.row.isShow"
              size="large"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
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
              @click="handleDeleteNotice(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出卡面 -->
      <el-dialog v-model="editCategoryVisible" title="编辑公告" :width="400">
        <el-form
          :label-width="80"
          :model="editNoticeFormData"
          :rules="rules"
          ref="editNoticeForm"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="editNoticeFormData.title" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="editNoticeFormData.content" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editCategoryVisible = false">取消</el-button>
            <el-button type="primary" @click="editNotice">更改</el-button>
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
          :total="noticeCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import clForm from "@/base-ui/form"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import {
  addNoticeData,
  deleteNotice,
  getPageListData,
  updateNotice
} from "@/service/main/system/system"
import { parseDate } from "@/utils/parseDate"
import { rules } from "./config/addCategoryRoules"
import { ElForm, ElMessage, ElMessageBox, ElNotification } from "element-plus"

export default defineComponent({
  name: "notice",
  components: {},
  setup() {
    onMounted(() => {
      getCategoryList()
    })
    // 查询数据
    const formData = ref({
      title: "",
      content: "",
      createTime: ""
    })
    // table数据
    const TableData = ref([])
    // 格式化时间
    const FormateCreateTime = (row: any) => {
      return parseDate(row.createTime)
    }

    // 搜索
    // 每页展示条数
    const pageSize = ref(8)
    // 偏移量
    const currentPage = ref(1)
    // 获取页面数据
    const getCategoryList = async () => {
      const pageResult = await getPageListData("/notice/list", {
        offset: currentPage.value,
        size: pageSize.value,
        formData: formData.value
      })
      if (pageResult.code > 0) {
        noticeCount.value = pageResult.data.totalCount
        TableData.value = pageResult.data.list
      }
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      searchNotice()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      searchNotice()
    }

    const noticeCount = ref(0)
    // 搜索功能

    const searchNotice = async () => {
      getCategoryList()
    }

    // 重置
    const cleanFormData = () => {
      formData.value.title = ""
      formData.value.content = ""
      formData.value.createTime = ""
      getCategoryList()
    }

    // 添加公告数据
    const noticeFormVisible = ref(false)
    const addNoticeFormData = ref({
      title: "",
      content: ""
    })
    const addCategoryForm = ref<InstanceType<typeof ElForm>>()
    // 添加公告函数实现
    const addCategory = async () => {
      addCategoryForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await addNoticeData({
            ...addNoticeFormData.value
          })
          // console.log(result)
          if (result.code > 0) {
            ElNotification({
              title: "Success",
              message: result.data.message,
              type: "success"
            })
            getCategoryList()
            addNoticeFormData.value.title = ""
            addNoticeFormData.value.content = ""
            noticeFormVisible.value = false
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

    // 编辑公告
    const editNoticeForm = ref<InstanceType<typeof ElForm>>()
    const editCategoryVisible = ref(false)
    const editNoticeFormData = ref({
      title: "",
      content: "",
      isShow: 0
    })
    const updateId = ref("")
    const openEdit = (row: any) => {
      updateId.value = row._id
      editNoticeFormData.value.title = row.title
      editNoticeFormData.value.content = row.content
      editCategoryVisible.value = true
    }
    // 确认更改操作
    const editNotice = async () => {
      editNoticeForm.value?.validate(async (valid) => {
        if (valid) {
          const result = await updateNotice(updateId.value, {
            ...editNoticeFormData.value
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
    // 删除公告
    const handleDeleteNotice = (row: any) => {
      ElMessageBox.confirm(`确定要删除分类 ` + row.title, "请确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const deleteCategoryResult = await deleteNotice(row._id)
        if (deleteCategoryResult.code > 0) {
          ElNotification({
            title: "Success",
            message: row.title + `删除成功`,
            type: "success"
          })
        } else {
          ElNotification({
            title: "Warning",
            message: row.title + `删除失败`,
            type: "warning"
          })
        }
        getCategoryList()
      })
    }

    // 推送
    const changeShowNotice = async (row: any) => {
      // console.log(row.isShow)
      updateId.value = row._id
      editNoticeFormData.value.isShow = row.isShow
      editNoticeFormData.value.title = row.title
      editNoticeFormData.value.content = row.content
      const result = await updateNotice(updateId.value, {
        ...editNoticeFormData.value
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
    return {
      clForm,
      Search,
      RefreshRight,
      Edit,
      Delete,
      TableData,
      parseDate,
      FormateCreateTime,
      formData,
      cleanFormData,
      searchNotice,
      noticeFormVisible,
      addNoticeFormData,
      addCategory,
      rules,
      addCategoryForm,
      refresh,
      editCategoryVisible,
      editNoticeForm,
      editNoticeFormData,
      editNotice,
      openEdit,
      updateId,
      updateNotice,
      handleDeleteNotice,
      pageSize,
      currentPage,
      handleSizeChange,
      handleCurrentChange,
      noticeCount,
      changeShowNotice
    }
  }
})
</script>

<style scoped lang="less">
.search {
  padding: 20px 20px 0 20px;
  .el-form {
    margin-left: 10px;
  }
  .handleBtn {
    text-align: right;
    padding: 40px 0 0 0;
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
