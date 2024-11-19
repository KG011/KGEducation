/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { EditOutlined, FileSearchOutlined, HomeOutlined, LineChartOutlined, ReadOutlined, SnippetsOutlined, SolutionOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import KGHeader from '@/components/KGHeader'
import './index.scss'
import { Outlet, useLocation } from 'react-router-dom';
import { useGlobalContext } from '@/context/Global';
import { getFriendListApi } from '@/config/apis';
// import RouterWrapper from '@/router';
type MenuItem = Required<MenuProps>['items'][number];



const Home: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const items: MenuItem[] = [
        {
            key: '/home/default',
            label: '首页',
            icon: <HomeOutlined />,
        },
        {
            key: '待办',
            label: '待办',
            icon: <ReadOutlined />,
            children: [
                { key: '/home/backlog', label: '学员考试', icon: <EditOutlined />, disabled: localStorage.getItem('role') === 'teacher' ? true : false },
                {
                    key: '考试操作',
                    label: '考试操作', icon: <SnippetsOutlined />,
                    children: [
                        { key: '/home/JobPosting', label: '考试发布' },
                        { key: '/home/check', label: '考试修改' },
                    ],
                    disabled: localStorage.getItem('role') === 'student'
                },
            ],
        },
        {
            key: '/home/notebook',
            label: '笔记',
            icon: <FileSearchOutlined />,
        },
        {
            key: '/home/grade',
            label: '成绩',
            icon: <LineChartOutlined />,
            // children: [
            //     { key: '/antvX6', label: '计算机原理' },
            //     { key: '数据结构与算法', label: '数据结构与算法' },
            //     { key: '计算机网络', label: '计算机网络' },
            // ],
        },
        {
            type: 'divider',
        },
        {
            key: '通讯录',
            label: '通讯录',
            icon: <SolutionOutlined />,
            children: [
                { key: '新的朋友', label: '新的朋友' ,icon:<UserAddOutlined />},
                {
                    key: '联系人',
                    label: '联系人',
                    icon: <UserOutlined />,
                    children: [
                        { key: '12', label: '张三' },
                        { key: '13', label: '李逵' },
                        { key: '14', label: '宋江' },
                        { key: '15', label: '智多星' },
                    ],
                },
            ],
        },

        {
            key: '群聊',
            label: '所在群聊',
            type: 'group',
            children: [
                { key: '16', label: '群聊1' },
                { key: '17', label: '群聊2' },
            ],
        },
    ];
    const [menuList, setMenuList] = useState(items);
    const location = useLocation()
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState('/home')
    useEffect(() => {
        const menuListData = async () => {
            try {
                const response = await getFriendListApi({ userId: Number(localStorage.getItem('id')) });
                if (response && response.data.status === 500 && response.data.msg && response.data.msg.includes("No authorization token was found")) {
                    setRouter('/login'); // 跳转到登录页
                }
                const contactsData = response.data.friendList?.map((contact: any) => ({
                    key: contact.friendName.toString() + '-' + contact.user2_id.toString() + '-friend', // 根据实际数据中的唯一标识字段
                    label: contact.friendName,
                }));
                // 更新联系人部分的数据
                setMenuList((prevItems) => {
                    return prevItems.map((item:any) => {
                        if (item?.key == '通讯录') {
                            return {
                                ...item,
                                children: item.children.map((subItem: { key: string; }) => {
                                    if (subItem.key === '联系人') {
                                        return {
                                            ...subItem,
                                            children: contactsData
                                        };
                                    }
                                    return subItem;
                                })
                            };
                        }
                        return item
                        // return item?.key === '联系人' ? { ...item, children: contactsData } : item
                    }

                    );
                });
            } catch (error) {

                console.error('Error fetching menu data:', error);
            }
        };

        menuListData();
    }, [setRouter]);
    useEffect(() => {
        switch (location.pathname) {
            default:
                setDefaultSelectedKeys(location.pathname)
                break;
        }
    }, [location])
    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key.includes('friend')) {
            const userParm = e.key.split('-')
            setRouter(`/home/userList?user_name=${userParm[0]}&user_id=${userParm[1]}`)
            return
        }
        switch (e.key) {
            default:
                setRouter(e.key)
                break;
        }
    };

    return (
        <div className="kg-home">
            <KGHeader></KGHeader>
            <div className="kg-container">
                <Menu
                    onClick={onClick}
                    style={{ width: 256 }}
                    selectedKeys={[defaultSelectedKeys]}
                    // defaultOpenKeys={[defaultOpenKeys]}
                    mode="inline"
                    items={menuList}
                />
                <div className="kg-content">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>

    );
};

export default Home;