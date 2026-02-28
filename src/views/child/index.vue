<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="孩子列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', { gender: '1' })"> 新增 </el-button>
        </template>
        <template #birthday="scope">
          {{ scope.row.birthday ? scope.row.birthday + getAge(scope.row.birthday) : "--" }}
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteChildFun(scope.row)">删除</el-button>
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
import { getChildList, addChild, updateChild, deleteChild } from "@/api/modules/child";
import { ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getChildList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
// 删除孩子
const deleteChildFun = async (row: any) => {
  await useHandleData(deleteChild, { id: row.id }, "是否删除该孩子");
  proTable.value?.getTableList();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", align: "left", label: "名称", search: { el: "input" }, showOverflowTooltip: false, width: 200 },
  {
    prop: "gender",
    label: "性别",
    enum: [
      { label: "男", value: 1 },
      { label: "女", value: 2 }
    ],
    search: { el: "select" }
  },
  {
    prop: "birthday",
    label: "出生日期"
  },
  {
    prop: "contact",
    label: "联系方式",
    search: { el: "input" }
  },
  { prop: "detail_address", label: "详细地址" },
  { prop: "remarks", label: "备注" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
// 计算年龄
const getAge = (birthday: string) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `(${age}岁)`;
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<any>();
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addChild : title === "编辑" ? updateChild : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
