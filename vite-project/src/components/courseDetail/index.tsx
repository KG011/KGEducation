import React from "react";
import './index.scss'
interface CourseDetailProps{
    label:string
}
const CourseDetail:React.FC<CourseDetailProps>=(props)=>{
    return (
        <div className="course-detail">
            <div className="course-detail-container">{props.label||'00'}</div>
        </div>
    )
}
export default CourseDetail