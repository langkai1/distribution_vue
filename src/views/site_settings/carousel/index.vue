<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="轮播列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', {})"> 新增轮播 </el-button>
        </template>
        <!-- 菜单操作 -->
        <template #url="scope">
          <el-image
            v-if="scope.row.url"
            style="width: 50px; height: 50px"
            :src="`${scope.row.url}`"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[`${scope.row.url}`]"
            :initial-index="0"
            fit="cover"
            :append-to-body="true"
            :preview-teleported="true"
          />
        </template>
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteCarouselFun(scope.row)">删除</el-button>
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
import { getCarouselList, addCarousel, updateCarousel, deleteCarousel } from "@/api/modules/carousel";
import { ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getCarouselList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
// 删除轮播
const deleteCarouselFun = async (row: any) => {
  await useHandleData(deleteCarousel, { id: row.id }, "删除该轮播");
  proTable.value?.getTableList();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "title", align: "left", label: "轮播标题", search: { el: "input" } },
  {
    prop: "description",
    label: "轮播描述"
  },
  {
    prop: "url",
    label: "轮播图片"
  },
  {
    prop: "link",
    label: "轮播跳转链接"
  },
  {
    prop: "order_num",
    label: "轮播排序"
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
    api: title === "新增" ? addCarousel : title === "编辑" ? updateCarousel : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
