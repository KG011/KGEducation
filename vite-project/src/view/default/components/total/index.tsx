import courseImage from '@/assets/course1.png';
import '../index.scss'
import React from 'react';
import { getTotalCourseApi } from '@/config/apis/modules/course';
interface MyTeachProps {
    jumpRouter: (path: string) => void
}
const Total: React.FC<MyTeachProps> = (props) => {
    const { jumpRouter } = props
    const [courseList, setCourseList] = React.useState(new Array(20).fill({ label: '2' }))
    React.useEffect(() => {
        const totalCourseData = async () => {
            try {
                const response = await getTotalCourseApi();
                //更新我的课程列表
                setCourseList(response.data.courseList)
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };
        totalCourseData();
    }, [])
    return (
        <div className="education-cantainer">
            {courseList.map((item, index) => {
                return (
                    <div key={index} className="edu-item" onClick={() => jumpRouter(`home/coursePortal/${item.course_name}`)}>
                        <div className="edu-item-img">
                            <img src={courseImage} alt={item.course_name} />
                        </div>
                        <div className="edu-item-label">
                            <span className='edu-item-label-course'>{item.course_name}</span>
                            <span className='edu-item-label-teacher'>指导老师：{item.teacher_name}</span>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}
export default Total