<template>
  <div class="my-financial-container card">
    <div class="balance-section">
      <div class="balance-card available">
        <div class="balance-icon">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="balance-info">
          <div class="balance-label">可用余额</div>
          <div class="balance-amount">¥{{ formatMoney(balanceData.available_balance) }}</div>
        </div>
      </div>
      <div class="balance-card frozen">
        <div class="balance-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <div class="balance-info">
          <div class="balance-label">冻结余额</div>
          <div class="balance-amount">¥{{ formatMoney(balanceData.frozen_balance) }}</div>
        </div>
      </div>
    </div>

    <div class="summary-section">
      <div class="section-title">
        <el-icon><DataAnalysis /></el-icon>
        <span>收支汇总</span>
      </div>
      <div class="summary-grid">
        <div v-for="item in summaryList" :key="item.label" class="summary-card" @click="handleSummaryClick(item.label)">
          <div class="summary-label">{{ item.label }}</div>
          <div class="summary-values">
            <div class="summary-item income">
              <span class="item-label">收入</span>
              <span class="item-value">¥{{ formatMoney(item.income) }}</span>
            </div>
            <div class="summary-item expense">
              <span class="item-label">支出</span>
              <span class="item-value">¥{{ formatMoney(item.expense) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="section-header">
        <div class="section-title">
          <el-icon><List /></el-icon>
          <span>余额明细</span>
        </div>
        <div class="filter-controls">
          <el-select v-model="detailFilter.type" placeholder="全部类型" clearable @change="handleFilterChange">
            <el-option label="全部" value="" />
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
          <el-date-picker
            v-model="detailFilter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleFilterChange"
          />
        </div>
      </div>
      <div class="detail-list">
        <div v-if="detailList.length > 0" class="detail-items">
          <div v-for="item in detailList" :key="item.id" class="detail-item">
            <div class="item-icon" :class="item.type">
              <el-icon v-if="item.type === 'income'"><Top /></el-icon>
              <el-icon v-else><Bottom /></el-icon>
            </div>
            <div class="item-info">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-desc">{{ item.description }}</div>
              <div class="item-time">{{ formatTime(item.created_at) }}</div>
            </div>
            <div class="item-amount" :class="item.type">
              {{ item.type === "income" ? "+" : "-" }}¥{{ formatMoney(item.amount) }}
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无明细记录" />
      </div>
      <div v-if="pagination.total > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="myFinancial">
import { ref, reactive, onMounted } from "vue";
import { Wallet, Lock, DataAnalysis, List, Top, Bottom } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { getMyFinancial, getMyFinancialDetail } from "@/api/modules/user";

interface BalanceData {
  available_balance: number;
  frozen_balance: number;
}

interface SummaryItem {
  label: string;
  income: number;
  expense: number;
}

interface DetailItem {
  id: string;
  type: "income" | "expense";
  title: string;
  description: string;
  amount: number;
  created_at: string;
}

const balanceData = ref<BalanceData>({
  available_balance: 0,
  frozen_balance: 0
});

const summaryList = ref<SummaryItem[]>([
  { label: "今日", income: 0, expense: 0 },
  { label: "近三天", income: 0, expense: 0 },
  { label: "近一周", income: 0, expense: 0 },
  { label: "近半年", income: 0, expense: 0 },
  { label: "近一年", income: 0, expense: 0 }
]);

const detailList = ref<DetailItem[]>([]);

const detailFilter = reactive({
  type: "",
  dateRange: [] as string[]
});

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});
onMounted(() => {
  loadBalanceData();
  loadDetailList();
});

const loadBalanceData = async () => {
  const { data }: any = await getMyFinancial();
  balanceData.value = {
    available_balance: data.balance,
    frozen_balance: data.frozen_balance
  };
  summaryList.value = data.summary;
};

// const loadSummaryData = () => {
//   summaryList.value = [
//     { label: "今日", income: 580.0, expense: 120.0 },
//     { label: "近三天", income: 1850.0, expense: 450.0 },
//     { label: "近一周", income: 4250.0, expense: 980.0 },
//     { label: "近半年", income: 28500.0, expense: 6800.0 },
//     { label: "近一年", income: 56800.0, expense: 12500.0 }
//   ];
// };

