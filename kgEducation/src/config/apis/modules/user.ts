import fetch from '@/config/fetch/index.ts';

/**
 * 登录
 */
export const LoginApi = (data: User) => {
  return fetch.post('/user/login', data)
}
/**
 * 注册
 */
export const RegisterApi = (data: User) => {
  return fetch.post('/user/register', data)
}
// export const userInfoApi = (data: User) =>{
//   return fetch.post('/user/userInfo', data)
// }
// export const searchFriendApi = (data:User) =>{
//   return fetch.post('/user/searchFriend', data)
// }

/**
 * 获取个人中心信息
 */
export const getPersonlApi = (data: object) => {
  return fetch.post('/user/getPersonlApi', data)
}


/**
 * 用户名模糊搜索用户
 * @param username
 */
export function getUsersByName(username: string) {
  return fetch.get(`/user/findByName?username=${username}`);
}

/**
 * 用户头像上传
 * @param params
 */
export function setUserAvatar(params: FormData) {
  return fetch.post(`/user/avatar`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
