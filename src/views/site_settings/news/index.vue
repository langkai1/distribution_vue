<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="新闻列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', {})"> 新增新闻 </el-button>
        </template>
        <!-- 菜单操作 -->
        <template #cover_url="scope">
          <el-image
            v-if="scope.row.cover_url"
            style="width: 50px; height: 50px"
            :src="`${scope.row.cover_url}`"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[`${scope.row.cover_url}`]"
            :initial-index="0"
            fit="cover"
            :append-to-body="true"
            :preview-teleported="true"
          />
        </template>
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteNewsFun(scope.row)">删除</el-button>
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
import { getNewsList, addNews, updateNews, deleteNews } from "@/api/modules/news";
import { ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getNewsList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
// 删除新闻
const deleteNewsFun = async (row: any) => {
  await useHandleData(deleteNews, { id: row.id }, "删除该新闻");
  proTable.value?.getTableList();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "title", align: "left", label: "新闻标题", search: { el: "input" } },
  {
    prop: "cls",
    label: "新闻分类",
    search: { el: "input" }
  },
  {
    prop: "cover_url",
    label: "新闻封面"
  },
  {
    prop: "created_at",
    label: "创建时间"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
];
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<any>();
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addNews : title === "编辑" ? updateNews : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
