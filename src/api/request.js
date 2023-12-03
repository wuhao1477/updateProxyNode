import axios from 'axios';

// 默认配置
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.withCredentials = true;
// 默认为get请求
axios.defaults.method = 'get';


// 创建axios实例
const request = axios.create({
    baseURL: axios.defaults.baseURL,
    timeout: axios.defaults.timeout,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: axios.defaults.withCredentials,
    method: axios.defaults.method
});

request.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


request.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.resolve(error.response);
    }
);

export default request;
