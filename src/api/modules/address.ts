import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取孩子列表
export const getAddressList = (params: any) => {
  return http.get(PORT1 + `/address/list`, params, { loading: false });
};
// 新增地址
export const addAddress = (params: any) => {
  return http.post(PORT1 + `/address/add`, params, { loading: false });
};
// 更新地址
export const updateAddress = (params: any) => {
  return http.put(PORT1 + `/address/edit`, params, { loading: false });
};
// 删除地址
export const deleteAddress = (params: any) => {
  return http.delete(PORT1 + `/address/delete`, params, { loading: false });
};
// 获取用户自己的地址列表
export const getUserAddressOps = (params: any) => {
  return http.get(PORT1 + `/address/user/ops`, params, { loading: false });
};
