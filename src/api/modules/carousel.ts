import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 获取轮播列表
export const getCarouselList = (params: any) => {
  return http.get(PORT1 + `/carousel/list`, params, { loading: false });
};
// 新增轮播
export const addCarousel = (params: any) => {
  return http.post(PORT1 + `/carousel/add`, params, { loading: false });
};
// 更新轮播
export const updateCarousel = (params: any) => {
  return http.put(PORT1 + `/carousel/edit`, params, { loading: false });
};
// 删除轮播
export const deleteCarousel = (params: any) => {
  return http.delete(PORT1 + `/carousel/delete`, params, { loading: false });
};
