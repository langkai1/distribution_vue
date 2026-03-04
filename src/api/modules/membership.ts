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
// 获取会员列表
export const getMemberList = (params: any) => {
  return http.get(PORT1 + `/membership/list`, params, { loading: false });
};
// 开通渠道合伙人
export const openChannelPartner = (params: any) => {
  return http.post(PORT1 + `/user/open_channel_partner`, params, { loading: false });
};
// 获取渠道合伙人参数设置
export const getChannelSet = () => {
  return http.get(PORT1 + `/system_params/channel_set`, {}, { loading: false });
};
// 获取保证金退还列表
export const getReturnDepositList = (params: any) => {
  return http.get(PORT1 + `/return_deposit/list`, params, { loading: false });
};
// 设置保证金退还审核状态
export const setReturnDepositStatus = (params: any) => {
  return http.post(PORT1 + `/return_deposit/set_status`, params, { loading: false });
};
