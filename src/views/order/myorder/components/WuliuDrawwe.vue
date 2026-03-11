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
      <el-form-item label="收货人">
        {{ drawerProps.row!.receiver }}
      </el-form-item>
      <el-form-item label="联系方式">
        {{ drawerProps.row!.phone }}
      </el-form-item>
      <el-form-item label="收货地址"> {{ drawerProps.row!.region_pca }} {{ drawerProps.row!.detailed_address }} </el-form-item>
      <el-form-item label="发货平台" prop="send_platform">
        <el-input v-model="drawerProps.row!.send_platform" placeholder="请填写发货平台" clearable />
      </el-form-item>
      <el-form-item label="物流单号" prop="sned_no">
        <el-input v-model="drawerProps.row!.sned_no" placeholder="请填写物流单号" clearable />
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
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
  send_platform: [{ required: true, message: "请填写发货平台" }],
  sned_no: [{ required: true, message: "请填写物流单号" }]
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
