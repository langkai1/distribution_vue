<template>
  <div class="personal-container card">
    <el-button class="edit-button" type="primary" :icon="Edit" @click="openEditDrawer">编辑</el-button>
    <div class="personal-header">
      <div class="avatar-wrapper">
        <el-avatar :size="120" :src="user_info.avatar ? '/api/' + user_info.avatar : defaultAvatar">
          <el-icon v-if="!user_info.avatar"><User /></el-icon>
        </el-avatar>
      </div>
      <div class="user-info">
        <h2 class="nickname">{{ user_info.nickname || "未设置昵称" }}</h2>
        <div class="role-tags">
          <el-tag v-for="role in user_info.roles" :key="role" type="primary" size="large" effect="dark">
            {{ role }}
          </el-tag>
          <el-tag v-if="!user_info.roles || user_info.roles.length === 0" type="info" size="large"> 暂无角色 </el-tag>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="personal-content">
      <div class="info-section">
        <div class="section-title">
          <el-icon><Promotion /></el-icon>
          <span>邀请信息</span>
        </div>
        <div class="invite-card">
          <div class="invite-code-wrapper">
            <div class="invite-label">我的邀请码</div>
            <div class="invite-code-display">
              <el-input v-model="user_info.invite_code" placeholder="点击生成邀请码" readonly size="large" class="invite-input">
                <template #append>
                  <el-button type="primary" :icon="Refresh" @click="generateInviteCodeFun">
                    {{ user_info.invite_code ? "复制" : "生成" }}
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>邀请二维码</span>
        </div>
        <div class="qrcode-wrapper">
          <div v-if="user_info.qrcode_url" class="qrcode-card">
            <img :src="'/api/' + user_info.qrcode_url" alt="邀请二维码" class="qrcode-image" />
            <div class="qrcode-actions">
              <el-button type="primary" size="small" :icon="Download" @click="downloadQrcode"> 下载二维码 </el-button>
            </div>
          </div>
          <el-empty v-else description="暂无二维码" :image-size="120"></el-empty>
        </div>
      </div>

      <div class="info-section">
        <ChangePassword />
      </div>
    </div>

    <el-drawer v-model="drawerVisible" title="编辑个人信息" size="500px" :before-close="handleDrawerClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px" label-position="top">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <div class="avatar-upload">
            <UploadImg v-model:image-url="editForm.avatar" :file-size="3">
              <template #tip> 上传图片最大为 3M </template>
            </UploadImg>
          </div>
        </el-form-item>

        <el-form-item label="省/市/区" prop="region_pca">
          <el-cascader
            v-model="editForm.region_pca"
            :options="regionData as CascaderOption[]"
            :props="cascaderProps"
            placeholder="请选择省/市/区"
            filterable
            clearable
            style="width: 100%"
            @change="handleRegionChange"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="detailed_address">
          <el-input
            v-model="editForm.detailed_address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="home">
import { onMounted, ref, reactive } from "vue";
import { getUserInfo, generateInviteCode, updateUserInfo } from "@/api/modules/user";
import { CascaderOption, ElMessage, type FormInstance, type FormRules } from "element-plus";
import { User, Edit, Promotion, Grid, Refresh, Download } from "@element-plus/icons-vue";
import { codeToText, regionData } from "element-china-area-data";
import UploadImg from "@/components/Upload/Img.vue";
import { useUserStore } from "@/stores/modules/user";
import ChangePassword from "./components/ChangePassword.vue";

const defaultAvatar = "@/assets/images/avatar.gif";
const userStore = useUserStore();
const drawerVisible = ref(false);
const saveLoading = ref(false);
const editFormRef = ref<FormInstance>();

const user_info = ref<any>({
  id: "",
  nickname: "",
  avatar: "",
  roles: [],
  invite_code: "",
  qrcode_url: "",
  region_pca: "",
  region_code: "",
  detailed_address: ""
});

const editForm = reactive({
  nickname: "",
  avatar: "",
  region_pca: [] as any[],
  region_code: "",
  detailed_address: ""
});

const editRules = reactive<FormRules>({
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
  region_pca: [{ required: true, message: "请选择省/市/区", trigger: "change" }]
});

const cascaderProps = {
  value: "value",
  label: "label",
  children: "children"
};

onMounted(async () => {
  get_user_info();
});

const get_user_info = async () => {
  try {
    const { data }: any = await getUserInfo();
    user_info.value = data;
  } catch (error) {
    ElMessage.error("获取用户信息失败");
  }
};

