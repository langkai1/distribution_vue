<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="会员列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" @click="handleSubmit"> 开通渠道合伙人 </el-button>
        </template>
        <!-- 菜单操作 -->
      </ProTable>
      <RoleDrawer ref="roleDrawer" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getMemberList, openChannelPartner, getChannelSet } from "@/api/modules/membership";
import RoleDrawer from "./components/RoleDrawer.vue";
import { ref } from "vue";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getMemberList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
const roleDrawer = ref();
const handleSubmit = async () => {
  const { data }: any = await getChannelSet();
  roleDrawer.value.acceptParams({
    title: "开通渠道合伙人",
    row: {
      goods_deposit: data.bhk,
      deposit: data.bzj,
      validity_date: data.yxq
    },
    api: openChannelPartner,
    getTableList: proTable.value.getTableList
  });
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "user_name", align: "left", label: "用户昵称", showOverflowTooltip: false, width: 120 },
  { prop: "phone", align: "left", label: "手机号", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  {
    prop: "region_pca",
    label: "所在地区",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "level",
    label: "会员等级"
  },
  {
    prop: "total_order_num",
    label: "累计出货量"
  },
  {
    prop: "is_channel",
    label: "是否渠道合伙人",
    enum: [
      { label: "否", value: false },
      { label: "是", value: true }
    ]
  }
];
</script>
