import axios, { AxiosInstance } from 'axios';
import { responseSuccess, responseFail } from './interceptors.ts';
import { socketUrl } from './config.ts'
import { useNavigate } from 'react-router-dom';

const fetch: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间一分钟
  baseURL: socketUrl,
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Cache-Control': 'no-cache',
  //   Pragma: 'no-cache',
  // },
});

// fetch.interceptors.request.use(requestSuccess, requestFail);
fetch.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const navigate = useNavigate();
    const originalRequest = error.config;
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 && data.msg && data.msg.includes('jwt expired请重新登录')) {
        // 如果响应状态码是401且消息提示token过期，跳转到登录页
        navigate('/login');
        return Promise.reject(error);
      }
      if (status === 401 && !originalRequest._retry) {
        // 如果是401且还没重试过，这里可以尝试刷新token等操作（如果有相应接口支持），示例省略
        originalRequest._retry = true;
        return fetch(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
fetch.interceptors.response.use(responseSuccess, responseFail);

export default fetch;