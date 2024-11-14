import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import './index.scss'
import { addExamApi, getTeacherCourse } from '@/config/apis/modules/course';


const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const JobPosting = () => {
    const [form] = Form.useForm();
    const [questionsTheme, setQuestionsTheme] = useState('');
    //课程数据
    const defaultQuestion = { questionId: Math.random().toString(36).substring(2) + Date.now(), questionText: '', questionGrade: '', type: 'text', options: { 'A': '', 'B': "", 'C': '', 'D': '' } }
    const [courseList, setCourseList] = useState(new Array(20).fill({ label: '2' }))
    const [questions, setQuestions] = useState([defaultQuestion]);
    const addQuestion = () => {
        setQuestions([...questions, defaultQuestion]);

    };
    //删除
    const removeQuestion = async (indexToRemove: number) => {
        const newQuestions = questions.filter((_, index) => index !== indexToRemove);
        setQuestions(newQuestions);

    };
    //题型切换
    const handleQuestionTypeChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index].type = value;
        setQuestions(newQuestions);
    };
    //课程名切换
    const mainTypeChange = (value: string) => {
        setQuestionsTheme(value)
    }
    //问题内容更改
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const newQuestion = questions
        newQuestion[index].questionText = e.target.value
        setQuestions(newQuestion)
    }
    //问题分数更改
    const onChangeGrade = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newQuestion = questions
        newQuestion[index].questionGrade = e.target.value
        setQuestions(newQuestion)
    }
    //选择题选项
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, index: number, area: string) => {
        const newQuestion = questions
        switch (area) {
            case 'A':
                newQuestion[index].options.A = e.target.value
                break
            case 'B':
                newQuestion[index].options.B = e.target.value
                break
            case 'C':
                newQuestion[index].options.C = e.target.value
                break
            case 'D':
                newQuestion[index].options.D = e.target.value
                break
        }
        setQuestions(newQuestion)
    }
    //发布问卷
    const publish = () => {
        form.validateFields().then(async () => {
            if (questionsTheme == '') return
            const hasEmptyFields = questions.some((question) => {
                if (question.questionText === '') {
                    return true;
                }
                if (question.type === 'radio') {
                    return Object.values(question.options).some((optionValue) => optionValue === '');
                }
                return false;
            });
            if (hasEmptyFields) {
                return
            } else {
                const reqData = {
                    course_name: questionsTheme,
                    exam_data: questions,
                    teacher_name: localStorage.getItem('user_name'),
                    grade: '0',
                    tags: ['未提交', '未修改'],
                    Date:new Date().toISOString().slice(0,10)
                }
                await addExamApi(reqData)
                // 清空表单数据
                form.resetFields();
                setQuestions([defaultQuestion]);
                setQuestionsTheme('');
                message.success('成功提交考试');
                return
            }
        });
    }
    //老师对应教的课程
    const fetchData = useCallback(async () => {
        try {
            const response = await getTeacherCourse({ userId: Number(localStorage.getItem('id')), role: 'teacher' });
            setCourseList(response.data.courseList);
            console.log(response);

        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    }, []); // 如果 getTeacherCourse 的依赖项没有变化，可以留空数组

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="container JobPosting-container">
            <div className="Job-content">
                <Form form={form} style={{ maxWidth: 580 }}>
                    {questions.map((question, index) => (
                        <Space key={index} align="baseline">
                            <Form.Item
                                {...(index === 0 ? formItemLayoutWithOutLabel : formItemLayoutWithOutLabel)}
                                label={`Question ${index + 1}`}
                            >
                                <Form.Item
                                    name={`question${index}`}
                                    rules={[{ required: true, message: '请输入题目内容' }]}
                                >
                                    <Input.TextArea placeholder="题目内容" onChange={(e) => onChange(e, index)} />
                                </Form.Item>
                                <Form.Item
                                    name={`questionType${index}`}
                                    rules={[{ required: true, message: '请选择答题类型' }]}
                                >
                                    <Select
                                        onChange={(value) => handleQuestionTypeChange(index, value)}
                                        value={question.type}
                                    >
                                        <Select.Option value="TextArea">问答题</Select.Option>
                                        <Select.Option value="radio">选择题</Select.Option>
                                        <Select.Option value="checkbox">判断题</Select.Option>
                                    </Select>

                                </Form.Item>
                                {question.type === 'radio' && (
                                    <Form.Item label="选项" style={{ marginTop: 10 }}>
                                        <Form.Item name={`选项A${index}`} rules={[{ required: true, message: '请输入选项' }]}>
                                            <Input placeholder="选项 A" onChange={(e) => onChangeInput(e, index, 'A')} />
                                        </Form.Item>
                                        <Form.Item name={`选项B${index}`} rules={[{ required: true, message: '请输入选项' }]}>
                                            <Input placeholder="选项 B" onChange={(e) => onChangeInput(e, index, 'B')} />
                                        </Form.Item>
                                        <Form.Item name={`选项C${index}`} rules={[{ required: true, message: '请输入选项' }]}>
                                            <Input placeholder="选项 C" onChange={(e) => onChangeInput(e, index, 'C')} />
                                        </Form.Item>
                                        <Form.Item name={`选项D${index}`} rules={[{ required: true, message: '请输入选项' }]}>
                                            <Input placeholder="选项 D" onChange={(e) => onChangeInput(e, index, 'D')} />
                                        </Form.Item>
                                    </Form.Item>
                                )}
                                <Form.Item
                                    name={`questionGrade${index}`}
                                    rules={[{ required: true, message: '请输入题目分数' }]}
                                >
                                    <Input placeholder="题目分数" onChange={(e) => onChangeGrade(e, index)} />
                                </Form.Item>
                            </Form.Item>
                            {index > 0 && (
                                <Button type="text" danger onClick={() => removeQuestion(index)}>
                                    Remove
                                </Button>
                            )}
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={addQuestion}>
                            Add Question
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={() => publish()}>
                            Publish Form
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="Job-label">
                <Form form={form}>
                    <Form.Item
                        label={`发布到(课程名)`}
                    >
                        <Form.Item
                            name={`mainType`}
                            rules={[{ required: true, message: '请选择发布到的课程' }]}
                        >
                            <Select
                                onChange={(value) => mainTypeChange(value)}
                            >
                                {courseList.map((item, index) => <Select.Option
                                    value={item.course_name}
                                    key={index}
                                >
                                    {item.course_name}
                                </Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default JobPosting;