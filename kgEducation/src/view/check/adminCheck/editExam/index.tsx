import KGHeader from "@/components/KGHeader"
import ModalComponent from "@/components/Modal";
import { editExamApi, getBacklogExamTeaApi, getExamCheckApi } from "@/config/apis/modules/course";
import { useGlobalContext } from "@/context/Global";
import { Button, Flex, InputNumber, message, Radio, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
interface Question {
    options: { [key: string]: string };
    questionId: string;
    questionText: string;
    questionGrade: string;
    exam_id: string;
    type: 'TextArea' | 'radio' | 'checkbox';
}
interface AnswerData {
    [questionId: string]: {
        value: string
    }
}

const EditExam = () => {
    const { setOpenModel } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const exam_id = searchParams.get('exam_id');
    const student_name = searchParams.get('student_name');
    const course_name = searchParams.get('course_name');
    const [totalGrade, setTotalGrade] = useState(0)
    const [examData, setExamData] = useState([])
    const [answerData, setAnswerData] = useState<AnswerData>()
    const [modalName, setModalName] = useState('提交')
    const [isEmtry, setIsEmtry] = useState<boolean[]>([])
    const [modalType, setModalType] = useState('')

    const initData = async () => {
        const [examData, stuData] = await Promise.all([
            getBacklogExamTeaApi({ exam_id }),
            getExamCheckApi({ exam_id, student_name })
        ])
        setExamData(JSON.parse(examData.data.examList[0].exam_data))
        setAnswerData(JSON.parse(stuData.data.exam_data[0].answer_data))
    }
    // 快捷跳转
    const jumpToQuestion = (questionId: string) => {
        const questionElement = document.getElementById(questionId);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleTexaArea = (item: Question) => {
        return (
            <TextArea
                disabled
                value={answerData?.[item.questionId].value}
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        );
    };

    const handleRadio = (item: Question) => {
        return (
            <Radio.Group disabled value={answerData?.[item.questionId].value}>
                <Space direction="vertical"  >
                    <Radio value={'1'}>A. {item.options['A']}</Radio>
                    <Radio value={'2'}>B. {item.options['B']}</Radio>
                    <Radio value={'3'}>C. {item.options['C']}</Radio>
                    <Radio value={'4'}>D. {item.options['D']}</Radio>
                </Space>
            </Radio.Group>
        );
    };

    const handleCheckbox = (item: Question) => {
        return (
            <Radio.Group disabled value={answerData?.[item.questionId].value}>
                <Radio value={'1'}>√</Radio>
                <Radio value={'2'}>×</Radio>
            </Radio.Group>
        );
    };
    const questionConfig = (item: Question) => {
        switch (item.type) {
            case 'TextArea':
                return handleTexaArea(item);
            case 'checkbox':
                return handleCheckbox(item);
            case 'radio':
                return handleRadio(item);
            default:
                return null;
        }
    };

    const questionType = (type: string) => {
        switch (type) {
            case 'TextArea':
                return '问答题';
            case 'radio':
                return '选择题';
            case 'checkbox':
                return '判断题';
            default:
                return '';
        }
    };
    const submitEdit = async() => {
        const isPass = checkAllInputNumbersFilled()
        if (!isPass) return
        let TotalGrade = 0
        examData.forEach((_item, index) => {
            const inputNumberElement = document.getElementById(`inputNumber_${index}`);
            if (inputNumberElement instanceof HTMLInputElement) {
                TotalGrade += Number(inputNumberElement.value)
            }
        });
        const data={
            student_name,
            exam_id,
            newGrade:TotalGrade,
            newTags:['已提交','已修改']
        }
        await editExamApi(data)
        message.success('成绩修改成功！');
        console.log(TotalGrade);
    }
    const checkAllInputNumbersFilled = () => {
        let allFilled = true;
        const newArray = new Array(examData.length).fill(false);
        examData.forEach((_item, index) => {
            const inputNumberElement = document.getElementById(`inputNumber_${index}`);
            if (inputNumberElement instanceof HTMLInputElement) {
                if (!inputNumberElement.value) {
                    allFilled = false;
                    newArray[index] = true;
                }
            }
        });
        setIsEmtry(newArray)
        return allFilled
    };
    //头部按钮
    const RightConfig = () => {
        return (
            <div className='exam-head-btn'>
                <Button type="primary" onClick={() => {
                    setModalName('确定修改')
                    setOpenModel(true)
                    setModalType('确定批阅')
                    // submitExam()
                }}>提交</Button>
                <Button type="primary" danger onClick={() => {
                    setModalName('退出')
                    setOpenModel(true)
                    setModalType('退出')
                }}>退出</Button>
            </div>
        )
    }
    //弹窗
    const ModalName = () => {
        switch (modalName) {
            case '确定修改':
                return '确定要提交吗？提交后将不能更改'
            case '退出':
                return '确定要退出吗？退出后将不会保存'
        }
    }
    useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        const TotalSum = examData.map((item: Question) => parseInt(item.questionGrade)).reduce((pre, value) => pre + value, 0);
        setTotalGrade(TotalSum);
        setIsEmtry(new Array(examData.length).fill(false))
    }, [examData]);
    return (
        <>
            <div className="exam-index">
                <KGHeader middleTitle={student_name + '答卷批阅'} rightConfig={RightConfig}></KGHeader>
                <div className="exam-container">
                    <div className="exam-container-detail">
                        <div className="exam-container-detail-header">
                            <h3>{course_name}</h3>
                            <span>题量:{examData.length} </span>
                            <span>总分:{totalGrade}</span>
                        </div>
                        {examData.map((item: Question, index) => {
                            return (
                                <div className="exam-question" key={index}>
                                    <div className="exam-question-text" id={item.questionId}>
                                        {index + 1}、{item.questionText}
                                        <span>{'（' + questionType(item.type) + ',' + item.questionGrade + '分）'}</span>
                                    </div>
                                    <div className="exam-question-answer">
                                        {questionConfig({ ...item })}
                                        <div className="quetion-grade" >
                                            本题得分：<InputNumber id={`inputNumber_${index}`} status={isEmtry?.[index] ? "error" : ''} min={0} max={Number(item.questionGrade)} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="exam-container-menu">
                        <div className="exam-container-menu-item">
                            <Flex gap="small" wrap>
                                {examData.map((item: Question, index) => (
                                    <Button key={index} type="primary"
                                        onClick={() => jumpToQuestion(item.questionId)}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </Flex>
                        </div>
                    </div>
                </div>
            </div>
            <ModalComponent title='提示' modalType={modalType} submitEdit={submitEdit} >
                <ModalName></ModalName>
            </ModalComponent>
        </>
    )
}
export default EditExam