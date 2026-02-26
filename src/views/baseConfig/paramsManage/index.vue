<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="参数详情列表"
        row-key="paramsId"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', { itemType: 'str' })"> 新增 </el-button>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        </template>
      </ProTable>
      <RoleDrawer ref="drawerRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import { CirclePlus, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import RoleDrawer from "./components/RoleDrawer.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getSystemParamsList, addSystemParams, updateSystemParams } from "@/api/modules/system_params";
import { ref } from "vue";
import { getSystemDataOps } from "@/api/modules/system_dict_data";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getSystemParamsList(newParams);
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
    prop: "paramsId",
    label: "参数标号"
  },
  { prop: "title", align: "left", label: "参数名称", search: { el: "input" }, showOverflowTooltip: false, width: 200 },
  { prop: "key", label: "参数键名", search: { el: "input" }, width: 200, showOverflowTooltip: false },
  {
    prop: "value",
    label: "字典键值"
  },
  {
    prop: "itemType",
    label: "参数类型",
    enum: () => getSystemDataOps({ dict_type: "sys_dict_value_type" }),
    search: { el: "select" }
  },
  { prop: "remarks", label: "备注" },
  { prop: "created_at", label: "创建时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<any>();
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSystemParams : title === "编辑" ? updateSystemParams : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
