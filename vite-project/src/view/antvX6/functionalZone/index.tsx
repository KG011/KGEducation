import React, { useState } from "react";
import './index.scss'
import { Button, message } from "antd";
import { LeftCircleOutlined, LoginOutlined, LogoutOutlined, MenuUnfoldOutlined, PicLeftOutlined, } from '@ant-design/icons';
interface FunctionalZoneProps {
    historyState: historyState
    operate: (str: string) => void
}
interface historyState {
    canUndo: boolean
    canRedo: boolean
}
const FunctionalZone: React.FC<FunctionalZoneProps> = (props) => {
    const { historyState, operate } = props
    const [loadings, setLoadings] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const btnList = [
        {
            key: '退出',
            icon: <LeftCircleOutlined />,
            onClick: () => operate('canUndo'),
            disabled: false,
            loading:false
            // danger:true
        },
        {
            key: '撤销',
            icon: <LogoutOutlined />,
            onClick: () => operate('canUndo'),
            disabled: !historyState.canUndo,
            loading:false
            // danger:true
        },
        {
            key: '恢复',
            icon: <LoginOutlined />,
            onClick: () => operate('canRedo'),
            disabled: !historyState.canRedo,
            loading:false
            // danger:true
        },
        {
            key: '保存',
            icon: <MenuUnfoldOutlined />,
            onClick: () => saveX6Data(),
            disabled: false,
            loading:loadings
            // danger:true
        },
        {
            key: '导出为PDF',
            icon: <PicLeftOutlined />,
            onClick: () => operate('exportPDF'),
            disabled: false,
            loading:false
            // danger:true
        },
    ]
    const saveX6Data = () => {
        setLoadings(true)
        const JsonData = operate('saveToJSON')
        console.log(JsonData);
        setTimeout(() => {
            setLoadings(false)
            messageApi.open({
                type: 'success',
                content: '保存成功',
            });
        }, 2000);
    }
    return (
        <>
            {contextHolder}
            <div className="x6-box-header">
                {btnList.map((btnItem) => {
                    return (
                        <div className="x6-box-header-btn" key={btnItem.key}>
                            <Button
                                type="primary"
                                icon={btnItem.icon}
                                iconPosition={'start'}
                                disabled={btnItem.disabled}
                                onClick={btnItem.onClick}
                                loading={btnItem.loading}
                            >
                                {btnItem.key}
                            </Button>
                        </div>
                    )
                })}
            </div>
        </>

    )
}
export default FunctionalZone