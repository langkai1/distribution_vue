<template>
  <div class="upload-box">
    <el-upload
      :id="uuid"
      action="#"
      :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="false"
      :disabled="self_disabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="fileUrl">
        <div class="file-preview">
          <!-- 根据文件类型显示不同图标 -->
          <el-icon v-if="isImage" class="file-icon">
            <Picture />
          </el-icon>
          <el-icon v-else-if="isDocument" class="file-icon">
            <Document />
          </el-icon>
          <el-icon v-else-if="isArchive" class="file-icon">
            <Collection />
          </el-icon>
          <el-icon v-else class="file-icon">
            <Folder />
          </el-icon>

          <div class="file-info">
            <div class="file-name" :title="fileName">{{ fileName }}</div>
            <div class="file-size">{{ fileSizeFormatted }}</div>
          </div>
        </div>

        <div class="upload-handle" @click.stop>
          <div v-if="!self_disabled" class="handle-icon" @click="editFile">
            <el-icon><Edit /></el-icon>
            <span>替换</span>
          </div>
          <div class="handle-icon" @click="handleFileOpen">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div v-if="!self_disabled" class="handle-icon" @click="deleteFile">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Upload /></el-icon>
            <span>拖放文件到此处，或点击上传</span>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <!-- 图片预览保留，其他文件类型使用新窗口打开 -->
    <el-image-viewer v-if="imgViewVisible && isImage" :url-list="[fileUrl]" @close="imgViewVisible = false" />
  </div>
</template>

<script setup lang="ts" name="UploadFile">
import { ref, computed, inject } from "vue";
import { generateUUID } from "@/utils";
import { uploadSysFile } from "@/api/modules/system_file"; // 建议修改API名称为更通用的uploadFile
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
// 引入需要的图标
import { Upload, Edit, ZoomIn, Delete, Picture, Document, Collection, Folder } from "@element-plus/icons-vue";

interface UploadFileProps {
  fileUrl: string; // 文件地址 ==> 必传
  fileId?: number; // 文件id ==> 非必传
  api?: (params: any) => Promise<any>; // 上传文件的api方法 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 文件大小限制 ==> 非必传（默认为 10M）
  fileType?: string[]; // 文件类型限制 ==> 非必传（默认支持常见类型）
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  fileUrl: "",
  drag: true,
  disabled: false,
  fileSize: 10, // 增大默认文件大小限制
  fileType: () => [
    // 默认支持更多文件类型  添加视频和音频文件类型
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-rar-compressed",
    "text/plain",
    ".woff2",
    ".woff",
    ".ttf",
    ".otf",
    "video/mp4",
    "audio/mpeg"
  ],
  height: "150px",
  width: "150px",
  borderRadius: "8px"
});

// 生成组件唯一id
const uuid = ref("id-" + generateUUID());

// 状态管理
const imgViewVisible = ref(false);
const selectedFile = ref<File | null>(null);
const formContext = inject(formContextKey, void 0);
const formItemContext = inject(formItemContextKey, void 0);

// 计算属性
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

// 文件类型判断
const isImage = computed(() => {
  const ext = getFileExtension();
  return ["png", "jpg", "jpeg", "gif"].includes(ext);
});

const isDocument = computed(() => {
  const ext = getFileExtension();
  return ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(ext);
});

const isArchive = computed(() => {
  const ext = getFileExtension();
  return ["zip", "rar"].includes(ext);
});

// 文件信息提取
const fileName = computed(() => {
  if (!props.fileUrl) return "";
  return props.fileUrl.split("/").pop() || "";
});

const fileSizeFormatted = computed(() => {
  if (!selectedFile.value) return "";
  const size = selectedFile.value.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
});

// 辅助方法
function getFileExtension() {
  if (!fileName.value) return "";
  return fileName.value.split(".").pop()?.toLowerCase() || "";
}

// 事件定义
const emit = defineEmits<{
  "update:fileUrl": [value: string];
  fileSelected: [file: File]; // 新增文件选择事件
}>();

/**
 * 文件上传处理
 */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  selectedFile.value = options.file;
  let formData = new FormData();
  formData.append("file", options.file);
  if (props.fileId) {
    formData.append("fileId", props.fileId.toString());
  }
  try {
    const api = props.api ?? uploadSysFile;
    const { data } = await api(formData);
    emit("update:fileUrl", data.fileUrl);
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
    // eslint-disable-next-line vue/require-explicit-emits
    emit("fileSelected", options.file);
  } catch (error) {
    options.onError(error as any);
  }
};

/**
 * 删除文件
 */
const deleteFile = () => {
  emit("update:fileUrl", "");
  selectedFile.value = null;
};

/**
 * 替换文件
 */
const editFile = () => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
  dom && dom.dispatchEvent(new MouseEvent("click"));
};

/**
 * 打开文件
 */
const handleFileOpen = () => {
  if (isImage.value) {
    imgViewVisible.value = true;
  } else if (props.fileUrl) {
    // 非图片文件在新窗口打开
    window.open(props.fileUrl, "_blank");
  }
};

/**
 * 上传前校验
 */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  selectedFile.value = rawFile;
  const fileSize = rawFile.size / 1024 / 1024 < props.fileSize;
  if (rawFile.type) {
    const fileType = props.fileType.includes(rawFile.type);

    if (!fileType) {
      ElNotification({
        title: "格式错误",
        message: `上传文件不符合所需格式！支持: ${props.fileType.join(", ")}`,
        type: "warning"
      });
    }
  }
  if (!fileSize) {
    setTimeout(() => {
      ElNotification({
        title: "大小超限",
        message: `上传文件大小不能超过 ${props.fileSize}M！`,
        type: "warning"
      });
    }, 0);
  }

  return fileSize;
};

/**
 * 上传成功回调
 */
const uploadSuccess = () => {
  ElNotification({
    title: "上传成功",
    message: "文件上传成功！",
    type: "success"
  });
};

/**
 * 上传失败回调
 */
const uploadError = () => {
  ElNotification({
    title: "上传失败",
    message: "文件上传失败，请重新尝试！",
    type: "error"
  });
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .file-preview {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 10px;
      }
      .file-icon {
        margin-right: 10px;
        font-size: 36px;
        color: var(--el-color-primary);
      }
      .file-info {
        max-width: calc(100% - 50px);
        overflow: hidden;
      }
      .file-name {
        overflow: hidden;
        font-size: 14px;
        line-height: 1.5;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .file-size {
        font-size: 12px;
        line-height: 1.5;
        color: var(--el-text-color-secondary);
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          margin-bottom: 8px;
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    margin-top: 8px;
    line-height: 18px;
    text-align: center;
  }
}
</style>
