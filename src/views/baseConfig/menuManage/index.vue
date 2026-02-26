<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="menuId"
      :indent="20"
      :columns="columns"
      :request-api="getTableList"
      :pagination="false"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button
          type="primary"
          :icon="CirclePlus"
          @click="
            openDrawer('新增', { menuType: 'M', status: true, isHide: false, isFull: false, isAffix: false, isKeepAlive: true })
          "
        >
          新增菜单
        </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button
          type="primary"
          link
          :icon="CirclePlus"
          @click="
            openDrawer('新增', {
              parentId: scope.row.menuId,
              menuType: 'M',
              status: true,
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true
            })
          "
        >
          新增
        </el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { addMenu, editMenu, getMenuList, getMenuDetail } from "@/api/modules/menu";
import lodash from "lodash";
import { getSystemDataOps } from "@/api/modules/system_dict_data";
import MenuDrawer from "./components/MenuDrawer.vue";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getMenuList(newParams);
};
const dataCallback = (data: any) => {
  return data;
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "title", label: "菜单标题", align: "left", width: 300 },
  { prop: "icon", label: "菜单图标" },
  { prop: "orderNum", label: "排序" },
  { prop: "name", label: "菜单名称", width: 150 },
  { prop: "path", label: "菜单路径", width: 200 },
  { prop: "component", label: "组件路径", width: 200 },
  {
    prop: "menuType",
    label: "菜单类型",
    width: 100,
    enum: () => getSystemDataOps({ dict_type: "sys_menu_type" })
  },
  { prop: "created_at", label: "创建时间", width: 200 },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
const drawerRef = ref<any>();
const get_menu_detail = async (menuId: number) => {
  const { data } = await getMenuDetail({ menu_id: menuId });
  return data;
};
const openDrawer = async (title: string, row: any) => {
  if (row.menuId) {
    row = await get_menu_detail(row.menuId);
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
