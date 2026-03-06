import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取图书列表
export const getNewsList = (params: any) => {
  return http.get(PORT1 + `/news/list`, params, { loading: false });
};
// 新增新闻
export const addNews = (params: any) => {
  return http.post(PORT1 + `/news/add`, params, { loading: false });
};
// 更新新闻
export const updateNews = (params: any) => {
  return http.put(PORT1 + `/news/edit`, params, { loading: false });
};
// 删除新闻
export const deleteNews = (params: any) => {
  return http.delete(PORT1 + `/news/delete`, params, { loading: false });
};
