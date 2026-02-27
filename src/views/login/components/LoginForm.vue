<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.phone" placeholder="账号/手机号" autocomplete="phone">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password" style="margin-bottom: 15px">
      <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 15px">
      <el-checkbox v-model="loginForm.rememberPwd" size="small">记住密码</el-checkbox>
    </el-form-item>
  </el-form>
  <div class="login-btn" style="margin-top: 15px">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
  <div class="switch-form">
    <span class="switch-text">没有账号？</span>
    <el-link type="primary" :underline="false" class="switch-link" @click="switchToRegister">去注册</el-link>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { getTimeState } from "@/utils";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

const emit = defineEmits<{
  switchToRegister: [];
}>();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  phone: [{ required: true, message: "请输入账号/手机号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  phone: "",
  password: "",
  rememberPwd: false
});
// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      const { data }: any = await loginApi({ ...loginForm, password: loginForm.password });
      userStore.setToken(data.access_token);
      userStore.setUserInfo(data.userInfo);
      // 处理“记住密码”逻辑
      if (loginForm.rememberPwd) {
        // 设置7天有效期
        const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        // 【核心】只存账号+token，不存明文密码！
        const loginInfo = {
          phone: loginForm.phone,
          password: loginForm.password,
          expireTime
        };
        localStorage.setItem("el-plus-login-info", JSON.stringify(loginInfo));
      } else {
        // 不记住则清除存储
        localStorage.removeItem("el-plus-login-info");
      }
      await initDynamicRouter();

      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 智游乔家管理系统",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

const switchToRegister = () => {
  emit("switchToRegister");
};
// 4. 读取本地存储的账号密码（核心函数）
const loadRememberedPwd = () => {
  try {
    const storedLoginInfo = localStorage.getItem("el-plus-login-info");
    if (!storedLoginInfo) return;

    const { phone, password, expireTime } = JSON.parse(storedLoginInfo);
    // 检查是否过期（7天有效期）
    if (Date.now() < expireTime) {
      loginForm.phone = phone;
      // 【安全优化】不存储明文密码，只存token，此处模拟填充（实际项目用token自动登录）
      // loginForm.value.password = '' // 密码框为空，用token请求接口
      loginForm.password = password;
      loginForm.rememberPwd = true;
    } else {
      // 过期则清除存储
      localStorage.removeItem("el-plus-login-info");
    }
  } catch (error) {
    console.error("读取记住的密码失败：", error);
    localStorage.removeItem("el-plus-login-info"); // 存储异常则清除
  }
};
onMounted(() => {
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
  loadRememberedPwd();
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
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
