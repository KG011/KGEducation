import axios, { AxiosInstance } from 'axios';
import { requestSuccess, requestFail, responseSuccess, responseFail } from './interceptors.ts';
import { socketUrl } from './config.ts'

const fetch: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间一分钟
  baseURL: socketUrl,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

fetch.interceptors.request.use(requestSuccess, requestFail);
fetch.interceptors.response.use(responseSuccess, responseFail);

export default fetch;