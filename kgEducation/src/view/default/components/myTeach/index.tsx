import React, { useCallback, useEffect, useState } from 'react'
import '../index.scss'
import courseImage from '@/assets/course1.png';
import { getTeacherCourse } from '@/config/apis/modules/course'
import { useGlobalContext } from '@/context/Global';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import ModalComponent from '@/components/Modal';
import NewCourse from '@/components/newCourse';

interface MyTeachProps {
    jumpRouter: (path: string) => void
}
const MyTeach: React.FC<MyTeachProps> = (props) => {
    const { setOpenModel,setRouter } = useGlobalContext()
    const { jumpRouter } = props
    //课程数据
    const [courseList, setCourseList] = useState(new Array(20).fill({ label: '2' }))
    //新建课程的表数据
    const [formData, setFormData] = useState({})
    const [isNewCourse, setIsNewCourse] = useState(false)
    const [getNewList, setGetNewList] = useState(1)
    const fetchData = useCallback(async () => {
        try {
            const response = await getTeacherCourse({ userId: Number(localStorage.getItem('id')), role: 'teacher' });
            if (response && response.data.status === 500 && response.data.msg && response.data.msg.includes("jwt expired请重新登录")) {
                setRouter('/login'); // 跳转到登录页
                return
            }
            setCourseList(response.data.courseList);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 如果 getTeacherCourse 的依赖项没有变化，可以留空数组

    useEffect(() => {
        fetchData();
    }, [fetchData, getNewList]);
    return (
        <>
            <div className="education-cantainer">
                {courseList?.map((item,index) => {
                    return (
                        <div key={index} className="edu-item" onClick={() => jumpRouter(`/home/course?course_name=${item.course_name}&course_id=${item.course_id}`)}>
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
                <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
                    <FloatButton icon={<QuestionCircleOutlined />} />
                    <FloatButton tooltip={<div>创建新课程</div>} onClick={() => setOpenModel(true)} />
                    <FloatButton.BackTop visibilityHeight={0} />
                </FloatButton.Group>
            </div>
            <ModalComponent title='创建新课程' modalType='确定新课程' setIsNewCourse={setIsNewCourse} setGetNewList={() => setGetNewList(getNewList + 1)}>
                <NewCourse setFormData={setFormData} setIsNewCourse={setIsNewCourse} isNewCourse={isNewCourse} formData={formData}></NewCourse>
            </ModalComponent>
        </>

    )
}
export default MyTeach