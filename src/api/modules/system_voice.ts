import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取语音导航配置列表
export const getVoiceList = (params: any) => {
  return http.get(PORT1 + `/voice/list`, params, { loading: false });
};

// 新增语音导航配置
export const addVoice = (params: any) => {
  return http.post(PORT1 + `/voice/create`, params, { loading: false });
};
// 编辑语音导航配置
export const editVoice = (params: any) => {
  return http.put(PORT1 + `/voice/update`, params, { loading: false });
};
// 设置语音导航配置是否启用
export const setVoiceEnabled = (params: any) => {
  return http.put(PORT1 + `/voice/enabled`, params, { loading: false });
};

// 上传语音导航配置导入文件
export const uploadVoiceFile = (params: FormData) => {
  return http.post(PORT1 + `/file/upload/voice`, params, { loading: false });
};

// 删除语音导航配置文件
export const deleteVoiceFile = (params: any) => {
  return http.delete(PORT1 + `/file/delete/voice`, params, { loading: false });
};
