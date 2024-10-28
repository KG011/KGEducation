import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RollbackOutlined } from '@ant-design/icons';
import courseImage from '@/assets/course1.png';
import './index.scss'
import Description from "./description";
import RateFC from "@/components/Rate";
const CoursePortal: React.FC = () => {
    const { courseName } = useParams();
    const Navigate = useNavigate();

    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => Navigate(-1)}><RollbackOutlined /> 返回课程</span>
                <span>课程门户</span>
                <span></span>
            </div>
            <div className="container portal-container">
                <div className="course-portal-title">
                    <div className="course-portal-title-img">
                        <img src={courseImage} alt="" />
                    </div>
                    <div className="course-portal-title-description">
                        <div className="course-portal-title-description-top">
                            <span className="course-portal-title-description-top-coursename"> {courseName}</span>
                            <span className="course-portal-title-description-top-teacher">主讲老师：黄老师</span>
                        </div>
                        <div className="course-portal-title-description-bottom">
                            <Description></Description>
                            <div className="course-portal-title-description-bottom-rate">
                                课程评分：<RateFC></RateFC>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="enter-course">
                    <button>进入课程</button>
                </div>
            </div>
        </>
    )
}
export default CoursePortal