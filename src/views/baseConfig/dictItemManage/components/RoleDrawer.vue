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
      <el-form-item label="字典标签" prop="label">
        <el-input v-model="drawerProps.row!.label" placeholder="请填写字典标签" clearable />
      </el-form-item>
      <el-form-item label="字典键值" prop="value">
        <el-input v-model="drawerProps.row!.value" placeholder="请填写字典键值" clearable />
      </el-form-item>
      <el-form-item label="字典排序" prop="orderNum">
        <el-input-number :controls="false" :min="0" v-model="drawerProps.row!.orderNum" placeholder="请填写字典排序" clearable />
      </el-form-item>
      <el-form-item label="键值类型" prop="itemType">
        <el-radio-group v-model="drawerProps.row!.itemType">
          <el-radio value="str">字符串</el-radio>
          <el-radio value="num">整数</el-radio>
          <el-radio value="bool">布尔值</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="drawerProps.row!.status">
          <el-radio :value="true">正常</el-radio>
          <el-radio :value="false">停用</el-radio>
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
  label: [{ required: true, message: "请填写字典标签" }],
  value: [{ required: true, message: "请填写字典键值" }],
  status: [{ required: true, message: "请选择状态" }],
  itemType: [{ required: true, message: "请选择键值类型" }],
  orderNum: [{ required: true, message: "请填写字典排序" }]
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
