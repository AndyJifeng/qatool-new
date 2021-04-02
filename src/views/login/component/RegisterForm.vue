<template>
    <el-form label-width="100px" :model="registerUser" class="registerForm sign-up-form" :rules="registerRules" ref="registerForm">
        <el-form-item label="用户名" prop="name">
            <el-input placeholder="Enter UserName..." v-model="registerUser1.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input placeholder="Enter Email..." v-model="registerUser1.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="Enter PassWord..." v-model="registerUser1.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
            <el-input type="password" placeholder="Enter Email..." v-model="registerUser1.password2"></el-input>
        </el-form-item>
        <el-form-item label="选择身份">
            <el-select v-model="registerUser1.role" placeholder="请选择身份">
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="用户" value="user"></el-option>
                <el-option label="游客" value="visitor"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="submit-btn" @click="registerSubmitForm()">注册</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { computed, ref } from "vue";
export default {
    props: {
        registerUser: {
            type: Object,
        },
        registerRules: {
            type: Object,
        },
    },
    setup(props) {
        const registerForm = ref()
        const registerSubmitForm = () => {
            registerForm.value.validate((valid: boolean) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };
        const registerUser1 = computed(() => {
            return props.registerUser
        })
        return {
            registerForm,
            registerSubmitForm,
            registerUser1
        };
    },
};
</script>