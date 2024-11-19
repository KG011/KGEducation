import fetch from '@/config/fetch/index.ts';

//获取好友列表
export const getFriendListApi = (data: User) => {
    return fetch.post('/friend/friendList', data)
}

//获取好友聊天记录
export const getMessageListApi = (data: object) => {
    return fetch.post('/friend/getMessageListApi', data)
}

//发送信息
export const appendMessageApi = (data: object) => {
    return fetch.post('/friend/appendMessageApi', data)
}


