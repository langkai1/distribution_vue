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
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机号" clearable />
      </el-form-item>
      <el-form-item label="保护区域" prop="channel_region_code">
        <el-cascader
          v-model="drawerProps.row!.region_pca"
          :options="regionData as CascaderOption[]"
          placeholder="请选择省/市/区"
          filterable
          clearable
          style="width: 100%"
          @change="handleRegionChange"
        />
      </el-form-item>
      <el-form-item label="备货款" prop="goods_deposit">
        <el-input-number :min="0" :controls="false" v-model="drawerProps.row!.goods_deposit" placeholder="请输入备货款" />
      </el-form-item>
      <el-form-item label="保证金" prop="deposit">
        <el-input-number :min="0" :controls="false" v-model="drawerProps.row!.deposit" placeholder="请输入保证金" />
      </el-form-item>
      <el-form-item label="有效期" prop="validity_date">
        <el-date-picker
          v-model="drawerProps.row!.validity_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择有效期"
        />
      </el-form-item>
      <el-form-item label="附件" prop="files">
        <el-upload
          :show-file-list="true"
          v-model:file-list="_fileList"
          class="upload-demo"
          :http-request="handleHttpUpload"
          :on-success="uploadSuccess"
          :on-preview="handlePreview"
        >
          <el-button type="primary">上传附件</el-button>
          <template #tip>
            <div class="el-upload__tip">doc .docx .pdf .ex. jpg .png</div>
          </template>
        </el-upload>
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
import { regionData } from "element-china-area-data";
import {
  CascaderOption,
  ElMessage,
  ElNotification,
  FormInstance,
  UploadFile,
  UploadRequestOptions,
  UploadUserFile
} from "element-plus";
import { uploadFile } from "@/api/modules/system_file";

const rules = reactive({
  phone: [{ required: true, message: "请填写手机号" }],
  channel_region_code: [{ required: true, message: "请选择保护区域" }],
  goods_deposit: [{ required: true, message: "请输入备货款" }],
  deposit: [{ required: true, message: "请输入保证金" }],
  validity_date: [{ required: true, message: "请选择有效期" }]
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
const _fileList = ref<UploadUserFile[]>([]);
const emit = defineEmits<{
  "update:fileList": [value: UploadUserFile[]];
}>();
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  try {
    const { data } = await uploadFile(formData);
    options.onSuccess(data);
  } catch (error) {
    options.onError(error as any);
  }
};
const uploadSuccess = (response: { fileUrl: string; name: string } | undefined, uploadFile: UploadFile) => {
  if (!response) return;
  uploadFile.url = response.fileUrl;
  emit("update:fileList", _fileList.value);
  // 调用 el-form 内部的校验方法（可自动校验）
  ElNotification({
    title: "温馨提示",
    message: `文件上传成功！`,
    type: "success"
  });
};
const handleRegionChange = (value: any) => {
  if (value && value.length > 0) {
    drawerProps.value.row!.channel_region_code = value[value.length - 1];
  } else {
    drawerProps.value.row!.channel_region_code = "";
  }
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
const handlePreview = (uploadFile: UploadFile) => {
  window.open("/api/" + uploadFile.url, "_blank");
};
// json2formdata
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let params = JSON.parse(JSON.stringify(drawerProps.value.row));
      if (_fileList.value.length > 0) {
        params.files = _fileList.value.map(item => item.url);
      }
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
