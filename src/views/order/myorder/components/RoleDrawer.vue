<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="下单台数" prop="num">
        <el-input-number :min="0" :controls="false" v-model="drawerProps.row!.num" placeholder="请填写下单台数" clearable />
      </el-form-item>
      <el-form-item label="单价说明" v-if="drawerProps.row!.original_amount_unit_desc">
        {{ drawerProps.row!.original_amount_unit_desc }}
      </el-form-item>
      <el-form-item label="单价" prop="original_amount_unit">
        <el-input-number
          :min="0"
          disabled
          :controls="false"
          v-model="drawerProps.row!.original_amount_unit"
          placeholder="请填写单价"
          clearable
        />
      </el-form-item>
      <el-form-item label="总金额" prop="total_amount">
        {{ drawerProps.row!.num * drawerProps.row!.original_amount_unit }}
      </el-form-item>
      <el-form-item label="可用猪猪币" prop="balance">
        {{ drawerProps.row!.balance }}
      </el-form-item>
      <el-form-item label="猪猪币抵扣" prop="zz_discount_amount">
        <el-input-number
          :min="0"
          :controls="false"
          v-model="drawerProps.row!.zz_discount_amount"
          placeholder="请输入使用猪猪币抵扣"
        />
      </el-form-item>
      <el-form-item label="收货方式" prop="receive_method">
        <el-radio-group v-model="drawerProps.row!.receive_method" @change="handleReceiveMethodChange">
          <el-radio label="0">上门自提</el-radio>
          <el-radio label="1">快递配送</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="drawerProps.row!.receive_method === '1'">
        <el-form-item label="收获地址" prop="address_id">
          <el-select v-model="drawerProps.row!.address_id" placeholder="请选择收获地址" @change="handleAddressChange">
            <el-option v-for="item in drawerProps.row!.addressList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="drawerProps.row!.receiver" placeholder="请填写收货人" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机号" clearable />
        </el-form-item>
        <el-form-item label="所在区域" prop="region_pca">
          <el-input v-model="drawerProps.row!.region_pca" placeholder="请填写所在区域" clearable />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailed_address">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            v-model="drawerProps.row!.detailed_address"
            placeholder="请填写详细地址"
            clearable
          />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
  num: [{ required: true, message: "请填写下单台数" }],
  receiver: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (drawerProps.value.row!.receive_method === "1" && !value) {
          callback(new Error("请输入收货人"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  phone: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (drawerProps.value.row!.receive_method === "1" && !value) {
          callback(new Error("请输入手机号"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  region_pca: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (drawerProps.value.row!.receive_method === "1" && !value) {
          callback(new Error("请输入所在区域"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  detailed_address: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (drawerProps.value.row!.receive_method === "1" && !value) {
          callback(new Error("请输入详细地址"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  receive_method: [{ required: true, message: "请选择收货方式" }],
  zz_discount_amount: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value || value === 0) {
          callback();
        } else if (value < 0) {
          callback(new Error("使用猪猪币抵扣不能小于0"));
        } else if (value > Number(drawerProps.value.row!.balance)) {
          callback(new Error("使用猪猪币抵扣不能超过可用余额"));
        } else if (value > drawerProps.value.row!.num * drawerProps.value.row!.original_amount_unit) {
          callback(new Error("使用猪猪币抵扣不能超过总金额"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const handleReceiveMethodChange = (val: any) => {
  if (val === "0") {
    drawerProps.value.row!.address_id = "";
    drawerProps.value.row!.receiver = "";
    drawerProps.value.row!.phone = "";
    drawerProps.value.row!.region_pca = "";
    drawerProps.value.row!.detailed_address = "";
  }
};
const handleAddressChange = (val: any) => {
  if (val) {
    let address = drawerProps.value.row!.addressList.find(item => item.value === val);
    if (address) {
      drawerProps.value.row!.region_pca = address.region_pca;
      drawerProps.value.row!.receiver = address.receiver;
      drawerProps.value.row!.phone = address.phone;
      drawerProps.value.row!.detailed_address = address.detailed_address;
    }
  }
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  if (drawerProps.value.row!.addressList.length > 0) {
    let defaultAddress = drawerProps.value.row!.addressList.find(item => item.is_default === true);
    if (defaultAddress) {
      drawerProps.value.row!.address_id = defaultAddress.value;
      drawerProps.value.row!.region_pca = defaultAddress.region_pca;
      drawerProps.value.row!.receiver = defaultAddress.receiver;
      drawerProps.value.row!.phone = defaultAddress.phone;
      drawerProps.value.row!.detailed_address = defaultAddress.detailed_address;
    }
  }
  drawerVisible.value = true;
};
// json2formdata
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let params = JSON.parse(JSON.stringify(drawerProps.value.row));
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams
});
</script>
