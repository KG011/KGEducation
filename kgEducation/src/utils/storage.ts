//用户id区
const getUserIDFromLocalStorage = () => {
    return Number(localStorage.getItem('id'));
};

const setUserIDToLocalStorage = (userId: string) => {
    localStorage.setItem('id', userId);
};

const clearUserIDFromLocalStorage = () => {
    localStorage.removeItem('userId');
};

export { getUserIDFromLocalStorage, setUserIDToLocalStorage, clearUserIDFromLocalStorage };