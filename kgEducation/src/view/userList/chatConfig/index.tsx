/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import './index.scss'
import { getGroupUserListApi } from '@/config/apis'
import { Avatar } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

interface ChatConfigProps {
    group_id: string
    type:string
}

const ChatConfig = (props: ChatConfigProps) => {
    const { group_id,type } = props
    const [useList, setUserList] = React.useState<any[]>([])
    const initData = async () => {
        console.log(group_id,type);
        const { data } = await getGroupUserListApi({ group_id,type })
        console.log(data.userList);
        
        setUserList(data.userList)
        // const newUserList = Array.from({ length: 10 }, () => data.userList).flat();
        // setUserList(newUserList);

    }
    React.useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])
    return (
        <div className="chat-config-container">
            <div className="chat-config-list">
                {useList?.map((item: any,index) => {
                    return (
                        <div className="chat-list-item" key={index}>
                            <Avatar shape="square" size="large" icon={<UserOutlined />} />
                            {item?.real_name}
                        </div>
                    )
                })}
                <div className="chat-list-item">
                    <Avatar style={{ backgroundColor: '#FFFFFF',color:'#949494' }} shape="square" size="large" icon={<PlusOutlined />} />
                    添加
                </div>
            </div>
        </div>
    )
}
export default ChatConfig