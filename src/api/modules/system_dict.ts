import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取系统字典列表
export const getSystemDictList = (params: any) => {
  return http.get(PORT1 + `/system_dict/list`, params, { loading: false });
};
// 新增系统字典
export const addSystemDict = (params: any) => {
  return http.post(PORT1 + `/system_dict/add`, params, { loading: false });
};
// 更新系统字典
export const updateSystemDict = (params: any) => {
  return http.put(PORT1 + `/system_dict/update`, params, { loading: false });
};

export const getSystemDictOps = (params: any) => {
  return http.get(PORT1 + `/system_dict/ops`, params, { loading: false });
};
