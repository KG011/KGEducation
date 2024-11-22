import React from "react";
import './index.scss'
import logoImg from '@/assets/base/logo.svg'
import PersonalImg from '@/assets/base/personal.svg'
import { Dropdown, MenuProps, Space } from "antd";
import { DownOutlined, RightSquareOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { useGlobalContext } from "@/context/Global";

interface KGHeader {
    middleTitle?: string
    rightConfig?: () => JSX.Element
}
const KGHeader: React.FC<KGHeader> = (props) => {
    const { setRouter } = useGlobalContext()
    const items: MenuProps['items'] = [
        {
            key: '3',
            label: (
                <span onClick={() =>
                    setRouter(`/home/personal?id=${localStorage.getItem('id')}&user_name=${localStorage.getItem('user_name')}`)
                }>
                    <UserOutlined />&nbsp;个人中心
                </span>
            ),
        },
        {
            key: '1',
            label: (
                <span >
                    <RightSquareOutlined />&nbsp;退出登录
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span >
                    待扩展
                </span>
            ),
            icon: <SmileOutlined />,
            disabled: true,
        }
    ];
    return (
        <div className="kg-header">
            <span><img src={logoImg} alt="" />&nbsp;KGEducation在线教育平台</span>
            <span>{props.middleTitle || ''}</span>
            {props?.rightConfig?.() || (
                <Dropdown menu={{ items }}>
                    <span onClick={(e) => e.preventDefault()}>
                        <Space>
                            <img src={PersonalImg}></img>{localStorage.getItem('user_name')}
                            <DownOutlined />
                        </Space>
                    </span>
                </Dropdown>
            )}


        </div>
    )
}
export default KGHeader