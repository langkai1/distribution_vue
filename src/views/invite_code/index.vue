<template>
  <div class="account-activate-container card">
    <div class="account-header">
      <div class="header-icon">
        <el-icon :size="60" color="#667eea"><Key /></el-icon>
      </div>
      <h2 class="header-title">账号开通</h2>
      <p class="header-desc">填写以下信息提交账号开通申请，等待管理员审核</p>
    </div>

    <el-divider />

    <div class="account-content">
      <div class="status-section" v-if="accountStatus">
        <div class="status-card" :class="statusClass">
          <div class="status-icon">
            <el-icon :size="40">
              <Clock v-if="accountStatus.status === 0" />
              <CircleCheck v-else-if="accountStatus.status === 1" />
              <CircleClose v-else />
            </el-icon>
          </div>
          <div class="status-info">
            <h3 class="status-title">{{ statusTitle }}</h3>
            <p class="status-desc">{{ statusDesc }}</p>
            <p v-if="accountStatus.status === 2 && accountStatus.reject_reason" class="reject-reason">
              拒绝原因：{{ accountStatus.reject_reason }}
            </p>
            <p class="status-time">提交时间：{{ formatDate(accountStatus.create_time) }}</p>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>{{ isReadOnly ? "开通信息" : "填写开通信息" }}</span>
        </div>

        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="top">
          <el-form-item label="机器SN码" prop="sn_code">
            <el-input
              v-model="formData.sn_code"
              placeholder="请输入机器SN码"
              :readonly="isReadOnly"
              maxlength="50"
              show-word-limit
              clearable
            >
              <template #prefix>
                <el-icon><Cpu /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="激活码" prop="activate_code">
            <el-input
              v-model="formData.activate_code"
              placeholder="请输入激活码"
              :readonly="isReadOnly"
              maxlength="50"
              show-word-limit
              clearable
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="邀请码" prop="invite_code">
            <el-input
              v-model="formData.invite_code"
              placeholder="请输入邀请码"
              :readonly="isReadOnly"
              maxlength="50"
              show-word-limit
              clearable
            >
              <template #prefix>
                <el-icon><Promotion /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item v-if="!accountStatus">
            <el-button type="primary" :loading="submitting" :icon="Check" size="large" @click="handleSubmit">
              {{ submitting ? "提交中..." : "提交申请" }}
            </el-button>
          </el-form-item>

          <el-form-item v-if="accountStatus?.status === 2">
            <el-button type="danger" :icon="Refresh" size="large" @click="handleResubmit"> 重新提交 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="invite_code">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Key, EditPen, Clock, CircleCheck, CircleClose, Check, Refresh, Cpu, Promotion } from "@element-plus/icons-vue";
import { submitAccountActivate, getAccountStatus } from "@/api/modules/user";
import type { Account } from "@/api/interface/index";

const formRef = ref<FormInstance>();
const submitting = ref(false);
const accountStatus = ref<Account.ResAccountStatus | null>(null);

const formData = reactive({
  sn_code: "",
  activate_code: "",
  invite_code: ""
});

const validateSnCode = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入机器SN码"));
  } else if (value.length < 5) {
    callback(new Error("SN码长度不能少于5位"));
  } else {
    callback();
  }
};

const validateActivateCode = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入激活码"));
  } else if (value.length < 5) {
    callback(new Error("激活码长度不能少于5位"));
  } else {
    callback();
  }
};

const validateInviteCode = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入邀请码"));
  } else if (value.length < 4) {
    callback(new Error("邀请码长度不能少于4位"));
  } else {
    callback();
  }
};

const formRules = reactive<FormRules>({
  sn_code: [{ required: true, validator: validateSnCode, trigger: "blur" }],
  activate_code: [{ required: true, validator: validateActivateCode, trigger: "blur" }],
  invite_code: [{ required: true, validator: validateInviteCode, trigger: "blur" }]
});

const isReadOnly = computed(() => {
  return !!(accountStatus.value && accountStatus.value.status !== 2);
});

const statusClass = computed(() => {
  if (!accountStatus.value) return "";
  const status = accountStatus.value.status;
  if (status === 0) return "status-pending";
  if (status === 1) return "status-approved";
  return "status-rejected";
});

const statusTitle = computed(() => {
  if (!accountStatus.value) return "";
  const status = accountStatus.value.status;
  if (status === 0) return "等待管理员审核";
  if (status === 1) return "审核通过";
  return "审核被拒绝";
});

