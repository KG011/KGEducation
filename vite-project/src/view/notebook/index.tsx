import React from "react";
import { Tabs } from 'antd';
import './index.scss'
import { useGlobalContext } from "@/context/Global";
import MyNotebook from "./myNotebook";
import NoteSharing from "./noteSharing";
const Notebook: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const itemSetRouter = (path: string) => {
        setRouter(path)
    }
    return (
        <div className="container">
            <Tabs
                defaultActiveKey={'1'}
                items={[
                    {
                        label: '我的笔记',
                        key: '1',
                        children: <MyNotebook jumpRouter={itemSetRouter}></MyNotebook>,
                    },
                    {
                        label: '笔记共享区',
                        key: '2',
                        children: <NoteSharing jumpRouter={itemSetRouter}></NoteSharing>,
                    },
                ]}
            />
        </div>
    )
}
export default Notebook

