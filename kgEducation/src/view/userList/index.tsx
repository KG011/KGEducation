/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import './index.scss';
import courseImage from '@/assets/course1.png';
import smileImage from '@/assets/smile.svg';
import pictureImage from '@/assets/picture.svg';
import { EllipsisOutlined } from '@ant-design/icons';

import { Popover } from "antd";
import { useSearchParams } from "react-router-dom";
import { appendMessageApi, getMessageListApi } from "@/config/apis/modules/friend";
import { formattedDate } from "@/utils/dateTime";
import { useGlobalContext } from "@/context/Global";

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

// 定义表情数据数组
const emojis = ['😀', '😎', '👍', '😄', '😍', '🤩', '😅', '🤣', '😭', '😡', '🤗', '🙄', '😴', '💤', '🍔', '🍕', '🎈', '🎉', '💐', '🌺'];

const UserList: React.FC = () => {
    const { setLastMessageTime, lastMessageTime } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const user2_name = searchParams.get('user_name');
    const user2_id = searchParams.get('user_id');
    const user1_id = Number(localStorage.getItem('id'))
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const messagesRef = React.useRef<HTMLDivElement>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    // 处理表情包点击事件，将点击的表情添加到输入框内容中
    const handleEmojiClick = (emoji: string) => {
        if (inputRef.current) {
            const currentValue = inputRef.current.value;
            inputRef.current.value = currentValue + emoji;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            const inputValue = inputRef.current?.value;
            if (inputValue && inputValue.trim() !== "") {
                const now = new Date();
                let dataQuery
                if (lastMessageTime && now.getTime() - lastMessageTime.getTime() < 5 * 60 * 1000) {
                    // 在五分钟内，不更新时间戳
                    dataQuery = {
                        user1_id,
                        user2_id: Number(user2_id),
                        user2_name,
                        message: inputValue
                    };
                } else {
                    dataQuery = {
                        user1_id,
                        user2_id: Number(user2_id),
                        dateTime: formattedDate,
                        user2_name,
                        message: inputValue
                    }
                    setLastMessageTime(new Date())
                }
                setMessages([...messages, {
                    messageInfo: { ...dataQuery }
                }]);
                appendMessageApi(dataQuery)
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        }
    };

    const initData = async () => {
        const dataQuery = {
            user1_id: Number(localStorage.getItem('id')),
            user2_name
        }
        const { data } = await getMessageListApi(dataQuery)
        setMessages(data.integratedResults);


    }
    React.useEffect(() => {
        initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user2_id]);
    React.useEffect(() => {
        if (messagesRef.current) {
            const { scrollHeight, clientHeight } = messagesRef.current;
            const maxScrollTop = scrollHeight - clientHeight;
            messagesRef.current.scrollTo({
                top: maxScrollTop,
                behavior: "smooth"
            });
        }
    }, [messages]);

    return (
        <div className="chatting-container">
            <div className="content-header"><span>{user2_name}</span><span><EllipsisOutlined /></span></div>
            <div className="content-box" ref={messagesRef}>
                {messages?.map((item, index) => {
                    const isOwnMessage = item.messageInfo.user1_id === user1_id;
                    return (
                        <div key={index} >
                            {
                                item.messageInfo.dateTime ? (<div className="message-dateTime">{item.messageInfo.dateTime}</div>) : ''
                            }
                            {
                                isOwnMessage ? (
                                    <div className='chat-message own-message'>
                                        <span>{item.messageInfo?.message}</span>
                                        <img src={courseImage} alt="Avatar" className="chat-avatar" />
                                    </div>
                                ) : (
                                    <div className='chat-message'>
                                        <img src={courseImage} alt="Avatar" className="chat-avatar" />
                                        <span>{item.messageInfo.message}</span>
                                    </div>
                                )
                            }
                        </div>
                    )
                })}
            </div>
            <div className="inputArea-box">
                <div className="inputArea-box-header">
                    <Popover
                        trigger="click"
                        open={open}
                        onOpenChange={handleOpenChange}
                        content={
                            <div className="emoji-content">
                                {emojis.map((emoji, index) => (
                                    <span
                                        key={index}
                                        className="emoji-item"
                                        onClick={() => handleEmojiClick(emoji)}
                                    >&nbsp;{emoji}</span>
                                ))}
                            </div>
                        }
                    >
                        <span><img src={smileImage} alt="" /></span>
                    </Popover>
                    <span><img src={pictureImage} alt="" /></span>
                </div>
                <div className="inputArea-box-middle">
                    <textarea
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="inputArea-box-footer">按 Enter 发送消息</div>
            </div>
        </div>
    );
};

export default UserList;