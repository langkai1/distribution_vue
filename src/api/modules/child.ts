import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取孩子列表
export const getChildList = (params: any) => {
  return http.get(PORT1 + `/child/list`, params, { loading: false });
};
// 新增孩子
export const addChild = (params: any) => {
  return http.post(PORT1 + `/child/add`, params, { loading: false });
};
// 更新孩子
export const updateChild = (params: any) => {
  return http.put(PORT1 + `/child/edit`, params, { loading: false });
};
// 删除孩子
export const deleteChild = (params: any) => {
  return http.delete(PORT1 + `/child/delete`, params, { loading: false });
};
