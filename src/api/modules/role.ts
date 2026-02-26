import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取角色列表
export const getRoleList = (params: any) => {
  return http.get(PORT1 + `/role/list`, params, { loading: false });
};
// 新增角色
export const addRole = (params: any) => {
  return http.post(PORT1 + `/role/add`, params, { loading: false });
};
// 更新角色
export const updateRole = (params: any) => {
  return http.put(PORT1 + `/role/update`, params, { loading: false });
};

// 获取角色详情
export const getRoleOps = (params: any) => {
  return http.get(PORT1 + `/role/ops`, params, { loading: false });
};
