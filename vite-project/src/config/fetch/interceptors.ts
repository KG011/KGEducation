import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 请求拦截器
export const requestSuccess = (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = token;
    }
    return request;
};

export const requestFail = (error: AxiosRequestConfig) => {
    return Promise.reject(error);
};

// 接收拦截器
export const responseSuccess = (response: AxiosResponse) => {
    return response;
};

export const responseFail = (error: AxiosResponse) => {
    return Promise.reject(error);
};