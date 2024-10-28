import React, { useEffect, useState } from 'react';
import { EditOutlined, FileSearchOutlined, HomeOutlined, LineChartOutlined, ReadOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import KGHeader from '@/components/KGHeader'
import './index.scss'
import { Outlet } from 'react-router-dom';
import { useGlobalContext } from '@/context/Global';
import { getFriendListApi } from '@/config/apis';
// import RouterWrapper from '@/router';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '首页',
        label: '首页',
        icon: <HomeOutlined />,
    },
    {
        key: '待办',
        label: '待办',
        icon: <ReadOutlined />,
        children: [
            { key: '学员考试', label: '学员考试', icon:<EditOutlined />, },
            {
                key: '考试操作',
                label: '考试操作', icon:<SnippetsOutlined />,
                children: [
                    { key: '考试发布', label: '考试发布' },
                    { key: '考试修改', label: '考试修改' },
                ],
            },
        ],
    },
    {
        key: '笔记',
        label: '笔记',
        icon: <FileSearchOutlined />,
    },
    {
        key: '成绩',
        label: '成绩',
        icon: <LineChartOutlined />,
        children: [
            { key: '计算机原理', label: '计算机原理' },
            { key: '数据结构与算法', label: '数据结构与算法' },
            { key: '计算机网络', label: '计算机网络' },
        ],
    },
    {
        type: 'divider',
    },
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

const Home: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const [menuList, setMenuList] = useState(items);

    useEffect(() => {
        const menuListData = async () => {
            try {
                const response = await getFriendListApi({ userId: 0 });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contactsData = response.data.friendList?.map((contact: any) => ({
                    key: contact.friendName.toString() + 'friend', // 根据实际数据中的唯一标识字段
                    label: contact.friendName,
                }));
                // 更新联系人部分的数据
                setMenuList((prevItems) => {
                    return prevItems.map((item) =>
                        item?.key === '联系人' ? { ...item, children: contactsData } : item
                    );
                });
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };

        menuListData();
    }, []);
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e.key);
        if (e.key.includes('friend')) {
            setRouter('/home/userList')
            return
        }
        switch (e.key) {
            case '计算机原理':
                setRouter('/antvX6')
                break;
            case '笔记':
                setRouter('/home/notebook')
                break;
            case '学员考试':
                setRouter('/home/exam')
                break;
            case '考试发布':
                setRouter('/home/JobPosting')
                break;
            default:
                setRouter('/home/default')
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
                    defaultSelectedKeys={['首页']}
                    defaultOpenKeys={['sub1']}
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