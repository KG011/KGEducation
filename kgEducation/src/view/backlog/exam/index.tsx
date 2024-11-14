/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import KGHeader from '@/components/KGHeader';
import './index.scss';
import { Button, Flex, message, Radio, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ModalComponent from '@/components/Modal';
import { useGlobalContext } from '@/context/Global';
import { submitExamApi } from '@/config/apis/modules/course';

interface Exam {
    examData: Array<Question>;
    title: string;
    examInfo: object
    setIsShowExam: (bol: boolean) => void
}
interface Question {
    options: { [key: string]: string };
    questionId: string;
    questionText: string;
    questionGrade: string;
    exam_id: string;
    type: 'TextArea' | 'radio' | 'checkbox';
}

const Exam: React.FC<Exam> = (props) => {
    const { examData, title, examInfo, setIsShowExam } = props;
    const { setOpenModel } = useGlobalContext()
    const [examDataObject, setExamDataObject] = useState({});
    const [totalGrade, setTotalGrade] = useState(0)
    const [modalName, setModalName] = useState('提交')

    //考试答题数据
    const handleChange = (questionId: string, type: string, value: string) => {
        setExamDataObject((prevData: any) => ({
            ...prevData,
            [questionId]: {
                ...prevData[questionId],
                type,
                value,
            },
        }));
    };

    const handleTextAreaChange = (questionId: string, e: any) => {
        handleChange(questionId, 'TextArea', e.target.value);
    };

    const handleRadioChange = (questionId: string, value: string) => {
        handleChange(questionId, 'radio', value);
    };

    const handleCheckboxChange = (questionId: string, value: string) => {
        handleChange(questionId, 'checkbox', value);
    };


    const handleTexaArea = (item: Question) => {
        return (
            <TextArea
                placeholder="请在此处作答"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={(e) => handleTextAreaChange(item.questionId, e)}
            />
        );
    };

    const handleRadio = (item: Question) => {
        return (
            <Radio.Group onChange={(e) => handleRadioChange(item.questionId, e.target.value)}>
                <Space direction="vertical">
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
            <Radio.Group onChange={(e) => handleCheckboxChange(item.questionId, e.target.value)}>
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
    // 快捷跳转
    const jumpToQuestion = (questionId: string) => {
        const questionElement = document.getElementById(questionId);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    function checkExamData(examDataObject: { [x: string]: any; }, examData: { questionId: string; }[]) {
        const idSet = new Set(examData.map((item: { questionId: string; }) => item.questionId));
        for (const id of idSet) {
            if (!(id in examDataObject) || examDataObject[id] === null || examDataObject[id] === undefined||examDataObject[id].value === '') {
                return false;
            }

        }
        return true;
    }
    //提交
    const submitExam = async () => {
        const check = checkExamData(examDataObject, examData)
        if (!check) {
            message.warning('请先完成所有试题！')
            return
        }
        const dataQuery = {
            ...examInfo,
            student_id: localStorage.getItem('id'),
            student_name: localStorage.getItem('user_name'),
            answer_data: examDataObject,
            totalGrade,
            tags: ['已提交', '未修改']
        }
        const { data } = await submitExamApi(dataQuery)
        if (data.status == 200) {
            message.success(data.msg)
        } else {
            message.error(data.msg)
        }
    };
    //头部按钮
    const RightConfig = () => {
        return (
            <div className='exam-head-btn'>
                <Button type="primary" onClick={() => {
                    setModalName('确定答卷')
                    setOpenModel(true)
                    // submitExam()
                }}>提交</Button>
                <Button type="primary" danger onClick={() => {
                    setModalName('退出')
                    setOpenModel(true)
                }}>退出</Button>
            </div>
        )
    }
    //弹窗
    const ModalName = () => {
        switch (modalName) {
            case '确定答卷':
                return '确定要提交吗？提交答卷将不能更改'
            case '退出':
                return '确定要退出吗？退出答卷将不会保存'
        }
    }
    React.useEffect(() => {
        const TotalSum = examData.map((item) => parseInt(item.questionGrade)).reduce((pre, value) => pre + value, 0);
        setTotalGrade(TotalSum);
    }, [examData]);
    return (
        <>
            <div className="exam-index">
                <KGHeader middleTitle={title} rightConfig={RightConfig}></KGHeader>
                <div className="exam-container">
                    <div className="exam-container-detail">
                        <div className="exam-container-detail-header">
                            <h3>{title}</h3>
                            <span>题量:{examData.length} </span>
                            <span>总分:{totalGrade}</span>
                        </div>
                        {examData.map((item, index) => {
                            return (
                                <div className="exam-question" key={index}>
                                    <div className="exam-question-text" id={item.questionId}>
                                        {index + 1}、{item.questionText}
                                        <span>{'（' + questionType(item.type) + ',' + item.questionGrade + '分）'}</span>
                                    </div>
                                    <div className="exam-question-answer">
                                        {questionConfig({ ...item })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="exam-container-menu">
                        <div className="exam-container-menu-item">
                            <Flex gap="small" wrap>
                                {examData.map((item, index) => (
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
            <ModalComponent title='提示' modalType={modalName} submitExam={submitExam} setIsShowExam={setIsShowExam}>
                <ModalName></ModalName>
            </ModalComponent>
        </>
    );
};

export default Exam;