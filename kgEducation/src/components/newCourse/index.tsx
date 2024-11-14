import { addNewCourseApi } from '@/config/apis/modules/course';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography } from 'antd';
import React from 'react';
interface NewCourseProps {
    setFormData: (formData: object) => void
    setIsNewCourse: (bol: boolean) => void
    isNewCourse: boolean
    formData: object
}
const NewCourse: React.FC<NewCourseProps> = (props) => {
    const { setFormData, isNewCourse, setIsNewCourse, formData } = props
    const [form] = Form.useForm();
    React.useEffect(() => {
        if (isNewCourse) {
            setFormData(form.getFieldsValue())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNewCourse])
    React.useEffect(() => {
        addNewCourse({teacher_id:localStorage.getItem('id'),teacher_name:localStorage.getItem('user_name'),data:formData})
        setIsNewCourse(false)
    }, [formData, setIsNewCourse]);
    const addNewCourse = async (data: object) => {
        console.log(data);
        await addNewCourseApi(data)
    }
    return (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
            name="dynamic_form_complex"
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={{ '课程': [{}] }}
        >
            <Form.List name="课程">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                        {fields.map((field) => (
                            <Card
                                size="small"
                                title={`课程 ${field.name + 1}`}
                                key={field.key}
                                extra={
                                    <CloseOutlined
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    />
                                }
                            >
                                <Form.Item label="课程名" name={[field.name, '课程名']}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="学员">
                                    <Form.List name={[field.name, '成员']}>
                                        {(subFields, subOpt) => (
                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                {subFields.map((subField) => (
                                                    <Space key={subField.key}>
                                                        <Form.Item noStyle name={[subField.name, '学生名']}>
                                                            <Input placeholder="邀请学生名" />
                                                        </Form.Item>
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                subOpt.remove(subField.name);
                                                            }}
                                                        />
                                                    </Space>
                                                ))}
                                                <Button type="dashed" onClick={() => subOpt.add()} block>
                                                    + 邀请 学生
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Form.Item>
                            </Card>
                        ))}

                        <Button type="dashed" onClick={() => add()} block>
                            + 新建 课程
                        </Button>
                    </div>
                )}
            </Form.List>

            <Form.Item noStyle shouldUpdate>
                {() => (
                    <Typography>
                        <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                    </Typography>
                )}
            </Form.Item>
        </Form>
    );
}
export default NewCourse