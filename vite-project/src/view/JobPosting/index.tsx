import React, { useState } from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import './index.scss'
// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 4 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 20 },
//   },
// };

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const App = () => {
    const [form] = Form.useForm();
    const [questionsTheme, setQuestionsTheme] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', type: 'text', options: { 'A': '', 'B': "", 'C': '', 'D': '' } }]);
    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', type: 'text', options: { 'A': '', 'B': "", 'C': '', 'D': '' } }]);
    };

    const removeQuestion = async (indexToRemove: number) => {
        const newQuestions = questions.filter((_, index) => index !== indexToRemove);
        setQuestions(newQuestions);

    };

    const handleQuestionTypeChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index].type = value;
        setQuestions(newQuestions);
    };
    const mainTypeChange = (value: string) => {
        setQuestionsTheme(value)
    }
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const newQuestion = questions
        newQuestion[index].questionText = e.target.value
        setQuestions(newQuestion)
    }
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
        form.validateFields().then(() => {
            if(questionsTheme=='') return
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
                const reqData={[questionsTheme]:questions}
                console.log(reqData);
            }
        });
    }


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
                                    <Input.TextArea placeholder="Question text" onChange={(e) => onChange(e, index)} />
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
                                <Select.Option value="计算机网络">计算机网络</Select.Option>
                                <Select.Option value="高等数学">高等数学</Select.Option>
                                <Select.Option value="金融科技与技术">金融科技与技术</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default App;