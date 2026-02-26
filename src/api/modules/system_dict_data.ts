import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取系统字典列表
export const getSystemDataList = (params: any) => {
  return http.get(PORT1 + `/system_dict_data/list`, params, { loading: false });
};
// 新增系统字典数据
export const addSystemData = (params: any) => {
  return http.post(PORT1 + `/system_dict_data/add`, params, { loading: false });
};
// 更新系统字典数据
export const updateSystemData = (params: any) => {
  return http.put(PORT1 + `/system_dict_data/update`, params, { loading: false });
};

// 获取系统字典数据详情
export const getSystemDataOps = (params: any) => {
  return http.get(PORT1 + `/system_dict_data/ops`, params, { loading: false });
};
