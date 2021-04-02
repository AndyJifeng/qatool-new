<template>
  <el-form
    label-width="100px"
    :model="loginUser"
    class="loginForm sign-in-form"
    :rules="rules"
    ref="ruleForm"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input placeholder="输入邮箱" v-model="loginUser1.email"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        placeholder="Enter Email..."
        v-model="loginUser1.password"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="submit-btn" @click="submitForm()"
        >提交</el-button
      >
    </el-form-item>
    <!--
    <div class="tiparea">
      <p>忘记密码 <a href="">立即找回</a></p>
    </div>
     -->
  </el-form>
</template>
<script lang="ts">
import { computed, ref } from "vue";
export default {

  props: {
    loginUser: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const ruleForm = ref();
    const submitForm = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    let loginUser1 = computed(() => {
        return props.loginUser
    })
    return {
      submitForm,
      ruleForm,
      loginUser1
    };
  },
};
</script>

<style scoped>
/* from表单 */
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0 6px 10px #cccc;
}
.submit-btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>