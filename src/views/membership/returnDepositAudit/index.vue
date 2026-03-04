<template>
  <div class="main-box">
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <ProTable
        ref="proTable"
        title="保证金退还列表"
        row-key="id"
        :indent="20"
        :init-param="Object.assign(initParam, selectFilterValues)"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <!-- 菜单操作 -->
        <template #channel_region_code="scope">
          {{ codeToText[scope.row.channel_region_code] }}
        </template>
        <template #goods_deposit_files="scope">
          <div v-for="item in scope.row.goods_deposit_files" :key="item.url">
            <el-tag @click="handleShowFile(item)">
              {{ item.name }}
            </el-tag>
            <br />
          </div>
        </template>
        <template #return_deposit_file="scope">
          <div v-for="item in scope.row.return_deposit_file" :key="item.url">
            <el-tag @click="handleShowFile(item)">
              {{ item.name }}
            </el-tag>
            <br />
          </div>
        </template>
        <template #operation="scope">
          <el-button v-if="scope.row.return_deposit_status === 1" link type="primary" @click="handleSubmit(scope.row)">
            审核
          </el-button>
        </template>
      </ProTable>
      <RoleDrawer ref="roleDrawer" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getReturnDepositList, setReturnDepositStatus } from "@/api/modules/membership";
import RoleDrawer from "./components/RoleDrawer.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { reactive, ref } from "vue";
import { codeToText } from "element-china-area-data";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getReturnDepositList(newParams);
};
const selectFilterValues = ref({ return_deposit_status: "1" });
const selectFilterData = reactive([
  {
    title: "审核状态",
    key: "return_deposit_status",
    options: [
      { label: "全部", value: "" },
      { label: "待审核", value: "1" },
      { label: "审核通过", value: "3" },
      { label: "审核不通过", value: "2" }
    ]
  }
]);
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
const initParam = reactive({});
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  proTable.value!.pageable.pageNum = 1;
  proTable.value!.pageable.pageSize = 10;
  selectFilterValues.value = value;
  proTable.value!.clearSelection();
};
const handleShowFile = (item: any) => {
  window.open("/api/" + item.url, "_blank");
};
const roleDrawer = ref();
const handleSubmit = async (row: any) => {
  roleDrawer.value.acceptParams({
    title: "保证金退还审核",
    row: {
      ...row
    },
    api: setReturnDepositStatus,
    getTableList: proTable.value.getTableList
  });
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "nickname", align: "left", label: "用户昵称", showOverflowTooltip: false, width: 120 },
  { prop: "phone", align: "left", label: "手机号", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  {
    prop: "channel_region_code",
    label: "合伙人保护地区",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "total_order_num",
    label: "累计出货量"
  },
  {
    prop: "deposit",
    label: "保证金"
  },
  {
    prop: "goods_deposit_files",
    label: "保证金附件",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "return_deposit_status",
    label: "审核状态",
    enum: [
      { label: "待审核", value: 1 },
      { label: "审核通过", value: 3 },
      { label: "审核不通过", value: 2 }
    ]
  },
  {
    prop: "return_deposit_file",
    label: "保证金退还附件",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "return_deposit_remarks",
    label: "审核退还备注",
    showOverflowTooltip: false,
    width: 180
  },
  {
    prop: "operation",
    label: "操作",
    width: 120
  }
];
</script>
