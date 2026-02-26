import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取路线列表
export const getRouteList = (params: any) => {
  return http.get(PORT1 + `/route/list`, params, { loading: false });
};

// 新增路线
export const addRoute = (params: any) => {
  return http.post(PORT1 + `/route/add`, params, { loading: false });
};
// 编辑路线
export const editRoute = (params: any) => {
  return http.put(PORT1 + `/route/update`, params, { loading: false });
};
// 删除路线
export const deleteRoute = (params: any) => {
  return http.delete(PORT1 + `/route/delete`, params, { loading: false });
};
// 修改路线status
export const updateRouteStatus = (params: any) => {
  return http.put(PORT1 + `/route/status`, params, { loading: false });
};

// 新增路线点位
export const addRoutePoint = (params: any) => {
  return http.post(PORT1 + `/route/point/add`, params, { loading: false });
};

// 修改路线点位排序
export const changePointRouterOrderNum = (params: any) => {
  return http.put(PORT1 + `/route/point/orderNum`, params, { loading: false });
};
// 删除路线点位
export const deletePointRouter = (params: any) => {
  return http.delete(PORT1 + `/route/point/delete`, params, { loading: false });
};

// 重置路线点位排序
export const resetPointRouterOrderNum = (params: any) => {
  return http.put(PORT1 + `/route/point/resetOrderNum`, params, { loading: false });
};
