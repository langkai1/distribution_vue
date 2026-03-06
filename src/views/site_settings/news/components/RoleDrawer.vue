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
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写新闻标题" clearable />
      </el-form-item>
      <el-form-item label="新闻分类" prop="cls">
        <el-input v-model="drawerProps.row!.cls" placeholder="请填写新闻分类" clearable />
      </el-form-item>
      <el-form-item label="新闻封面" prop="cover_url">
        <div class="avatar-upload">
          <UploadImg v-model:image-url="drawerProps.row!.cover_url" :file-size="3">
            <template #tip> 上传图片最大为 3M </template>
          </UploadImg>
        </div>
      </el-form-item>
      <el-form-item label="新闻内容" prop="content">
        <WangEditor v-model:value="drawerProps.row!.content" height="400px" />
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
import WangEditor from "@/components/WangEditor/index.vue";
const rules = reactive({
  title: [{ required: true, message: "请填写新闻标题" }],
  cls: [{ required: true, message: "请填写新闻分类" }],
  cover_url: [{ required: true, message: "请上传新闻封面" }],
  content: [{ required: true, message: "请填写新闻内容" }]
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
