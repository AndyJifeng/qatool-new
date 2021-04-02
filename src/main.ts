
import { createApp } from 'vue'
import App from './App.vue'
// 版本Vue3.0 echarts5
import * as echarts from 'echarts'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
//import * as Icons from "@ant-design/icons-vue";


const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.use(ElementPlus);
app.use(Antd)
app.use(router)
app.mount('#app')
