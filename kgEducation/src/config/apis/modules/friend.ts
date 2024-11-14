import fetch from '@/config/fetch/index.ts';

export const getFriendListApi = (data: User) => {
    return fetch.post('/friend/friendList', data)
}