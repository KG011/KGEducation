// 数据缓存在localStorage， 打开多个tab页，互不不影响
export const LOCAL_KEYS = [
    'user_name',
    'id',
    'role',
    'token'
];

/**
 * 清除不必要的缓存信息
 */
export const clearStorage = () => {
    localStorage.clear()
}