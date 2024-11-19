/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Avatar, Button, Input, List, message, Pagination } from "antd";
import { UserOutlined } from '@ant-design/icons';
import './index.scss';
import { getAllUserApi, getFriendListApi, sendRequsetApi } from '@/config/apis';

const NewFriend = () => {
    // 管理当前页码，初始设为1
    const [currentPage, setCurrentPage] = React.useState(1);
    // 管理每页显示的数据条数，可根据实际情况调整，这里假设每页显示10条
    const [pageSize, setPageSize] = React.useState(10);
    // 保存原始完整数据
    const [originalData, setOriginalData] = React.useState(new Array(20).fill({
        title: 'Ant Design Title 1',
    }));
    // 保存经过筛选后（可能受搜索框内容影响）的数据，初始为原始数据
    const [filteredData, setFilteredData] = React.useState(originalData);
    // 新增：保存好友关系数据
    const [friendList, setFriendList] = React.useState([]);

    // 辅助函数，根据当前页码和每页显示条数筛选数据
    const getDataByPage = (currentPage: number, pageSize: number) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    };

    const onChangeInput = (value: string) => {
        // 根据输入值对原始数据进行筛选，这里简单假设根据title属性包含输入内容进行筛选
        const newFilteredData = originalData.filter((item) =>
            item.real_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(newFilteredData);
        // 当搜索内容改变时，重置当前页码为1，显示筛选后数据的第一页
        setCurrentPage(1);
    };

    const sendRequset = async (item: any) => {
        const dataQuery = {
            user1_id: Number(localStorage.getItem('id')),
            user2_id: Number(item.id),
            user1_name: localStorage.getItem('user_name'),
            tag: 'wait'
        }
        const { data } = await sendRequsetApi(dataQuery)
        if(data.status==200){
            message.success('发送请求成功！')
        }

    }

    const initData = async () => {
        const { data } = await getAllUserApi();
        setOriginalData(data.userList);
        setFilteredData(data.userList);

        // 新增：获取好友关系数据
        try {
            const { data: friendData } = await getFriendListApi({
                userId: Number(localStorage.getItem('id'))
            });
            console.log(friendData);

            setFriendList(friendData.friendList);
        } catch (error) {
            console.error('获取好友关系数据出错：', error);
        }
    };

    React.useEffect(() => {
        initData();
    }, []);

    return (
        <div className="container newFriend-container">
            <Input size="large" placeholder="输入好友名" prefix={<UserOutlined />} onChange={e => onChangeInput(e.target.value)} />
            <div className="newFriend-content">
                <List
                    itemLayout="horizontal"
                    // 使用经过筛选和分页处理的数据
                    dataSource={getDataByPage(currentPage, pageSize)}
                    renderItem={(item, index) => {
                        if(item.id===Number(localStorage.getItem('id'))) return
                        return (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                    title={<a href="https://ant.design">{item.real_name}</a>}
                                    description="Hello!"
                                />
                                {
                                    friendList.some((friend: any) => (friend.user2_name === item.real_name))
                                        ? <Button type='primary' disabled>已添加</Button>
                                        : <Button type='primary' onClick={() => sendRequset(item)}>添加好友</Button>}
    
                            </List.Item>
                        )
                    }}
                />
            </div>
            <Pagination
                align="end"
                defaultCurrent={6}
                total={500}
                // 绑定当前页码状态，基于筛选后的数据来分页
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
                onShowSizeChange={(_current, size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                }}
            />
        </div>
    );
};

export default NewFriend;