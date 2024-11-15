import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button,  Flex, Form, FormProps, Input } from "antd";
import { useGlobalContext } from "@/context/Global";
import { Link } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const SimpleContent: React.FC = () => {
  const { setRouter } = useGlobalContext()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  const onRegister = async () => {
    const judeg = await checkLogin()
    if (judeg) setRouter('/home')
  }
  const checkLogin = () => {
    return true
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
      <Form.Item>
        <Button block type="primary" htmlType="submit" onClick={() => onRegister()}>
          注册
        </Button>
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Link  to='/login'>login now!</Link>
        </Flex>
      </Form.Item>
    </Form>
  );
};
export default SimpleContent;
