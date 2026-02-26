<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="配置列表"
        row-key="dictId"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', {})">新增</el-button>
        </template>
        <!-- 菜单操作 -->
        <template #dict_type="scope">
          <el-link type="primary" @click="handleDictTypeClick(scope.row)">{{ scope.row.dict_type }}</el-link>
        </template>
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
import { getSystemDictList, addSystemDict, updateSystemDict } from "@/api/modules/system_dict";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getSystemDataOps } from "@/api/modules/system_dict_data";
const router = useRouter();
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  if (params.status === false) {
    newParams.status = false;
  }
  return getSystemDictList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
const handleDictTypeClick = (row: any) => {
  router.push({
    path: "/baseConfig/dictItemManage/" + row.dictId
  });
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "dictId", align: "left", label: "字典编号" },
  { prop: "dict_name", label: "字典名称", search: { el: "input" } },
  {
    prop: "dict_type",
    label: "字典类型",
    search: { el: "input" }
  },
  {
    prop: "status",
    label: "状态",
    tag: true,
    enum: () => getSystemDataOps({ dict_type: "sys_data_status" }),
    search: { el: "select" }
  },
  { prop: "remarks", label: "备注" },
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
const drawerRef = ref<any>();
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSystemDict : title === "编辑" ? updateSystemDict : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
