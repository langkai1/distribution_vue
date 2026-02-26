<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="50%" :title="`${drawerProps.title}`">
    <el-tabs class="demo-tabs" v-model="activeTab">
      <el-tab-pane label="角色菜单" name="role_menu">
        <TreeFilter
          title=""
          multiple
          label="role_menu"
          :request-api="getMenuOps"
          :default-value="drawerProps.row.menuIds"
          @change="changeTreeFilter"
        />
        <el-button type="primary" style="position: absolute; top: 19px; left: 232px" @click="roleMenuSave">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref } from "vue";
import { getMenuIdsByRoleId, getMenuOps, saveRoleMenu } from "@/api/modules/menu";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { ElMessage } from "element-plus";
interface DrawerProps {
  title: string;
  isView: boolean;
  row: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const activeTab = ref("role_menu");
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {
    menuIds: []
  }
});
const changeTreeFilter = (val: string[]) => {
  drawerProps.value.row.menuIds = val;
};
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.row.roleId) {
    const { data } = await getMenuIdsByRoleId({ role_id: drawerProps.value.row.roleId });
    drawerProps.value.row.menuIds = data || [];
  }
};
const roleMenuSave = async () => {
  const params = {
    role_id: drawerProps.value.row.roleId,
    menu_ids: drawerProps.value.row.menuIds
  };
  const { message }: any = await saveRoleMenu(params);
  ElMessage.success(message);
};
defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}
</style>
