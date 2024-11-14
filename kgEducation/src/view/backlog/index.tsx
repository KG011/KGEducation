import React from 'react';
import { Avatar, List, message } from 'antd';
import './index.scss'
import courseImage from '@/assets/course1.png'
import { checkIsHaveExamApi, getBacklogExamApi } from '@/config/apis/modules/course';
import Exam from './exam';
const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];
interface examData {
    [name: string]: string
}
const Backlog: React.FC = () => {
    const [examData, setExamData] = React.useState([])
    const [isShowExam, setIsShowExam] = React.useState(false)
    const [nowExam, setNowExam] = React.useState([])
    const [title, setTitle] = React.useState('')
    const [examInfo, setExamInfo] = React.useState({})
    const [haveExam, setHaveExam] = React.useState()
    const initData = async () => {
        const res = await getBacklogExamApi({ student_id: localStorage.getItem('id') })
        setExamData(res.data.examData.reverse())
        const examId_list: string[] = []
        res.data.examData.forEach((item: { exam_id: number; }) => {
            examId_list.push(String(item.exam_id))
        })
        const dataQuery = {
            examId_list,
            student_id: localStorage.getItem('id')
        }
        const { data } = await checkIsHaveExamApi(dataQuery)
        setHaveExam(data.examList)
    }
    const changeExam = async (item: examData) => {
        if (haveExam?.[String(item.exam_id)]) {
            message.warning('答卷已经提交，请耐心等待批阅')
            return
        }
        setIsShowExam(true)
        setNowExam(JSON.parse(item?.exam_data))
        setExamInfo({
            teacher_name: item.teacher_name,
            course_name: item.course_name,
            exam_id: item.exam_id
        })
        setTitle(item.course_name)
    }
    React.useEffect(() => {
        initData()
    }, [])
    React.useEffect(() => {
    }, [haveExam])
    return (
        <>
            <div className="container">
                <ul className='exam-list'>
                    {examData.length > 0 ? examData.map((item: examData) => {
                        return (
                            <li key={item.exam_id} onClick={() => changeExam(item)} className='exam-list-item'>
                                <div className="exam-list-item-meta">
                                    <div className="exam-list-item-meta-avater">
                                        <img src={courseImage} alt="" />
                                    </div>
                                    <div className="exam-list-item-meta-content">
                                        <div className="exam-list-item-meta-content-title">考试：{item.course_name}</div>
                                        <div className="exam-list-item-meta-content-user">发布人：{item.teacher_name}</div>
                                    </div>
                                </div>
                                <span
                                    style={{ color: haveExam?.[String(item.exam_id)] ? 'blue' : 'red', marginRight: '25px' }}
                                >
                                    {haveExam?.[String(item.exam_id)] ? '已提交' : '待提交'}
                                </span>
                            </li>
                        )
                    }) : <div>no</div>}
                </ul>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
            {isShowExam && <Exam examData={nowExam} title={title} examInfo={examInfo} setIsShowExam={setIsShowExam}/>}
        </>
    )
}

export default Backlog;