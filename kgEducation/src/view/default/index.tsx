import React from "react";
import { Tabs } from 'antd';
import './index.scss'
import MyStudy from "./components/myStudy";
import MyTeach from "./components/myTeach";
import Total from "./components/total";
import { useGlobalContext } from "@/context/Global";
const Default: React.FC = () => {
    const { setRouter } = useGlobalContext()

    const itemSetRouter = (path: string) => {
        setRouter(path)
    }
    return (
        <div className="container">
            <Tabs
                defaultActiveKey={localStorage.getItem('role') == 'student' ? '1' : '2'}
                items={[
                    {
                        label: '我学的课程',
                        key: '1',
                        children: <MyStudy jumpRouter={itemSetRouter}></MyStudy>,
                        disabled: localStorage.getItem('role') !== 'student',
                    },
                    {
                        label: '我教的课程',
                        key: '2',
                        children: <MyTeach jumpRouter={itemSetRouter}></MyTeach>,
                        disabled: localStorage.getItem('role') !== 'teacher',
                    },
                    {
                        label: '全部的课程',
                        key: '3',
                        children: <Total jumpRouter={itemSetRouter}></Total>,
                    },
                ]}
            />
        </div>
    )
}
export default Default

