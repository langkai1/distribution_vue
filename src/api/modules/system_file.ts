import { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadSysFile = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/wx/file/upload`, params, { cancel: false });
};
// 通用文件上传
export const uploadFile = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload`, params, { cancel: false });
};

// 文件列表
export const getSysFileList = (params: any) => {
  return http.get(PORT1 + `/wx/file/list`, params, { loading: false });
};

// 保存新增文件
export const addSysFile = (params: any) => {
  return http.post(PORT1 + `/wx/file/create`, params, { loading: false });
};

// 更新文件
export const updateSysFile = (params: any) => {
  return http.put(PORT1 + `/wx/file/update`, params, { loading: false });
};

// 删除文件
export const deleteSysFile = (params: any) => {
  return http.delete(PORT1 + `/wx/file/delete`, params, { loading: false });
};
