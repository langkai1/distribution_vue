<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left3.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo1.svg" alt="" />
          <h2 class="logo-text">智游乔家管理系统</h2>
        </div>
        <LoginForm v-if="currentForm === 'login'" key="login" @switch-to-register="switchToRegister" />
        <RegisterForm v-else key="register" @switch-to-login="switchToLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";

const currentForm = ref<"login" | "register">("login");

const switchToRegister = () => {
  currentForm.value = "register";
  console.log(currentForm.value);
};

const switchToLogin = () => {
  currentForm.value = "login";
};
</script>

<style scoped lang="scss">
@import "./index";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
