/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { io } from "socket.io-client";
interface MessageInfo {
    message: string;
    dateTime?: string;
    avatar?: string;
    user1_id: number
    user2_id: number
}
interface Message {
    messageInfo: MessageInfo,
    userInfo?: any
}

const useWebSocket = (messages?: Message[], setMessages?: (mes: Message[]) => void) => {
    const [onlineUserList, setOnlineUserList] = React.useState([])
    //开启webSocket连接
    const socket = io("http://localhost:3000", {
        query: {
            username: localStorage.getItem('user_name'),
            userId: Number(localStorage.getItem('id'))
        },
        // 新增：禁用自动重连，设置 reconnect 为 false
        reconnection: false
    });
    // socket.emit('join', useStore.userId)
    //在线用户列表
    socket.on('online', (data) => {
        setOnlineUserList(data.userList)
    })

    //接收信息
    socket.on('receive', (data) => {
        const item = {
            user1_id: data.user1_id,
            user2_id: data.user2_id,
            message: data.message,
            dateTime: data.dateTime
        }
        console.log(item);
        setMessages?.([...messages!, {
            messageInfo: { ...item }
        }]);
        // state.content.unshift(item)
    })
    socket.on('error', (err) => {
        console.log(err);
    })
    return { socket, onlineUserList }
}
export default useWebSocket