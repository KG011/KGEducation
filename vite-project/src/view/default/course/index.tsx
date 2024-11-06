import React, { useState } from "react";
import CourseDetail from '@/components/courseDetail'
import CourseMenu from '@/components/courseMenu'
import { RollbackOutlined } from '@ant-design/icons';
import './index.scss'
import {  useNavigate,  useSearchParams } from "react-router-dom";
import { useGlobalContext } from "@/context/Global";
const Course: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const Navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseName = searchParams.get('course_name');

    const [detailLabel, setDetailLabel] = useState('')
    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => Navigate(-1)}><RollbackOutlined /> 返回课程</span>
                <span>{courseName}</span>
                <span className="container-head-go" onClick={() => setRouter(`home/courseMembers?course_name=${courseName}`)}>课程管理</span>
            </div>
            <div className="container course-container">
                <CourseMenu setDetailLabel={setDetailLabel}></CourseMenu>
                <CourseDetail label={detailLabel} courseName={courseName||''}></CourseDetail>
            </div>
        </>
    )
}
export default Course