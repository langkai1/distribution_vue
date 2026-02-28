<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="收货人" prop="receiver">
        <el-input v-model="drawerProps.row!.receiver" placeholder="请填写收货人" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机号" clearable />
      </el-form-item>
      <el-form-item label="所在区域" prop="region_pca">
        <el-cascader
          v-model="drawerProps.row.region_pca"
          :options="pcaTextArr as CascaderOption[]"
          placeholder="请选择省/市/区"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="detailed_address">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          v-model="drawerProps.row!.detailed_address"
          placeholder="请填写详细地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="默认地址" prop="is_default">
        <el-switch
          v-model="drawerProps.row!.is_default"
          active-value="1"
          inactive-value="0"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { CascaderOption, ElMessage, FormInstance } from "element-plus";
import { pcaTextArr } from "element-china-area-data";
const rules = reactive({
  receiver: [{ required: true, message: "请填写收货人" }],
  phone: [{ required: true, message: "请填写手机号" }],
  region_pca: [{ required: true, message: "请选择所在区域" }]
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
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  // 初始化表单数据
  if (drawerProps.value.row.region_pca) {
    drawerProps.value.row.region_pca = drawerProps.value.row.region_pca.split("-");
  }
  drawerVisible.value = true;
};
// json2formdata
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let params = JSON.parse(JSON.stringify(drawerProps.value.row));
      params.region_pca = params.region_pca.join("-");
      await drawerProps.value.api!(params);
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
