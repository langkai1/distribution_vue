import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取菜单列表
export const getMenuList = () => {
  return http.get(PORT1 + `/menu/list`, {}, { loading: false });
};
