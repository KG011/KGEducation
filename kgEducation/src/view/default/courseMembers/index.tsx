// import TableMember from "@/components/TableMember"
import CreateDirectory from "@/components/createDirectory"
import React from "react"
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
// import { useGlobalContext } from "@/context/Global";
import './index.scss'
import TabContent from "@/components/TabContent";
import TableMember from "@/components/TableMember";
const CourseMember: React.FC = () => {
    // const { setRouter } = useGlobalContext()
    const Navigate = useNavigate();
    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => Navigate(-1)}><RollbackOutlined /> 返回课程</span>
                <span >课程管理</span>
                <span ></span>
                {/* <span className="container-head-go" onClick={() => setRouter(`home/courseMembers?course_name${courseName}`)}>课程成员管理</span> */}
            </div>
            <div className="container course-admin-container">
                <TabContent stepNum={'1'} stepLabel={'目录修改/创建'}>
                    <CreateDirectory />
                </TabContent>
                <TabContent stepNum={'2'} stepLabel={'学员管理'}>
                    <TableMember></TableMember>
                </TabContent>
            </div>
        </>

    )
}
export default CourseMember