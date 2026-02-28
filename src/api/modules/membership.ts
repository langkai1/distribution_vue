import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取孩子列表
export const getActivateList = (params: any) => {
  return http.get(PORT1 + `/activate/list`, params, { loading: false });
};
// 设置审核状态
export const setActivateStatus = (params: any) => {
  return http.post(PORT1 + `/activate/set_status`, params, { loading: false });
};
