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
    // useEffect(() => {
    //     const fetchCourseData = async () => {
    //       try {
    //         const response = await axios.get(`/api/course/${courseId}`);
    //         setCourseData(response.data);
    //       } catch (error) {
    //         console.error('Error fetching course data:', error);
    //       }
    //     };

    //     if (courseId) {
    //       fetchCourseData();
    //     }
    //   }, [courseId]);
    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => Navigate(-1)}><RollbackOutlined /> 返回课程</span>
                <span>{courseName}</span>
                <span className="container-head-go" onClick={() => setRouter(`home/courseMembers?course_name=${courseName}`)}>课程管理</span>
            </div>
            <div className="container course-container">
                <CourseMenu setDetailLabel={setDetailLabel}></CourseMenu>
                <CourseDetail label={detailLabel}></CourseDetail>
            </div>
        </>
    )
}
export default Course