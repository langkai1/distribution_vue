<template>
  <div class="main-box">
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <ProTable
        ref="proTable"
        title="我的订单列表"
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
        <template #operation="scope">
          <el-button v-if="Number(scope.row.actual_pay_amount) > 0" type="primary" link @click="paySubmit(scope.row)">
            付款凭证
          </el-button>
          <el-button
            v-if="
              scope.row.receive_method === 1 &&
              (scope.row.order_status === 'pay_finished' || scope.row.order_status === 'completed')
            "
            type="primary"
            link
            @click="handleSubmit(scope.row)"
          >
            发货物流
          </el-button>
          <el-button
            v-if="scope.row.receive_method === 0 && scope.row.order_status === 'pay_finished'"
            type="primary"
            link
            @click="set_order_complete(scope.row)"
          >
            设置完成
          </el-button>
        </template>
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
import {
  getSystemOrderList,
  getOrderPayFile,
  getOrderDeliveryInfo,
  saveOrderDeliveryInfo,
  setOrderComplete
} from "@/api/modules/order";
import RoleDrawer from "./components/RoleDrawer.vue";
import PayDrawer from "./components/PayDrawer.vue";
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getSystemOrderList(newParams);
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
const handleSubmit = async (row: any) => {
  const { data }: any = await getOrderDeliveryInfo({ id: row.id });
  roleDrawer.value.acceptParams({
    title: "报备订单",
    row: {
      id: row.id,
      ...data
    },
    api: saveOrderDeliveryInfo,
    getTableList: proTable.value.getTableList
  });
};
const payDrawer = ref();
const paySubmit = async (row: any) => {
  const { data }: any = await getOrderPayFile({ id: row.id });
  payDrawer.value.acceptParams({
    title: "付款凭证",
    isView: true,
    row: {
      id: row.id,
      pay_no: data?.pay_no || "",
      pay_platform: data?.pay_platform || "",
      files: data?.files || []
    },
    getTableList: proTable.value.getTableList
  });
};
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
const set_order_complete = async (row: any) => {
  await useHandleData(setOrderComplete, { id: row.id }, "设置订单完成");
  proTable.value!.getTableList();
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "order_no", align: "left", label: "订单编号", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  { prop: "num", align: "left", label: "订单数量", width: 60 },
  { prop: "nickname", align: "left", label: "下单用户", width: 120 },
  { prop: "phone", align: "left", label: "手机号", width: 120, search: { el: "input" } },
  {
    prop: "original_amount",
    label: "总价",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "zz_discount_amount",
    label: "猪猪币抵扣",
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
    prop: "receive_method",
    label: "配送方式",
    enum: [
      { label: "到店自提", value: 0 },
      { label: "快递配送", value: 1 }
    ],
    width: 120
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
  },
  {
    prop: "operation",
    label: "操作",
    width: 280
  }
];
</script>
