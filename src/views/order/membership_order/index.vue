<template>
  <div class="main-box">
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <ProTable
        ref="proTable"
        title="会员订单列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        table-layout="auto"
        :init-param="Object.assign(initParam, selectFilterValues)"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <!-- 菜单操作 -->
      </ProTable>
      <RoleDrawer ref="roleDrawer" />
      <PayDrawer ref="payDrawer" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { getMembershipOrderList } from "@/api/modules/order";
import { reactive, ref } from "vue";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getMembershipOrderList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
const payDrawer = ref();
const selectFilterValues = ref({ order_status: "" });
const initParam = reactive({});
const selectFilterData = reactive([
  {
    title: "订单状态",
    key: "order_status",
    options: [
      { label: "全部", value: "" },
      { label: "待付款", value: "pending_pay" },
      { label: "已付款", value: "pay_finished" },
      { label: "已完成", value: "completed" },
      { label: "已关闭", value: "cancelled" }
    ]
  }
]);
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  proTable.value!.pageable.pageNum = 1;
  proTable.value!.pageable.pageSize = 10;
  selectFilterValues.value = value;
  proTable.value!.clearSelection();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "order_no", align: "left", label: "订单编号", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  { prop: "nickname", align: "left", label: "下单用户", width: 120 },
  { prop: "phone", align: "left", label: "手机号", width: 120, search: { el: "input" } },
  { prop: "num", align: "left", label: "订单数量", width: 120 },
  {
    prop: "original_amount",
    label: "总价",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "actual_pay_amount",
    label: "实际支付金额",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "order_status",
    label: "订单状态",
    enum: [
      { label: "待付款", value: "pending_pay" },
      { label: "已付款", value: "pay_finished" },
      { label: "已完成", value: "completed" },
      { label: "已关闭", value: "cancelled" }
    ]
  },
  {
    prop: "return_amount",
    label: "返佣"
  },
  {
    prop: "created_at",
    label: "订单创建时间",
    showOverflowTooltip: false,
    width: 180,
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-date-picker
              vModel_trim={searchParam.created_at}
              type="daterange"
              range-separator="到"
              start-placeholder="开始时间"
              end-placeholder="截止时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        );
      }
    }
  }
];
</script>
