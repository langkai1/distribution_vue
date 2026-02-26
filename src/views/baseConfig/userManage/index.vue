<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="用户列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', { status: true })"> 新增 </el-button>
        </template>
        <!-- 菜单操作 -->
        <template #role_ids="scope">
          <div v-if="scope.row.role_ids && scope.row.role_ids.length > 0">
            <div v-for="item in scope.row.role_ids" :key="item">
              <el-tag type="primary">
                {{ renderCellData(columns.filter(e => e.prop === "role_ids")[0], scope, item) }}
              </el-tag>
              <br />
            </div>
          </div>
          <div v-if="!scope.row.workshop_ids && scope.row.cg_num > 0 && scope.row.cg_in_num === 0">
            <el-tag> 待入库</el-tag>
          </div>
        </template>
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="showResetPwd(scope.row)">重置密码</el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRefUser" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import { CirclePlus, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "./components/UserDrawer.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getUserList, addUser, editUser, resetUserPassWord } from "@/api/modules/user";
import { ref } from "vue";
import { getSystemDataOps } from "@/api/modules/system_dict_data";
import { getRoleOps } from "@/api/modules/role";
import { filterEnum, formatValue } from "@/utils";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  if (params.status === false) {
    newParams.status = false;
  }
  return getUserList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "id",
    label: "用户编号"
  },
  { prop: "nickname", label: "昵称", search: { el: "input" } },
  {
    prop: "phone",
    label: "手机号",
    search: { el: "input" }
  },
  {
    prop: "role_ids",
    label: "角色",
    enum: () => getRoleOps({}),
    search: { el: "select", props: { multiple: true } }
  },
  {
    prop: "status",
    label: "状态",
    tag: true,
    enum: () => getSystemDataOps({ dict_type: "sys_data_status" }),
    search: { el: "select" }
  },
  {
    prop: "created_at",
    label: "创建时间",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-date-picker
              vModel_trim={searchParam.created_at}
              type="daterange"
              range-separator="到"
              start-placeholder="开始时间"
              end-placeholder="截止时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        );
      }
    }
  },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRefUser = ref<any>();
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList,
    ops: {
      role_ops: proTable.value.enumMap.get("role_ids")
    }
  };
  drawerRefUser.value?.acceptParams(params);
};
// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: any, value) => {
  return proTable.value.enumMap.get(item.prop) && item.isFilterEnum
    ? filterEnum(value, proTable.value.enumMap.get(item.prop)!, item.fieldNames)
    : formatValue(value);
};
const showResetPwd = async (row: any) => {
  await useHandleData(resetUserPassWord, { userId: row.userId }, `重置【${row.nickname}】用户密码`);
  proTable.value?.getTableList();
};
</script>
