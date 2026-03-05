<template>
  <div class="level-desc-container">
    <el-card class="channel-partner-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Trophy /></el-icon>
          <span class="header-title">渠道合伙人</span>
        </div>
      </template>
      <div class="partner-content">
        <div class="partner-info">
          <div class="info-item">
            <span class="info-label">预付备货金</span>
            <el-tag type="primary" size="large">50,000 元</el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">保证金</span>
            <el-tag type="success" size="large">20,000 元</el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">区域保护期限</span>
            <el-tag type="warning" size="large">半年</el-tag>
          </div>
        </div>
        <div class="partner-notice">
          <el-alert type="info" :closable="false">
            <template #title>
              <div class="notice-content">
                <el-icon><InfoFilled /></el-icon>
                <span>出货量达 1,000 台后可退还保证金</span>
              </div>
            </template>
          </el-alert>
        </div>
        <div class="partner-privilege">
          <el-alert type="warning" :closable="false">
            <template #title>
              <div class="privilege-content">
                <el-icon><StarFilled /></el-icon>
                <span>开通渠道合伙人后，直接享有星级合伙人最高一级（五星★★★★★）的权益，即 1,300 元/台的进货价格</span>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
    </el-card>

    <el-card class="star-partner-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Star /></el-icon>
          <span class="header-title">星级合伙人</span>
        </div>
      </template>
      <div class="star-partner-intro">
        <el-alert type="success" :closable="false">
          <template #title>
            <div class="intro-content">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>采用阶梯定价模式，出货量达 1,000 台后自动升为进阶合伙人</span>
            </div>
          </template>
        </el-alert>
      </div>
    </el-card>

    <el-card class="consumer-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><User /></el-icon>
          <span class="header-title">普通消费者</span>
        </div>
      </template>
      <div class="consumer-info">
        <div class="consumer-item">
          <div class="consumer-title">购买第一台</div>
          <div class="consumer-price">2,680 元</div>
          <div class="consumer-desc">购买第一台后可获得机器 SN 码和激活码，用于账号开通</div>
        </div>
      </div>
    </el-card>

    <el-card class="star-level-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Medal /></el-icon>
          <span class="header-title">星级等级说明</span>
        </div>
      </template>
      <div class="star-level-grid">
        <div class="star-level-item" v-for="(level, index) in starLevels" :key="index">
          <div class="level-header">
            <div class="level-stars">
              <el-rate v-model="level.stars" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
            </div>
            <div class="level-alias" v-if="level.alias">{{ level.alias }}</div>
          </div>
          <div class="level-body">
            <div class="level-quantity">
              <span class="quantity-label">出货量</span>
              <span class="quantity-range">{{ level.quantity }}</span>
            </div>
            <div class="level-price">
              <span class="price-label">价格</span>
              <span class="price-value">{{ level.price }} 元</span>
            </div>
            <div class="level-commission" v-if="level.commission">
              <span class="commission-label">佣金</span>
              <span class="commission-value">{{ level.commission }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="levelDesc">
import { Trophy, Star, User, Medal, InfoFilled, CircleCheckFilled, StarFilled } from "@element-plus/icons-vue";

const starLevels = [
  {
    stars: 1,
    quantity: "2 - 7 台",
    price: "1,880"
  },
  {
    stars: 2,
    quantity: "8 - 36 台",
    price: "1,680"
  },
  {
    stars: 3,
    quantity: "37 - 300 台",
    price: "1,480"
  },
  {
    stars: 4,
    quantity: "301 - 1,000 台",
    price: "1,350"
  },
  {
    stars: 5,
    quantity: "> 1,000 台",
    price: "1,300",
    alias: "进阶合伙人",
    commission: "65 元/台（5%）"
  }
];
</script>

<style scoped lang="scss">
.level-desc-container {
  min-height: 100vh;
  padding: 20px;
  background: #f5f7fa;
  .el-card {
    margin-bottom: 20px;
    border-radius: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .card-header {
    display: flex;
    gap: 10px;
    align-items: center;
    .header-icon {
      font-size: 20px;
      color: #409eff;
    }
    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
  .channel-partner-card {
    .partner-content {
      .partner-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s;
          &:hover {
            box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
            transform: translateY(-2px);
          }
          .info-label {
            margin-bottom: 10px;
            font-size: 14px;
            color: #606266;
          }
          .el-tag {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
      .partner-notice {
        .notice-content {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
        }
      }
      .partner-privilege {
        margin-top: 15px;
        .privilege-content {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
  .star-partner-card {
    .star-partner-intro {
      .intro-content {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 14px;
      }
    }
  }
  .consumer-card {
    .consumer-info {
      .consumer-item {
        padding: 20px;
        text-align: center;
        .consumer-title {
          margin-bottom: 15px;
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }
        .consumer-price {
          margin-bottom: 15px;
          font-size: 32px;
          font-weight: 700;
          color: #ff6b6b;
        }
        .consumer-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #909399;
        }
      }
    }
  }
  .star-level-card {
    .star-level-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      .star-level-item {
        padding: 20px;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        transition: all 0.3s;
        &:hover {
          box-shadow: 0 8px 20px rgb(102 126 234 / 40%);
          transform: translateY(-5px);
        }
        &:nth-child(1) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &:nth-child(2) {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &:nth-child(3) {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        &:nth-child(4) {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        &:nth-child(5) {
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
        }
        .level-header {
          padding-bottom: 15px;
          margin-bottom: 20px;
          text-align: center;
          border-bottom: 1px solid rgb(255 255 255 / 30%);
          .level-stars {
            margin-bottom: 10px;
            :deep(.el-rate__text) {
              font-size: 18px;
              font-weight: 600;
              color: white !important;
            }
            :deep(.el-rate__icon) {
              font-size: 24px;
            }
          }
          .level-alias {
            display: inline-block;
            padding: 4px 12px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            background: rgb(255 255 255 / 20%);
            border-radius: 12px;
          }
        }
        .level-body {
          .level-quantity,
          .level-price,
          .level-commission {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            &:last-child {
              margin-bottom: 0;
            }
            .quantity-label,
            .price-label,
            .commission-label {
              font-size: 14px;
              opacity: 0.9;
            }
            .quantity-range,
            .price-value,
            .commission-value {
              font-size: 16px;
              font-weight: 600;
            }
            .price-value {
              font-size: 20px;
            }
          }
          .level-commission {
            padding-top: 15px;
            margin-top: 15px;
            border-top: 1px solid rgb(255 255 255 / 30%);
          }
        }
      }
    }
  }
}
</style>
