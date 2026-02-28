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
      <el-form-item label="参数名称" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写参数名称" clearable />
      </el-form-item>
      <el-form-item label="参数键名" prop="key">
        <el-input v-model="drawerProps.row!.key" placeholder="请填写参数键名" clearable />
      </el-form-item>
      <el-form-item label="字典键值" prop="value">
        <el-input v-model="drawerProps.row!.value" placeholder="请填写字典键值" clearable />
      </el-form-item>
      <el-form-item label="键值类型" prop="item_type">
        <el-radio-group v-model="drawerProps.row!.item_type">
          <el-radio value="str">字符串</el-radio>
          <el-radio value="int">整数</el-radio>
          <el-radio value="bool">布尔值</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          v-model="drawerProps.row!.remarks"
          placeholder="请填写备注"
          clearable
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
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
  title: [{ required: true, message: "请填写参数名称" }],
  key: [{ required: true, message: "请填写参数键名" }],
  value: [{ required: true, message: "请填写字典键值" }],
  status: [{ required: true, message: "请选择状态" }],
  itemType: [{ required: true, message: "请选择键值类型" }]
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
