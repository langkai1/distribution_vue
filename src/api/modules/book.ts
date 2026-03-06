import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取图书列表
export const getBookList = (params: any) => {
  return http.get(PORT1 + `/book/list`, params, { loading: false });
};
// 新增图书
export const addBook = (params: any) => {
  return http.post(PORT1 + `/book/add`, params, { loading: false });
};
// 更新图书
export const updateBook = (params: any) => {
  return http.put(PORT1 + `/book/edit`, params, { loading: false });
};
// 删除图书
export const deleteBook = (params: any) => {
  return http.delete(PORT1 + `/book/delete`, params, { loading: false });
};
