import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取我的订单列表
export const getMyOrderList = (params: any) => {
  return http.get(PORT1 + `/order/my/list`, params, { loading: false });
};
// 获取会员订单列表
export const getMembershipOrderList = (params: any) => {
  return http.get(PORT1 + `/order/membership/list`, params, { loading: false });
};
// 获取系统订单列表
export const getSystemOrderList = (params: any) => {
  return http.get(PORT1 + `/order/system/list`, params, { loading: false });
};
// 新增订单
export const addOrder = (params: any) => {
  return http.post(PORT1 + `/order/add`, params, { loading: false });
};
// 获取用户可用积分
export const getUserAvailablePoints = (params: any) => {
  return http.get(PORT1 + `/user/balance`, params, { loading: false });
};
// 新增订单付款凭证
export const addOrderPayFile = (params: any) => {
  return http.post(PORT1 + `/order/pay/file/add`, params, { loading: false });
};
// 获取订单付款凭证
export const getOrderPayFile = (params: any) => {
  return http.get(PORT1 + `/order/pay/file`, params, { loading: false });
};
// 获取订单发货信息
export const getOrderDeliveryInfo = (params: any) => {
  return http.get(PORT1 + `/order/delivery/info`, params, { loading: false });
};
// 保存订单发货信息
export const saveOrderDeliveryInfo = (params: any) => {
  return http.post(PORT1 + `/order/delivery/info`, params, { loading: false });
};
// 设置订单完成
export const setOrderComplete = (params: any) => {
  return http.post(PORT1 + `/order/complete`, params, { loading: false });
};
