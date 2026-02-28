<template>
  <div class="change-password-container">
    <div class="section-title">
      <el-icon><Lock /></el-icon>
      <span>修改密码</span>
    </div>
    <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px" label-position="top">
      <el-form-item label="原始密码" prop="old_password">
        <el-input
          v-model="passwordForm.old_password"
          type="password"
          placeholder="请输入原始密码"
          show-password
          autocomplete="current-password"
          maxlength="20"
        />
      </el-form-item>

      <el-form-item label="新密码" prop="new_password">
        <el-input
          v-model="passwordForm.new_password"
          type="password"
          placeholder="请输入新密码"
          show-password
          autocomplete="new-password"
          maxlength="20"
          @input="handlePasswordInput"
        />
        <div class="password-strength">
          <div class="strength-text" :class="strengthClass">{{ strengthText }}</div>
        </div>
      </el-form-item>

      <el-form-item label="确认新密码" prop="confirm_password">
        <el-input
          v-model="passwordForm.confirm_password"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          autocomplete="new-password"
          maxlength="20"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" :icon="Lock" @click="handleSubmit"> 修改密码 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="ChangePassword">
import { ref, reactive, computed } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Lock } from "@element-plus/icons-vue";
import { updateUserPassword } from "@/api/modules/user";

const emit = defineEmits<{
  success: [];
}>();

const passwordFormRef = ref<FormInstance>();
const loading = ref(false);

const passwordForm = reactive({
  old_password: "",
  new_password: "",
  confirm_password: ""
});

const validateOldPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入原始密码"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能少于6位"));
  } else {
    callback();
  }
};

const validateNewPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入新密码"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能少于6位"));
  } else if (value === passwordForm.old_password) {
    callback(new Error("新密码不能与原始密码相同"));
  } else {
    callback();
  }
};

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请再次输入新密码"));
  } else if (value !== passwordForm.new_password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const passwordRules = reactive<FormRules>({
  old_password: [{ required: true, validator: validateOldPassword, trigger: "blur" }],
  new_password: [{ required: true, validator: validateNewPassword, trigger: "blur" }],
  confirm_password: [{ required: true, validator: validateConfirmPassword, trigger: "blur" }]
});

const passwordStrength = computed(() => {
  const password = passwordForm.new_password;
  if (!password) return 0;

  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
});

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "";
  if (strength === 1) return "弱";
  if (strength === 2) return "中";
  if (strength === 3) return "强";
  return "非常强";
});

const strengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "";
  if (strength === 1) return "weak";
  if (strength === 2) return "medium";
  if (strength === 3) return "strong";
  return "very-strong";
});

const handlePasswordInput = () => {
  passwordFormRef.value?.validateField("new_password");
};

const handleSubmit = () => {
  if (!passwordFormRef.value) return;
  passwordFormRef.value.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      await updateUserPassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      ElMessage.success("密码修改成功，请重新登录");
      emit("success");
      resetForm();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error("密码修改失败，请检查原始密码是否正确");
      }
    } finally {
      loading.value = false;
    }
  });
};

const resetForm = () => {
  passwordForm.old_password = "";
  passwordForm.new_password = "";
  passwordForm.confirm_password = "";
  passwordFormRef.value?.resetFields();
};
</script>

<style scoped lang="scss">
.change-password-container {
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
  margin-bottom: 25px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  .el-icon {
    font-size: 22px;
    color: #667eea;
  }
}
.password-strength {
  padding: 0 16px;
  margin-top: 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  .strength-bar {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    .strength-item {
      flex: 1;
      height: 6px;
      background: #e4e7ed;
      border-radius: 3px;
      transition: all 0.3s ease;
      &.active {
        &:nth-child(1) {
          background: #f56c6c;
        }
        &:nth-child(2) {
          background: #e6a23c;
        }
        &:nth-child(3) {
          background: #409eff;
        }
        &:nth-child(4) {
          background: #67c23a;
        }
      }
    }
  }
  .strength-text {
    font-size: 13px;
    font-weight: 500;
    color: #909399;
    text-align: center;
    transition: color 0.3s ease;
    &.weak {
      color: #f56c6c;
    }
    &.medium {
      color: #e6a23c;
    }
    &.strong {
      color: #409eff;
    }
    &.very-strong {
      color: #67c23a;
    }
  }
}
.el-form-item {
  margin-bottom: 22px;
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }
  :deep(.el-input__wrapper) {
    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset;
    }
  }
}
.el-button {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  font-size: 15px;
  border-radius: 8px;
}

@media screen and (width <= 768px) {
  .change-password-container {
    padding: 20px;
  }
  .section-title {
    font-size: 16px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  .el-button {
    height: 38px;
    font-size: 14px;
  }
}
</style>
