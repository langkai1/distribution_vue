import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取菜单列表
export const getMenuList = (params: any) => {
  return http.get(PORT1 + `/menu/list/config`, params, { loading: false });
};
// 获取菜单通过角色id
export const getMenuIdsByRoleId = (params: any) => {
  return http.get(PORT1 + `/menu/role_ids`, params, { loading: false });
};
// 保存角色菜单
export const saveRoleMenu = (params: any) => {
  return http.post(PORT1 + `/menu/save/role`, params, { loading: false });
};
// 获取菜单筛选ops
export const getMenuOps = (params: any) => {
  return http.get(PORT1 + `/menu/ops`, params, { loading: false });
};
// 获取菜单详情
export const getMenuDetail = (params: any) => {
  return http.get(PORT1 + `/menu/detail`, params, { loading: false });
};
// 新增菜单
export const addMenu = (params: any) => {
  return http.post(PORT1 + `/menu/add/config`, params, { loading: false });
};
// 编辑菜单
export const editMenu = (params: any) => {
  return http.put(PORT1 + `/menu/update/config`, params, { loading: false });
};
