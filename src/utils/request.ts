import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElLoading } from 'element-plus';
import { url } from '../../dist/config'

let loading: any;

const startLoading = () => {

    interface Options {
        lock: boolean;
        text: string;
        background: string;
    };

    const options: Options = {
        lock: true,
        text: "加载中...",
        background: 'rgba(255,255,255,0.5)'
    }
    loading = ElLoading.service(options);
}
// 取消Loading
const endLoading = () => {
    loading.close();
}

// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // 加载
    startLoading();
    return config;
})


// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<any>) => {
    // 结束loading
    endLoading();
    return response;
}, error => {
    // 结束loading
    endLoading();
    // 错误提醒
    return Promise.reject(error);
})

axios.defaults.baseURL = url

export default axios;