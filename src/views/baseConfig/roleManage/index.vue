<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="角色列表"
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
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="showMenuSetPermission(scope.row)">设置权限</el-button>
        </template>
      </ProTable>
      <RoleDrawer ref="drawerRefRole" />
      <MenuDrawer ref="drawerRefMenu" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import { CirclePlus, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import RoleDrawer from "./components/RoleDrawer.vue";
import MenuDrawer from "./components/MenuDrawer.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getRoleList, addRole, updateRole } from "@/api/modules/role";
import { ref } from "vue";
import { getSystemDataOps } from "@/api/modules/system_dict_data";
const proTable = ref();
const dict_id = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  if (params.status === false) {
    newParams.status = false;
  }
  return getRoleList(newParams);
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
    label: "角色编号"
  },
  { prop: "name", label: "角色名称", search: { el: "input" } },
  { prop: "key", label: "角色标识", search: { el: "input" } },
  {
    prop: "description",
    label: "角色描述"
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
const drawerRefRole = ref<any>();
const drawerRefMenu = ref<any>();
const openDrawer = (title: string, row: any) => {
  if (title === "新增") {
    dict_id.value = proTable.value.searchParam.dictId;
    row.dictId = dict_id.value;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRole : title === "编辑" ? updateRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRefRole.value?.acceptParams(params);
};
const showMenuSetPermission = (row: any) => {
  drawerRefMenu.value?.acceptParams({
    title: "设置权限",
    isView: false,
    row: { roleId: row.id },
    api: undefined,
    getTableList: proTable.value?.getTableList
  });
};
</script>
