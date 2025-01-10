import React from 'react';
import '../index.scss'
import { getMyCourseApi } from '@/config/apis/modules/course';
import courseImage from '@/assets/course1.png';
import { useGlobalContext } from '@/context/Global';
interface MyStudyProps {
    jumpRouter: (path: string) => void
}
const MyStudy: React.FC<MyStudyProps> = (props) => {
    const { userInfo, setRouter } = useGlobalContext()
    const { jumpRouter } = props
    const [courseList, setCourseList] = React.useState(new Array(20).fill({ label: '2' }))
    React.useEffect(() => {
        const myCourseData = async () => {
            try {
                const response = await getMyCourseApi({ userId: userInfo,role:'student' });
                //更新我的课程列表
                setCourseList(response.data.courseList)
            } catch (error) {

                console.error('Error fetching menu data:', error);
            }
        };
        myCourseData();
    }, [jumpRouter, setRouter, userInfo])
    return (
        <div className="education-cantainer">
            {courseList.map((item, index) => {
                return (
                    <div key={index} className="edu-item" onClick={() => jumpRouter(`course?course_name=${item.course_name}&course_id=${item.course_id}&treeId=1-1`)}>
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
export default MyStudy