const loadDetailList = async () => {
  let params: any = {
    pageNum: pagination.page,
    pageSize: pagination.pageSize
  };
  if (detailFilter.dateRange && detailFilter.dateRange.length === 2) {
    params.dateRange = detailFilter.dateRange;
  }
  if (detailFilter.type) {
    params.type = detailFilter.type;
  }
  const { data }: any = await getMyFinancialDetail(params);
  detailList.value = data.items;
  pagination.total = data.total;
  pagination.page = data.page;
  pagination.pageSize = data.page_size;
};

const handleFilterChange = () => {
  pagination.page = 1;
  loadDetailList();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.page = 1;
  loadDetailList();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadDetailList();
};

const formatMoney = (amount: number) => {
  return Number(amount).toFixed(2);
};

const formatTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};

const handleSummaryClick = (label: string) => {
  const today = dayjs();
  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  switch (label) {
    case "今日":
      startDate = today.startOf("day");
      endDate = today.endOf("day");
      break;
    case "近三天":
      startDate = today.subtract(2, "day").startOf("day");
      endDate = today.endOf("day");
      break;
    case "近一周":
      startDate = today.subtract(6, "day").startOf("day");
      endDate = today.endOf("day");
      break;
    case "近半年":
      startDate = today.subtract(6, "month").startOf("day");
      endDate = today.endOf("day");
      break;
    case "近一年":
      startDate = today.subtract(1, "year").startOf("day");
      endDate = today.endOf("day");
      break;
    default:
      return;
  }

  detailFilter.dateRange = [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")];
  handleFilterChange();
};
</script>

<style scoped lang="scss">
.my-financial-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1200px;
  padding: 30px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.balance-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  animation: slideInDown 0.6s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.balance-card {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 30px;
  cursor: pointer;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 12%);
    transform: translateY(-5px);
  }
  &.available {
    .balance-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  }
  &.frozen {
    .balance-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
  }
}
.balance-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  font-size: 32px;
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transition: transform 0.3s ease;
  .balance-card:hover & {
    transform: scale(1.1) rotate(5deg);
  }
}
.balance-info {
  flex: 1;
}
.balance-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
}
.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: #333333;
}
.summary-section {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.section-title {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  .el-icon {
    font-size: 22px;
    color: #667eea;
  }
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}
.summary-card {
  padding: 20px 15px;
  cursor: pointer;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
    transform: translateY(-3px);
  }
}
.summary-label {
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  text-align: center;
}
.summary-values {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }
  &.income {
    .item-value {
      color: #67c23a;
    }
  }
  &.expense {
    .item-value {
      color: #f56c6c;
    }
  }
}
.item-label {
  font-size: 12px;
  color: #999999;
}
.item-value {
  font-size: 14px;
  font-weight: 600;
}
.detail-section {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  animation: slideInUp 0.8s ease-out;
}
.section-header {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.detail-list {
  min-height: 200px;
}
.detail-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    background: #e9ecef;
    box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
    transform: translateX(5px);
  }
}
.item-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 24px;
  color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  .detail-item:hover & {
    transform: scale(1.1);
  }
  &.income {
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  }
  &.expense {
    background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  }
}
.item-info {
  flex: 1;
  min-width: 0;
}
.item-title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
.item-desc {
  margin-bottom: 4px;
  overflow: hidden;
  font-size: 13px;
  color: #666666;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-time {
  font-size: 12px;
  color: #999999;
}
.item-amount {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s ease;
  .detail-item:hover & {
    transform: scale(1.05);
  }
  &.income {
    color: #67c23a;
  }
  &.expense {
    color: #f56c6c;
  }
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media screen and (width <= 1200px) {
  .my-financial-container {
    padding: 20px;
    margin: 10px;
  }
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (width <= 768px) {
  .balance-section {
    grid-template-columns: 1fr;
  }
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-controls {
    flex-direction: column;
    width: 100%;
    .el-select,
    .el-date-picker {
      width: 100%;
    }
  }
  .balance-amount {
    font-size: 24px;
  }
  .balance-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
}

@media screen and (width <= 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .detail-item {
    padding: 12px 15px;
  }
  .item-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  .item-amount {
    font-size: 16px;
  }
}
</style>
