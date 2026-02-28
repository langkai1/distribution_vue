<template>
  <div class="main-box">
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <ProTable
        ref="proTable"
        title="孩子列表"
        row-key="id"
        :indent="20"
        :init-param="Object.assign(initParam, selectFilterValues)"
        :columns="columns"
        table-layout="auto"
        :request-api="getTableList"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button v-if="selectFilterValues.status === '0'" :disabled="!scope.isSelected" type="primary" @click="handleSubmit">
            批量审核
          </el-button>
        </template>
        <!-- 菜单操作 -->
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="productName">
import lodash from "lodash";
import ProTable from "@/components/ProTable/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getActivateList, setActivateStatus } from "@/api/modules/membership";
import { h, reactive, ref } from "vue";
import { ElInput, ElMessage, ElMessageBox, ElRadio, ElRadioGroup } from "element-plus";
const proTable = ref();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(lodash.pickBy(params, lodash.identity)));
  return getActivateList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.items,
    total: data.total,
    pageNum: data.page,
    pageSize: data.page_size
  };
};
const selectFilterValues = ref({ status: "0" });
const initParam = reactive({});
const selectFilterData = reactive([
  {
    title: "审核状态",
    key: "status",
    options: [
      { label: "全部", value: "" },
      { label: "待审核", value: "0" },
      { label: "审核通过", value: "1" },
      { label: "审核不通过", value: "2" }
    ]
  }
]);
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  proTable.value!.pageable.pageNum = 1;
  proTable.value!.pageable.pageSize = 10;
  selectFilterValues.value = value;
  proTable.value!.clearSelection();
};
const handleSubmit = async () => {
  // 筛选可操作的数据ID
  let ids = proTable.value.selectedList.filter((item: any) => item.status === 0).map((item: any) => item.id);

  // 校验是否选择了可操作数据
  if (ids.length === 0) {
    ElMessage.warning("请可操作数据为空");
    return;
  }

  // 定义弹窗内的表单数据
  const auditResult = ref<string>("pass"); // 审核结果：pass-通过，reject-不通过
  const rejectReason = ref<string>(""); // 不通过原因
  let isConfirm = false; // 是否确认提交

  // 显示弹窗
  await ElMessageBox({
    title: "审核任务",
    message: () =>
      h("div", { style: "width: 400px;" }, [
        // 审核结果单选框组
        h(
          ElRadioGroup,
          {
            modelValue: auditResult.value,
            "onUpdate:modelValue": val => {
              auditResult.value = val as string;
              // 切换为通过时清空原因
              if (val === "pass") {
                rejectReason.value = "";
              }
            },
            style: "margin-bottom: 16px; display: block;"
          },
          [
            h(ElRadio, { label: "pass", value: "pass" }, "通过审核"),
            h(ElRadio, { label: "reject", value: "reject" }, "不通过审核")
          ]
        ),

        // 不通过原因文本域（条件显示）
        auditResult.value === "reject" &&
          h(ElInput, {
            modelValue: rejectReason.value,
            type: "textarea",
            autosize: { minRows: 4, maxRows: 4 },
            inputStyle: "width: 100%;",
            placeholder: "请输入不通过的原因（必填）",
            "onUpdate:modelValue": (val: string) => {
              rejectReason.value = val;
            }
          })
      ]),
    center: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    // 关闭前的校验逻辑
    beforeClose: async (action: string, instance: any, done: Function) => {
      if (action === "confirm") {
        // 确认提交时的校验
        if (auditResult.value === "reject" && !rejectReason.value.trim()) {
          ElMessage.error("请输入不通过的原因");
          return; // 阻止弹窗关闭
        }
        isConfirm = true;
      }
      done(); // 关闭弹窗
    }
  });

  // 用户确认提交且有审核结果时调用接口
  if (isConfirm) {
    try {
      // 构造接口请求参数
      const submitParams = {
        ids: ids, // 选中的任务ID列表
        auditStatus: auditResult.value, // 审核状态
        rejectReason: auditResult.value === "reject" ? rejectReason.value.trim() : "" // 不通过原因
      };

      // 调用接口提交数据
      const { msg } = await setActivateStatus(submitParams);
      ElMessage.success(msg);

      // 更新本地数据（根据实际需求调整）
      // 这里假设你需要更新选中行的审核状态和备注
      proTable.value.getTableList();
    } catch (error) {
      ElMessage.error("操作失败，请重试");
      console.error("提交失败:", error);
    }
  }
};
// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 70 },
  { prop: "user_name", align: "left", label: "用户昵称", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  { prop: "phone", align: "left", label: "手机号", search: { el: "input" }, showOverflowTooltip: false, width: 120 },
  {
    prop: "region_pca",
    label: "所在地区",
    showOverflowTooltip: false,
    width: 120
  },
  {
    prop: "sn_code",
    label: "机器码",
    search: { el: "input" },
    width: 220
  },
  {
    prop: "activate_code",
    label: "激活码",
    search: { el: "input" },
    width: 220
  },
  {
    prop: "invite_code",
    label: "邀请码",
    search: { el: "input" },
    width: 220
  },
  {
    prop: "status",
    label: "状态",
    enum: [
      { label: "待审核", value: 0 },
      { label: "审核通过", value: 1 },
      { label: "审核不通过", value: 2 }
    ],
    width: 120
  },
  {
    prop: "reject_reason",
    label: "不通过原因",
    showOverflowTooltip: false,
    width: 250
  },
  {
    prop: "created_at",
    label: "申请时间",
    showOverflowTooltip: false,
    width: 250
  }
];
</script>
