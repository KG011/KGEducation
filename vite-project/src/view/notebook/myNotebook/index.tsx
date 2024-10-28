import React from 'react';
import '../index.scss'
import { getMyCourseApi } from '@/config/apis/modules/course';
import courseImage from '@/assets/course1.png';
import { useGlobalContext } from '@/context/Global';
import courseImg from '@/assets/course1.png'
import PhotoShow from '@/components/photoShow';
import { Button } from 'antd';
interface MyNotebookProps {
    jumpRouter: (path: string) => void
}
const MyNotebook: React.FC<MyNotebookProps> = (props) => {
    const { userInfo, setIsPhotoShow } = useGlobalContext()
    const { jumpRouter } = props
    const [courseList, setCourseList] = React.useState(new Array(20).fill({ label: '2' }))
    React.useEffect(() => {
        const myCourseData = async () => {
            try {
                const response = await getMyCourseApi({ userId: userInfo, role: 'student' });
                if (response.data.status == 500) {
                    jumpRouter('/login')
                }
                //更新我的课程列表
                setCourseList(response.data.courseList)
            } catch (error) {

                console.error('Error fetching menu data:', error);
            }
        };
        myCourseData();
    }, [jumpRouter, userInfo])
    return (
        <>
            <div className="education-cantainer">
                {courseList.map((item, index) => {
                    return (
                        <div key={index} className="edu-item" >
                            <div className="edu-item-img" onClick={() => setIsPhotoShow(true)}>
                                <img src={courseImage} alt={item.course_name} />
                            </div>
                            <div className="edu-item-label notebook-label">
                                {/* <span className='edu-item-label-course'>{item.course_name}</span> */}
                                <span className='edu-item-label-teacher'>制作人：{item.teacher_name}</span>
                                <Button type="link"  style={{float:'right'}}>
                                    在线编排
                                </Button>
                            </div>
                        </div>
                    )
                })}

            </div>
            <PhotoShow imgSrc={courseImg}></PhotoShow>
        </>
    )
}
export default MyNotebook