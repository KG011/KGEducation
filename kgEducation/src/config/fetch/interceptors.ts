import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { clearStorage } from './global';


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
    const { data } = response
    if (data.status == 401||data.status == 402&&data.msg==='jwt expired') {
        window.location.hash = `/login`;
        clearStorage();
    }
    return response;
};

export const responseFail = (error: AxiosResponse) => {
    console.log(error, 3435);

    return Promise.reject(error);
};