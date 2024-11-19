/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestApi, sendRequsetApi } from "@/config/apis/modules/friend"
import { Avatar, Button, Empty, List, message, Tag } from "antd"
import { UserDeleteOutlined } from '@ant-design/icons';

import React from "react"
import './index.scss'
const RequestHandling = () => {
    const [requestList, setRequestList] = React.useState(new Array(20).fill({
        title: 'Ant Design Title 1',
    }))
    const [isRefrech, setIsRefrech] = React.useState(0)
    const handlingReq = async (type: string, item: any) => {
        const dataQuery = {
            ...item,
            tag: type,
            user2_name:localStorage.getItem('user_name')
        }
        const { data } = await sendRequsetApi(dataQuery)
        if (data.status == 200) {
            setIsRefrech(Math.random())
            message.success(type == 'agree' ? '已同意请求' : '已拒绝请求')
        }
    }

    const initData = async () => {
        const dataQuery = {
            user_id: Number(localStorage.getItem('id'))
        }
        const { data } = await getRequestApi(dataQuery)
        setRequestList(data.requestList)

    }
    React.useEffect(() => {
        initData()
    }, [isRefrech])
    return (
        <div className={requestList.length > 0 ? 'container' : 'container request-container'}>
            <Tag icon={<UserDeleteOutlined />} color="#55acee" style={{fontSize:'20px',padding:'5px',margin:'10px 0'}}>
                请求处理
            </Tag>
            {requestList.length > 0 ? <List
                itemLayout="horizontal"
                // 使用经过筛选和分页处理的数据
                dataSource={requestList}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<a href="https://ant.design">{item.user1_name}</a>}
                            description="Hello!"
                        />
                        {
                            item.tag == 'wait' ? (
                                <>
                                    <Button type="primary" onClick={() => handlingReq('agree', item)}>同意</Button>
                                    &nbsp;
                                    <Button danger onClick={() => handlingReq('delete', item)}>拒绝</Button>
                                </>) : (<Button disabled>{item.tag == 'agree' ? '已添加' : '已拒绝'}</Button>)
                        }

                    </List.Item>
                )}
            /> : <Empty />}

        </div>
    )
}
export default RequestHandling