<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="50%"
    :title="`${drawerProps.title}`"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="drawerProps.row!.parentId"
          filterable
          clearable
          :data="menu_ops"
          :render-after-expand="true"
          :check-strictly="true"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="drawerProps.row!.menuType">
          <el-radio v-for="item in menu_type_ops" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="drawerProps.row!.menuType === 'C'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图表" prop="icon">
              <el-input v-model="drawerProps.row!.icon" placeholder="请填写菜单图表" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number :controls="false" v-model="drawerProps.row!.orderNum" placeholder="请填写显示排序" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="drawerProps.row!.title" placeholder="请填写菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外链" prop="isLink">
              <el-input v-model="drawerProps.row!.isLink" placeholder="请填写外链" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="drawerProps.row!.path" placeholder="请填写路由地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件" prop="component">
              <el-input v-model="drawerProps.row!.component" placeholder="请填写组件" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="drawerProps.row!.name" placeholder="请填写路由名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐藏" prop="isHide">
              <el-radio-group v-model="drawerProps.row!.isHide" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="全屏" prop="isFull">
              <el-radio-group v-model="drawerProps.row!.isFull" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定" prop="isAffix">
              <el-radio-group v-model="drawerProps.row!.isAffix" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缓存" prop="isKeepAlive">
              <el-radio-group v-model="drawerProps.row!.isKeepAlive" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="drawerProps.row!.status">
                <el-radio :value="true">正常</el-radio>
                <el-radio :value="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="drawerProps.row!.menuType === 'M'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图表" prop="icon">
              <el-input v-model="drawerProps.row!.icon" placeholder="请填写菜单图表" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number :controls="false" v-model="drawerProps.row!.orderNum" placeholder="请填写显示排序" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="drawerProps.row!.title" placeholder="请填写菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外链" prop="isLink">
              <el-input v-model="drawerProps.row!.isLink" placeholder="请填写外链" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="drawerProps.row!.path" placeholder="请填写路由地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="drawerProps.row!.name" placeholder="请填写路由名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="隐藏" prop="isHide">
              <el-radio-group v-model="drawerProps.row!.isHide" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全屏" prop="isFull">
              <el-radio-group v-model="drawerProps.row!.isFull" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="固定" prop="isAffix">
              <el-radio-group v-model="drawerProps.row!.isAffix" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缓存" prop="isKeepAlive">
              <el-radio-group v-model="drawerProps.row!.isKeepAlive" clearable>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="drawerProps.row!.status">
                <el-radio :value="true">正常</el-radio>
                <el-radio :value="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="drawerProps.row!.menuType === 'B'">
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number :controls="false" v-model="drawerProps.row!.orderNum" placeholder="请填写显示排序" clearable />
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="drawerProps.row!.title" placeholder="请填写菜单名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="drawerProps.row!.status">
            <el-radio :value="true">正常</el-radio>
            <el-radio :value="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getMenuOps } from "@/api/modules/menu";
import { getSystemDataOps } from "@/api/modules/system_dict_data";

const rules = reactive({
  orderNum: [{ required: true, message: "请填写显示排序" }],
  title: [{ required: true, message: "请填写菜单名称" }],
  menuType: [{ required: true, message: "请选择菜单类型" }],
  status: [{ required: true, message: "请选择状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const menu_ops = ref<any>([]);
const menu_type_ops = ref<any>([]);
const get_menu_ops = async () => {
  const { data } = await getMenuOps({});
  menu_ops.value = data;
};
const get_type_ops = async () => {
  const { data } = await getSystemDataOps({ dict_type: "sys_menu_type" });
  menu_type_ops.value = data;
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  get_menu_ops();
  get_type_ops();
};
// json2formdata

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams
});
</script>
