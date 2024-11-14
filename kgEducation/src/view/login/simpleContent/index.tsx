/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, FormProps, Input } from "antd";
import { useGlobalContext } from "@/context/Global";
import { Link } from "react-router-dom";
import { LoginApi } from "@/config/apis";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const SimpleContent: React.FC = () => {
  const { setRouter, setUserInfo} = useGlobalContext()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  const onLogin = async () => {
    try {
      if (username.trim() == '' || password.trim() == '' || role == '') return
      const res = await LoginApi({ username, password, role })
      if (res.data.status != 200) {
        alert(res.data.msg)
        return
      }
      setUserInfo(res.data.userId)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('id', res.data.userId);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_name', res.data.real_name);
    }
    catch (error) {
      console.error('登录时发生错误：', error);
    }
    setRouter('/home')
  }
  const roleChange = (role: string, e: any) => {
    if (e.target.checked) {
      setRole(role);
    } else {
      setRole('');
    }
  }
  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        name="role"
        rules={[{ required: true, message: "Please select your Role!" }]}>
        <Flex justify="space-between" align="center">
          <Form.Item name="student" noStyle>
            <Checkbox checked={role == 'student'} onChange={(e) => roleChange('student', e)}>学生</Checkbox>
          </Form.Item>
          <Form.Item name="teacher" noStyle>
            <Checkbox checked={role == 'teacher'} onChange={(e) => roleChange('teacher', e)}>教师</Checkbox>
          </Form.Item>
        </Flex>
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" onClick={() => onLogin()}>
          登录
        </Button>
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Link to='/register'>Register now!</Link>
        </Flex>
      </Form.Item>
    </Form>
  );
};
export default SimpleContent;
