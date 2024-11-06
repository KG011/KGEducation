import React from "react";
import './index.scss'
import { Button, Popconfirm } from "antd";
import { LeftCircleOutlined, LoginOutlined, LogoutOutlined, MenuUnfoldOutlined, PicLeftOutlined, } from '@ant-design/icons';
// import { addNotebookApi } from "@/config/apis/modules/course";
// import { getUserIDFromLocalStorage } from '@/utils/storage'
import { useGlobalContext } from "@/context/Global";
interface FunctionalZoneProps {
    historyState: historyState
    operate: (str: string) => void
    notebook_id?:string
}
interface historyState {
    canUndo: boolean
    canRedo: boolean
}
const FunctionalZone: React.FC<FunctionalZoneProps> = (props) => {
    const { setRouter } = useGlobalContext()
    const { historyState, operate,notebook_id } = props
    // const [loadings, setLoadings] = useState<boolean>(false);

    const btnList = [
        {
            key: '退出',
            icon: <LeftCircleOutlined />,
            onClick: () => setRouter(-1),
            disabled: false,
            loading: false,
        },
        {
            key: '撤销',
            icon: <LogoutOutlined />,
            onClick: () => operate('canUndo'),
            disabled: !historyState.canUndo,
            loading: false
            // danger:true
        },
        {
            key: '恢复',
            icon: <LoginOutlined />,
            onClick: () => operate('canRedo'),
            disabled: !historyState.canRedo,
            loading: false
            // danger:true
        },
        {
            key: '删除',
            icon: <LeftCircleOutlined />,
            disabled: notebook_id=='-1',
            loading: false,
            danger: true
        },
        {
            key: '保存',
            icon: <MenuUnfoldOutlined />,
            onClick: () => operate('saveToJSON'),
            disabled: false,
            // loading: loadings
            // danger:true
        },
        {
            key: '导出为PDF',
            icon: <PicLeftOutlined />,
            onClick: () => operate('exportPDF'),
            disabled: false,
            loading: false
            // danger:true
        },
    ]
    
    return (
        <>
            {/* {contextHolder} */}
            <div className="x6-box-header">
                {btnList.map((btnItem) => {
                    return (
                        <div className="x6-box-header-btn" key={btnItem.key}>
                            {btnItem.key !== '删除' ? (
                                <Button
                                    type="primary"
                                    icon={btnItem.icon}
                                    iconPosition={'start'}
                                    disabled={btnItem.disabled}
                                    onClick={btnItem.onClick}
                                    loading={btnItem.loading}
                                    danger={btnItem.danger}
                                >
                                    {btnItem.key}
                                </Button>
                            ) : (
                                <Popconfirm
                                    title="确定要删除此画布吗？"
                                    onConfirm={() => operate('delete')}
                                    okText="确定"
                                    cancelText="取消">
                                    <Button
                                        type="primary"
                                        icon={btnItem.icon}
                                        iconPosition={'start'}
                                        disabled={btnItem.disabled}
                                        onClick={btnItem.onClick}
                                        loading={btnItem.loading}
                                        danger={btnItem.danger}
                                    >
                                        {btnItem.key}
                                    </Button>
                                </Popconfirm>)}
                        </div>
                    )
                })}
            </div>
        </>

    )
}
export default FunctionalZone