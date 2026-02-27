<template>
  <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
    <el-form-item prop="phone">
      <el-input v-model="registerForm.phone" placeholder="手机号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="登录密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input
        v-model="registerForm.confirmPassword"
        type="password"
        placeholder="再次输入密码"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="region">
      <el-cascader
        v-model="registerForm.region"
        :options="areaData"
        :props="cascaderProps"
        placeholder="请选择省/市/区"
        filterable
        clearable
        style="width: 100%"
        @change="handleAreaChange"
      />
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(registerFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="register(registerFormRef)">
      注册
    </el-button>
  </div>
  <div class="switch-form">
    <span class="switch-text">已有账号？</span>
    <el-link type="primary" :underline="false" class="switch-link" @click="handleSwitchToLogin">去登录</el-link>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { registerApi } from "@/api/modules/login";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm, FormRules, CascaderValue } from "element-plus";
import { regionData, codeToText } from "element-china-area-data";

const emit = defineEmits<{
  switchToLogin: [];
}>();

type FormInstance = InstanceType<typeof ElForm>;
const registerFormRef = ref<FormInstance>();

const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的手机号格式"));
  } else {
    callback();
  }
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能少于6位"));
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
    callback(new Error("密码必须包含字母和数字"));
  } else {
    callback();
  }
};

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const validateArea = (rule: any, value: any, callback: any) => {
  if (!value || value.length === 0) {
    callback(new Error("请选择省/市/区"));
  } else {
    callback();
  }
};

const registerRules = reactive<FormRules>({
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  password: [{ required: true, validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: "blur" }],
  region: [{ required: true, validator: validateArea, trigger: "change" }]
});

const cascaderProps = {
  value: "value",
  label: "label",
  children: "children"
};

const areaData = regionData as any;
const loading = ref(false);
const registerForm = reactive<Login.ReqRegisterForm>({
  phone: "",
  password: "",
  confirmPassword: "",
  region: [],
  code: ""
});

const handleAreaChange = (value: CascaderValue | null | undefined) => {
  if (value) {
    registerForm.code = (value as string[])[(value as string[]).length - 1];
  }
};

const register = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      registerForm.region = (registerForm.region as string[]).map((item: any) => codeToText[item]);
      await registerApi(registerForm);
      ElNotification({
        title: "注册成功",
        message: "请使用新账号登录",
        type: "success",
        duration: 3000
      });
      resetForm(formEl);
      emit("switchToLogin");
    } catch (error) {
      ElNotification({
        title: "注册失败",
        message: "注册失败，请稍后重试",
        type: "error",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleSwitchToLogin = () => {
  emit("switchToLogin");
};
</script>

<style scoped lang="scss">
@import "../index";
.switch-form {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
  .switch-text {
    margin-right: 4px;
  }
  .switch-link {
    padding: 2px 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
    &:hover {
      background-color: rgb(64 158 255 / 10%);
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
}

@media screen and (width <= 600px) {
  .switch-form {
    font-size: 13px;
    .switch-link {
      font-size: 13px;
    }
  }
}
</style>
