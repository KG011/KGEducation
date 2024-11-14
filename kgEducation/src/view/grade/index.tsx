/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useGlobalContext } from "@/context/Global";
import { message } from "antd";
import courseImage from '@/assets/course1.png';
import { getGradeListapi } from "@/config/apis/modules/course";
import './index.scss'
const Default: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const [gradeList, setGradeList] = React.useState(new Array(20).fill({ label: '2' }))
    const initData = async () => {
        try {
            const { data } = await getGradeListapi();
            console.log(data);
            setGradeList(data.gradeList)
        } catch (error) {
            console.error("出现错误:", error);
            message.error(error as any)
        }
    }
    React.useEffect(() => {
        initData()
    }, [])
    return (
        <div className="container">
            <div className="education-container">
                {gradeList.map((item, index) => {
                    return (
                        <div key={index} className="edu-item" onClick={() => setRouter(`/home/gradeDetail?exam_id=${item.exam_id}`)}>
                            <div className="edu-item-img">
                                <img src={courseImage} />
                            </div>
                            <div className="edu-item-label">
                                <span className='edu-item-label-course'>{item.course_name}</span>
                                <span className='edu-item-label-teacher'>日期：{item.Date}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Default