const statusDesc = computed(() => {
  if (!accountStatus.value) return "";
  const status = accountStatus.value.status;
  if (status === 0) return "您的申请已提交，请耐心等待管理员审核";
  if (status === 1) return "恭喜！您的账号已成功开通，可以开始使用系统功能";
  return "很抱歉，您的申请未通过审核";
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const handleSubmit = () => {
  if (!formRef.value) return;
  formRef.value.validate(async valid => {
    if (!valid) return;
    submitting.value = true;
    try {
      await submitAccountActivate({
        sn_code: formData.sn_code,
        activate_code: formData.activate_code,
        invite_code: formData.invite_code
      });
      ElMessage.success("申请提交成功，请等待管理员审核");
      await fetchAccountStatus();
    } finally {
      submitting.value = false;
    }
  });
};

const handleResubmit = () => {
  accountStatus.value = null;
  formRef.value?.resetFields();
  ElMessage.info("请重新填写信息并提交申请");
};

const fetchAccountStatus = async () => {
  try {
    const response = await getAccountStatus();
    accountStatus.value = response.data;
    if (response.data) {
      formData.sn_code = response.data.sn_code;
      formData.activate_code = response.data.activate_code;
      formData.invite_code = response.data.invite_code;
    }
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      console.error("获取审核状态失败:", error);
    }
  }
};

onMounted(() => {
  fetchAccountStatus();
});
</script>

<style scoped lang="scss">
.account-activate-container {
  max-width: 800px;
  padding: 40px;
  margin: 0 auto;
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
.account-header {
  margin-bottom: 20px;
  text-align: center;
  .header-icon {
    margin-bottom: 20px;
  }
  .header-title {
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
  }
  .header-desc {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}
.el-divider {
  margin: 30px 0;
}
.account-content {
  .status-section {
    margin-bottom: 30px;
    .status-card {
      display: flex;
      gap: 20px;
      padding: 25px;
      border-radius: 12px;
      transition: all 0.3s ease;
      &.status-pending {
        background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
        border: 1px solid #ffd591;
        .status-icon {
          color: #faad14;
        }
        .status-title {
          color: #d48806;
        }
      }
      &.status-approved {
        background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
        border: 1px solid #b7eb8f;
        .status-icon {
          color: #52c41a;
        }
        .status-title {
          color: #389e0d;
        }
      }
      &.status-rejected {
        background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
        border: 1px solid #ffa39e;
        .status-icon {
          color: #f5222d;
        }
        .status-title {
          color: #cf1322;
        }
      }
      .status-icon {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      }
      .status-info {
        flex: 1;
        .status-title {
          margin-bottom: 8px;
          font-size: 20px;
          font-weight: 600;
        }
        .status-desc {
          margin-bottom: 8px;
          font-size: 14px;
          color: #606266;
        }
        .reject-reason {
          padding: 8px 12px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #f5222d;
          background: white;
          border-radius: 6px;
        }
        .status-time {
          margin: 0;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
  .form-section {
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
    .el-form {
      max-width: 600px;
      margin: 0 auto;
    }
    .el-form-item {
      margin-bottom: 25px;
      :deep(.el-form-item__label) {
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }
      :deep(.el-input__wrapper) {
        &:hover {
          box-shadow: 0 0 0 1px #c0c4cc inset;
        }
        &.is-focus {
          box-shadow: 0 0 0 1px #667eea inset;
        }
        .el-input__prefix {
          color: #909399;
        }
      }
    }
    .el-button {
      width: 100%;
      height: 44px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 4px 12px rgb(102 126 234 / 30%);
        transform: translateY(-2px);
      }
      &:active {
        transform: translateY(0);
      }
    }
  }
}

@media screen and (width <= 768px) {
  .account-activate-container {
    padding: 25px 20px;
    margin: 0 10px;
  }
  .account-header {
    .header-title {
      font-size: 24px;
    }
    .header-desc {
      font-size: 13px;
    }
  }
  .account-content {
    .status-section {
      .status-card {
        flex-direction: column;
        gap: 15px;
        padding: 20px;
        text-align: center;
        .status-icon {
          margin: 0 auto;
        }
      }
    }
    .form-section {
      .section-title {
        font-size: 16px;
      }
      .el-form {
        max-width: 100%;
      }
      .el-button {
        height: 40px;
        font-size: 15px;
      }
    }
  }
}
</style>
