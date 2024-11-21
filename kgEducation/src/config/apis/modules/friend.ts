import fetch from '@/config/fetch/index.ts';

//获取好友列表
export const getFriendListApi = (data: User) => {
    return fetch.post('/friend/friendList', data)
}
//获取群聊列表
export const getGroupListApi = (data: User) => {
    return fetch.post('/friend/getGroupListApi', data)
}

//获取好友聊天记录
export const getMessageListApi = (data: object) => {
    return fetch.post('/friend/getMessageListApi', data)
}

//发送信息
export const appendMessageApi = (data: object) => {
    return fetch.post('/friend/appendMessageApi', data)
}
//发送群聊信息
export const appendGroupMessageApi = (data: object) => {
    return fetch.post('/friend/appendGroupMessageApi', data)
}
//发送好友请求
export const sendRequsetApi = (data: object) => {
    return fetch.post('/friend/sendRequsetApi', data)
}

//发送好友请求
export const getRequestApi = (data: object) => {
    return fetch.post('/friend/getRequestApi', data)
}


//获取所有用户
export const getAllUserApi = () => {
    return fetch.get('/friend/getAllUserApi')
}

//获取群聊信息
export const getGroupMessageApi = (data: object) => {
    return fetch.post('/friend/getGroupMessageApi',data)
}

//获取群聊用户列表
export const getGroupUserListApi = (data: object) => {
    return fetch.post('/friend/getGroupUserListApi',data)
}






