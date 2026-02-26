import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取系统参数列表
export const getSystemParamsList = (params: any) => {
  return http.get(PORT1 + `/system_params/list`, params, { loading: false });
};
// 新增系统参数
export const addSystemParams = (params: any) => {
  return http.post(PORT1 + `/system_params/add`, params, { loading: false });
};
// 更新系统参数
export const updateSystemParams = (params: any) => {
  return http.put(PORT1 + `/system_params/update`, params, { loading: false });
};

// 获取小程序基础配置
export const getMiniWxBaseConf = () => {
  return http.get(PORT1 + `/mini_wx_base_conf`, {}, { loading: false });
};
// 保存小程序基础配置
export const saveMiniWxBaseConf = (params: any) => {
  return http.post(PORT1 + `/mini_wx_base_conf/save`, params, { loading: false });
};

// 获取支付配置
export const getPaymentConf = () => {
  return http.get(PORT1 + `/payment_conf`, {}, { loading: false });
};
// 保存支付配置
export const savePaymentConf = (params: any) => {
  return http.post(PORT1 + `/payment_conf/save`, params, { loading: false });
};

// 获取小程序基础配置
export const getMiniWxConf = () => {
  return http.get(PORT1 + `/mini_wx/config`, {}, { loading: false });
};
// 保存小程序基础配置
export const saveMiniWxConf = (params: any) => {
  return http.post(PORT1 + `/mini_wx/save`, params, { loading: false });
};

// 获取小程序基础配置
export const getArConf = () => {
  return http.get(PORT1 + `/mini_wx/config/ar_json`, {}, { loading: false });
};
// 保存小程序基础配置
export const saveArConf = (params: any) => {
  return http.post(PORT1 + `/mini_wx/ar_json/save`, params, { loading: false });
};
// 获取pc_map配置
export const getPcMapConf = () => {
  return http.get(PORT1 + `/pc_map/config`, {}, { loading: false });
};
// 保存pc_map配置
export const savePcMapConf = (params: any) => {
  return http.post(PORT1 + `/pc_map/config/save`, params, { loading: false });
};
