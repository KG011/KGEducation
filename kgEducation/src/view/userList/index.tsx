/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import './index.scss';
import courseImage from '@/assets/course1.png';
import smileImage from '@/assets/smile.svg';
import pictureImage from '@/assets/picture.svg';
import { EllipsisOutlined } from '@ant-design/icons';
import { Drawer, Popover, theme } from "antd";
import { useSearchParams } from "react-router-dom";
import { appendGroupMessageApi, appendMessageApi, getGroupMessageApi, getMessageListApi } from "@/config/apis/modules/friend";
import { formattedDate } from "@/utils/dateTime";
import { useGlobalContext } from "@/context/Global";
import useWebSocket from "./useWebSocket";
import ChatConfig from "./chatConfig";

interface MessageInfo {
    message: string;
    dateTime?: string;
    avatar?: string;
    user1_id: number
    user2_id: number,
}
interface Message {
    messageInfo: MessageInfo,
    userInfo?: {
        avatar:any
    }
}



// 定义表情数据数组
const emojis = ['😀', '😎', '👍', '😄', '😍', '🤩', '😅', '🤣', '😭', '😡', '🤗', '🙄', '😴', '💤', '🍔', '🍕', '🎈', '🎉', '💐', '🌺'];

const UserList: React.FC = () => {
    const { setLastMessageTime, lastMessageTime } = useGlobalContext()
    const [searchParams] = useSearchParams();
    //我的id
    const user1_id = Number(localStorage.getItem('id'))
    //我的名字
    const user1_name = searchParams.get('user_name');
    //对方名字
    const user2_name = searchParams.get('user_name');
    //对方id
    const user2_id = searchParams.get('user_id');
    //聊天类型 私人1对1 聊天室
    const chatType = searchParams.get('chatType');
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const messagesRef = React.useRef<HTMLDivElement>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    //开启webSocket连接
    const { socket, onlineUserList } = useWebSocket(messages, setMessages)

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
                        message: inputValue,
                    }
                    setLastMessageTime(new Date())
                }
                setMessages([...messages, {
                    messageInfo: { ...dataQuery },
                    userInfo:{
                        avatar:localStorage.getItem('avatar')
                    }
                }]);
                if (chatType == 'private') {
                    sendMessagePrivate(inputValue, dataQuery)
                } else {
                    sendMessageGroup(inputValue, dataQuery)
                }
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        }
    };
    //私聊发送
    const sendMessagePrivate = (inputValue: string, dataQuery: object) => {
        const isLogin: any = onlineUserList.find((user: any) => {
            return user.username == user2_name
        })
        //webSocket实时发送信息
        if (isLogin != undefined) {
            socket.emit('send', {
                fromUsername: user1_name,
                targetId: isLogin.id,
                msg: inputValue,
            })
        }
        appendMessageApi(dataQuery)
    }
    //群聊发送
    const sendMessageGroup = (inputValue: string, dataQuery: object) => {
        console.log(inputValue);
        appendGroupMessageApi(dataQuery)
    }

    const initData = async () => {
        if (chatType == 'private') {
            const dataQuery = {
                user1_id: Number(localStorage.getItem('id')),
                user2_id
            }
            const { data } = await getMessageListApi(dataQuery)
            setMessages(data.integratedResults);
        } else {
            const dataQuery = {
                group_id: user2_id
            }
            const { data } = await getGroupMessageApi(dataQuery)
            setMessages(data.integratedResults);
        }
    }
    //局部抽屉
    const { token } = theme.useToken();
    const [openDrawer, setOpenDrawer] = React.useState(false);

    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        setOpenDrawer(false);
    };

    React.useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user2_id, user2_name]);
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
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <div className="chatting-container" style={containerStyle}>
            <div className="content-header">
                <span>{user2_name}</span>
                <span onClick={() => showDrawer()}><EllipsisOutlined /></span></div>
            <div className="content-box" ref={messagesRef}>
                {messages?.map((item:Message, index) => {
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
                                        <img
                                            src={item.userInfo?.avatar ? 'http://localhost:3000/uploads/' + item?.userInfo?.avatar : courseImage}
                                            alt="Avatar" className="chat-avatar" />
                                    </div>
                                ) : (
                                    <div className='chat-message'>
                                        <img
                                            src={item.userInfo?.avatar ? 'http://localhost:3000/uploads/' + item?.userInfo?.avatar : courseImage}
                                            alt="Avatar" className="chat-avatar" />
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
            <Drawer
                title={user2_name}
                placement="right"
                closable={false}
                onClose={onClose}
                open={openDrawer}
                getContainer={false}
                style={{ background: '#F5F5F5' }}
            >
                <ChatConfig type={chatType!} group_id={user2_id!}></ChatConfig>
            </Drawer>
        </div>
    );
};

export default UserList;

