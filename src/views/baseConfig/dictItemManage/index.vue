<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="配置详情列表"
        row-key="dataId"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
        :request-auto="false"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', { itemType: 'str', status: true })">
            新增
          </el-button>
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
import { getSystemDataList, addSystemData, updateSystemData, getSystemDataOps } from "@/api/modules/system_dict_data";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getSystemDictOps } from "@/api/modules/system_dict";
const route = useRoute();
const proTable = ref();
const dict_id = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  if (params.status === false) {
    newParams.status = false;
  }
  return getSystemDataList(newParams);
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
    prop: "dictId",
    label: "字典名称",
    isShow: false,
    enum: getSystemDictOps,
    search: { el: "select", props: { clearable: false } }
  },
  { prop: "dataId", align: "left", label: "字典编号" },
  { prop: "label", label: "字典标签", search: { el: "input" } },
  {
    prop: "value",
    label: "字典键值"
  },
  { prop: "orderNum", label: "字典排序" },
  {
    prop: "status",
    label: "状态",
    tag: true,
    enum: () => getSystemDataOps({ dict_type: "sys_data_status" }),
    search: { el: "select" }
  },
  { prop: "remarks", label: "备注" },
  { prop: "created_at", label: "创建时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<any>();
const openDrawer = (title: string, row: any) => {
  if (title === "新增") {
    dict_id.value = proTable.value.searchParam.dictId;
    row.dictId = dict_id.value;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSystemData : title === "编辑" ? updateSystemData : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
onMounted(() => {
  const dictId = route.params.dict_id;
  dict_id.value = Number(dictId);
  proTable.value.searchParam.dictId = Number(dictId);
  proTable.value.searchInitParam.dictId = Number(dictId);
  proTable.value.getTableList();
});
</script>
