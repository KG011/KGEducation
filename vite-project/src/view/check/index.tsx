import React from "react";
import { Tabs } from 'antd';
import './index.scss'
import AdminCheck from "./adminCheck";
const Check: React.FC = () => {
    return (
        <div className="container">
            <Tabs
                defaultActiveKey={'1'}
                items={[
                    {
                        label: '我发布的考试',
                        key: '1',
                        children: <AdminCheck></AdminCheck>,
                    }
                ]}
            />
        </div>
    )
}
export default Check

