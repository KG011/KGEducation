import React, { useEffect } from "react";
import './index.scss'
import { getMyExamCheckApi } from "@/config/apis/modules/course";
import { useGlobalContext } from "@/context/Global";
import courseImage from '@/assets/course1.png';

const AdminCheck: React.FC = () => {
    const [examList, setExamList] = React.useState(new Array(20).fill({ label: '2' }))
    const { setRouter } = useGlobalContext()

    const initData = async () => {
        const data = {
            teacher_name: localStorage.getItem('user_name')
        }
        const res = await getMyExamCheckApi(data)
        setExamList(res.data.examList)
        console.log(res.data.examList);
        
    }
    useEffect(() => {
        initData()
    }, [])
    return (
        <div className="education-cantainer">
            {examList.map((item, index) => {
                return (
                    <div key={index} className="edu-item" onClick={() => setRouter(`/home/check/detail?course_name=${item.course_name}&exam_id=${item.exam_id}&Date=${item.Date}`)}>
                        <div className="edu-item-img">
                            <img src={courseImage} alt={item.course_name} />
                        </div>
                        <div className="edu-item-label">
                            <span className='edu-item-label-course'>{item.course_name}</span>
                            <span className='edu-item-label-teacher'>日期：{item.Date}</span>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}
export default AdminCheck

