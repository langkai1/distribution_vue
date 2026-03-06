<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="50%" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="轮播图标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写轮播图标题" clearable />
      </el-form-item>
      <el-form-item label="轮播图描述" prop="description">
        <el-input v-model="drawerProps.row!.description" placeholder="请填写轮播图描述" clearable />
      </el-form-item>
      <el-form-item label="轮播图" prop="url">
        <div class="avatar-upload">
          <UploadImg v-model:image-url="drawerProps.row!.url" :file-size="3">
            <template #tip> 上传图片最大为 3M </template>
          </UploadImg>
        </div>
      </el-form-item>
      <el-form-item label="轮播图跳转链接" prop="link">
        <el-input v-model="drawerProps.row!.link" placeholder="请填写轮播图跳转链接" clearable />
      </el-form-item>
      <el-form-item label="轮播图排序" prop="order_num">
        <el-input-number
          :min="0"
          :controls="false"
          v-model="drawerProps.row!.order_num"
          placeholder="请填写轮播图排序"
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
import UploadImg from "@/components/Upload/Img.vue";
const rules = reactive({
  title: [{ required: true, message: "请填写轮播图标题" }],
  cls: [{ required: true, message: "请填写轮播图分类" }],
  url: [{ required: true, message: "请上传轮播图" }],
  order_num: [{ required: true, message: "请填写轮播图排序" }]
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