const openEditDrawer = () => {
  editForm.nickname = user_info.value.nickname || "";
  if (user_info.value.avatar) {
    editForm.avatar = "/api/" + user_info.value.avatar;
  } else {
    editForm.avatar = "";
  }
  editForm.detailed_address = user_info.value.detailed_address || "";
  if (user_info.value.region_pca && user_info.value.region_code) {
    editForm.region_pca = [
      user_info.value.region_code.slice(0, 2),
      user_info.value.region_code.slice(0, 4),
      user_info.value.region_code
    ];
    editForm.region_code = user_info.value.region_code;
  }
  drawerVisible.value = true;
};

const handleDrawerClose = () => {
  editFormRef.value?.resetFields();
  drawerVisible.value = false;
};

const handleSave = async () => {
  if (!editFormRef.value) return;
  await editFormRef.value.validate(async valid => {
    if (!valid) return;
    saveLoading.value = true;
    try {
      const params = {
        nickname: editForm.nickname,
        avatar: editForm.avatar.replace("/api/", ""),
        region_pca: (editForm.region_pca as string[]).map((item: any) => codeToText[item]),
        region_code: editForm.region_code,
        detailed_address: editForm.detailed_address
      };
      await updateUserInfo(params);

      ElMessage.success("保存成功");
      let user_info = userStore.userInfo;
      user_info.name = editForm.nickname;
      user_info.avatar = editForm.avatar.replace("/api/", "");
      userStore.setUserInfo(user_info);
      drawerVisible.value = false;
      await get_user_info();
    } catch (error) {
      ElMessage.error("保存失败");
    } finally {
      saveLoading.value = false;
    }
  });
};

const handleRegionChange = (value: any) => {
  if (value && value.length > 0) {
    editForm.region_code = value[value.length - 1];
  } else {
    editForm.region_code = "";
  }
};

const generateInviteCodeFun = async () => {
  if (user_info.value.invite_code) {
    navigator.clipboard.writeText(user_info.value.invite_code);
    ElMessage.success("邀请码已复制");
    return;
  }
  ElMessage.info("正在生成邀请码...");
  await generateInviteCode();
  get_user_info();
};

const downloadQrcode = () => {
  if (!user_info.value.qrcode_url) {
    ElMessage.warning("暂无二维码可下载");
    return;
  }
  const link = document.createElement("a");
  link.href = "/api/" + user_info.value.qrcode_url;
  link.download = "邀请二维码.png";
  link.click();
  ElMessage.success("二维码下载成功");
};
</script>

<style scoped lang="scss">
.personal-container {
  position: relative;
  max-width: 800px;
  padding: 40px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
  animation: fadeIn 0.5s ease-in-out;
}
.edit-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.personal-header {
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 20px 0;
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
    .avatar-badge {
      opacity: 1;
    }
  }
  .avatar-badge {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 18px;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}
.user-info {
  flex: 1;
  min-width: 0;
}
.nickname {
  margin: 0 0 15px;
  overflow: hidden;
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-overflow: ellipsis;
  text-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  white-space: nowrap;
}
.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.el-divider {
  margin: 30px 0;
  background-color: rgb(255 255 255 / 20%);
}
.personal-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.info-section {
  padding: 25px;
  background: rgb(255 255 255 / 95%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 12%);
    transform: translateY(-5px);
  }
}
.section-title {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  .el-icon {
    font-size: 22px;
    color: #667eea;
  }
}
.invite-card {
  padding: 10px 0;
}
.invite-code-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.invite-label {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
}
.invite-code-display {
  .invite-input {
    :deep(.el-input__inner) {
      font-family: "Courier New", monospace;
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 2px;
    }
  }
}
.qrcode-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.qrcode-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
}
.qrcode-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
}
.qrcode-actions {
  display: flex;
  gap: 12px;
}
.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.avatar-uploader {
  :deep(.el-upload) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    transition: all 0.3s;
    &:hover {
      border-color: #667eea;
    }
  }
}
.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.upload-tip {
  font-size: 12px;
  line-height: 1.5;
  color: #999999;
}
.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media screen and (width <= 768px) {
  .personal-container {
    padding: 20px;
    margin: 10px;
  }
  .edit-button {
    top: 15px;
    right: 15px;
    padding: 6px 16px;
    font-size: 13px;
  }
  .personal-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  .avatar-wrapper {
    margin: 0 auto;
  }
  .nickname {
    font-size: 24px;
  }
  .role-tags {
    justify-content: center;
  }
  .info-section {
    padding: 20px;
  }
  .qrcode-image {
    width: 150px;
    height: 150px;
  }
  .qrcode-actions {
    flex-direction: column;
    width: 100%;
    .el-button {
      width: 100%;
    }
  }
  .avatar-uploader {
    :deep(.el-upload) {
      width: 100px;
      height: 100px;
    }
  }
  .avatar-preview {
    width: 100px;
    height: 100px;
  }
}
</style>
