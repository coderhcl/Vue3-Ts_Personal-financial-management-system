<template>
  <div class="user">
    <div class="search">
      <cl-form v-bind="searchFormConfig" v-model="formData">
        <template #footer>
          <div class="handle-btn">
            <el-button type="primary" :icon="Search" @click="searchUsers"
              >搜索</el-button
            >
            <el-button :icon="RefreshRight" @click="cleanFormData"
              >重置</el-button
            >
          </div>
        </template>
      </cl-form>
    </div>
    <div class="content">
      <cl-table :listData="userList" v-bind="tableConfig">
        <!-- headerl里面的插槽 -->
        <template #headerHandler>
          <el-button type="primary" @click="AddUser">新建用户</el-button>
          <!-- 弹出卡面 -->
          <el-dialog
            v-model="dialogFormVisible"
            title="添加新用户"
            :width="400"
          >
            <el-form
              :label-width="100"
              :rules="rules"
              :model="addUserFormData"
              ref="addUserForm"
            >
              <el-form-item label="账号" prop="name">
                <el-input v-model="addUserFormData.name" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  show-password
                  v-model="addUserFormData.password"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="addUserFormData.phone" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserFormData.email" />
              </el-form-item>
              <el-form-item label="请选择角色" prop="roleId" required>
                <el-select
                  v-model="addUserFormData.roleId"
                  placeholder="请选择角色"
                >
                  <el-option label="管理员" :value="1" />
                  <el-option label="普通用户" :value="2" />
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addUserConfirm"
                  >添加</el-button
                >
              </span>
            </template>
          </el-dialog>
          <el-button @click="refreshUser" class="refresh">
            <el-icon><refresh /></el-icon>
          </el-button>
        </template>
        <!-- 列表里面的插槽 -->
        <template #roleId="scope">
          <el-button
            size="small"
            :type="scope.row.roleId === 2 ? 'info' : 'primary'"
            plain
            >{{ scope.row.roleId === 2 ? "普通用户" : "管理员" }}</el-button
          >
        </template>
        <template #createTimes="scope">
          {{ parseDate(scope.row.createTimes) }}
        </template>
        <template #updateTime="scope">
          {{ parseDate(scope.row.updateTime) }}
        </template>
        <template #handler="scope">
          <div class="handle-btns">
            <el-button
              size="small"
              type="text"
              :icon="Edit"
              @click="openEditForm(scope.row)"
              >编辑
            </el-button>
            <el-button
              class="delete"
              size="small"
              type="text"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
        <!-- 底部分页 -->
        <template #footer>
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[2, 4, 6, 8]"
            small
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
        <!-- -->
      </cl-table>
      <!-- 编辑卡片 -->
      <el-dialog v-model="editFormVisible" title="编辑新用户" :width="400">
        <el-form
          :label-width="100"
          :rules="rules"
          :model="editUserFormData"
          ref="editUserForm"
        >
          <el-form-item label="账号" prop="name">
            <el-input v-model="editUserFormData.name" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              show-password
              v-model="editUserFormData.password"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="editUserFormData.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserFormData.email" />
          </el-form-item>
          <el-form-item label="请选择角色" prop="roleId">
            <el-select
              v-model="editUserFormData.roleId"
              placeholder="请选择角色"
            >
              <el-option label="管理员" :value="1" />
              <el-option label="普通用户" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="editDialog-footer">
            <el-button @click="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click="editUserConfirm">
              修改
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue"
import clForm from "@/base-ui/form"
import { searchFormConfig } from "./config/search.config"
import { Search, RefreshRight, Delete, Edit } from "@element-plus/icons-vue"
import { useStore } from "@/store"
import clTable from "@/base-ui/table"
import { parseDate } from "@/utils/parseDate"
import { tableConfig } from "./config/table.config"
import { rules } from "./config/addUserRules"
import {
  addUserData,
  deleteUser,
  getUserDataById,
  updateUser
} from "@/service/main/system/system"
import { ElForm, ElMessage, ElMessageBox } from "element-plus"
export default defineComponent({
  name: "user",
  components: {
    clForm,
    clTable
  },
  setup() {
    const formData = ref({
      name: "",
      phone: "",
      email: "",
      roleId: "",
      createTime: ""
    })
    // 每页展示条数
    const pageSize = ref(6)
    // 偏移量
    const currentPage = ref(1)
    const store = useStore()
    // 未操作时申请页面数据函数
    const getPageData = () => {
      store.dispatch("system/getPageListAction", {
        pageUrl: "/users/list",
        queryInfo: {
          offset: currentPage.value,
          size: pageSize.value
        }
      })
    }
    // 申请页面数据
    getPageData()

    // 搜索
    const searchUsers = () => {
      store.dispatch("system/getPageListAction", {
        pageUrl: "/users/list",
        queryInfo: {
          offset: currentPage.value,
          size: pageSize.value,
          formData: formData.value
        }
      })
    }
    // 搜索重置
    const cleanFormData = () => {
      formData.value.name = ""
      formData.value.phone = ""
      formData.value.email = ""
      formData.value.roleId = ""
      formData.value.createTime = ""
      getPageData()
    }
    // 改变分页时发送请求
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      refreshUser()
    }
    // 页面跳转时发送请求
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      refreshUser()
    }
    // 新建用户
    const dialogFormVisible = ref(false)
    const addUserForm = ref<InstanceType<typeof ElForm>>()
    const addUserFormData = reactive({
      name: "",
      password: "",
      phone: "",
      email: "",
      roleId: 2
    })
    //打开添加界面
    const AddUser = () => {
      dialogFormVisible.value = true
    }
    // 点击确认提交数据至后台
    const addUserConfirm = async () => {
      addUserForm.value?.validate(async (valid) => {
        if (valid) {
          const addUserResult = await addUserData({ ...addUserFormData })
          if (addUserResult.code > 0) {
            ElMessage({
              message: addUserResult.data.message,
              type: "success"
            })
            refreshUser()
            dialogFormVisible.value = false
          } else {
            ElMessage({
              message: addUserResult.data.message,
              type: "warning"
            })
          }
          // console.log(addUserResult)
        }
      })
    }
    // 刷新数据
    const refreshUser = () => {
      store.dispatch("system/getPageListAction", {
        pageUrl: "/users/list",
        queryInfo: {
          offset: currentPage.value,
          size: pageSize.value,
          formData: formData.value
        }
      })
    }
    // 编辑用户数据
    const editFormVisible = ref(false)
    const editUserFormData = reactive({
      name: "",
      password: "",
      phone: "",
      email: "",
      roleId: 2,
      updateTime: ""
    })
    const updateId = ref("")
    const editUserForm = ref<InstanceType<typeof ElForm>>()
    // 打开编辑界面
    const openEditForm = async (row: any) => {
      updateId.value = row._id
      const userResult = await getUserDataById(row._id)
      if (userResult.code > 0) {
        editUserFormData.name = userResult.data.user.name
        editUserFormData.password = userResult.data.user.password
        editUserFormData.phone = userResult.data.user.phone
        editUserFormData.email = userResult.data.user.email
        editUserFormData.roleId = userResult.data.user.roleId
      }
      editFormVisible.value = true
    }

    const editUserConfirm = () => {
      editUserForm.value?.validate(async (valid) => {
        editUserFormData.updateTime = new Date().toISOString()
        if (valid) {
          const updateResult = await updateUser(
            updateId.value,
            editUserFormData
          )
          if (updateResult.code > 0) {
            ElMessage({
              message: updateResult.data.message,
              type: "success"
            })
            refreshUser()
            editFormVisible.value = false
          } else {
            ElMessage({
              message: updateResult.data.message,
              type: "warning"
            })
          }
        }
      })
    }
    // 删除用户
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`确定要删除用户 ` + row.name, "请确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        ElMessage({
          type: "info",
          message: row.name + `删除成功`
        })
        const deleteUserResult = await deleteUser(row._id)
        refreshUser()
      })
    }

    const userList = computed(() => store.state.system.userList)
    const userCount = computed(() => store.state.system.userCount)
    return {
      searchFormConfig,
      formData,
      Search,
      RefreshRight,
      Delete,
      Edit,
      userList,
      userCount,
      parseDate,
      tableConfig,
      getPageData,
      searchUsers,
      cleanFormData,
      pageSize,
      currentPage,
      handleSizeChange,
      handleCurrentChange,
      refreshUser,
      AddUser,
      dialogFormVisible,
      rules,
      addUserFormData,
      addUserForm,
      addUserConfirm,
      openEditForm,
      handleDelete,
      editFormVisible,
      editUserFormData,
      editUserConfirm,
      editUserForm,
      updateId
    }
  }
})
</script>

<style scoped lang="less">
.user {
  width: 100%;
  .content {
    padding: 20px;
    border-top: 30px solid #f5f5f5;
    .handle-btns {
      .delete {
        color: #b33131;
      }
    }
    .refresh {
      margin-left: 15px;
    }
    .el-dialog .el-select {
      width: 260px;
    }
  }
}
.handle-btn {
  text-align: right;
  padding: 0 50px 20px 0;
}
.content {
  .el-pagination {
    padding-left: 25%;
  }
}
</style>
