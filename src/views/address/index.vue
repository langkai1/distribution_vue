<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="地址列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', {})"> 新增 </el-button>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteAddressFun(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <RoleDrawer ref="drawerRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import RoleDrawer from "./components/RoleDrawer.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getAddressList, addAddress, updateAddress, deleteAddress } from "@/api/modules/address";
import { ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getAddressList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
// 删除地址
const deleteAddressFun = async (row: any) => {
  await useHandleData(deleteAddress, { id: row.id }, "删除该地址");
  proTable.value?.getTableList();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "receiver", align: "left", label: "收货人", search: { el: "input" }, showOverflowTooltip: false, width: 200 },
  {
    prop: "phone",
    label: "手机号",
    search: { el: "input" }
  },
  {
    prop: "region_pca",
    label: "所在区域"
  },
  {
    prop: "detailed_address",
    label: "详细地址"
  },
  {
    prop: "is_default",
    label: "默认地址",
    enum: [
      { label: "是", value: true },
      { label: "否", value: false }
    ]
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
    api: title === "新增" ? addAddress : title === "编辑" ? updateAddress : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
