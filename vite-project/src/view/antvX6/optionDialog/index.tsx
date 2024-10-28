import { Button, Form, Input } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import './index.scss'
import React from 'react';
interface OptionDialogProps {
    handleButtonClick: () => void
    setLabelValue: (str: string) => void
    setLabelColor: (str: string) => void
    setBgColor: (str: string) => void
    setIsShowOptionDialog: (bol: boolean) => void
    labelValue: string
    labelColor: string
    bgColor: string
}
const OptionDialog: React.FC<OptionDialogProps> = (props) => {
    const [form] = Form.useForm();
    const { setLabelValue, handleButtonClick, setLabelColor, setBgColor, setIsShowOptionDialog, labelValue, labelColor, bgColor } = props
    const optionSumbit = () => {
        handleButtonClick()
    }
    return (
        <div className="x6-box-option">
            <div className="x6-box-option-title">
                <span>配置区</span>
                <Button type="primary" icon={<CloseOutlined />}  style={{ float: 'right' }} />
            </div>
            <div className="x6-box-option-content">
                <Form
                    layout={'vertical'}
                    form={form}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item label="文本值" >
                        <Input value={labelValue} onChange={(e) => setLabelValue(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="文本颜色">
                        <Input type='color' value={labelColor} onChange={(e) => setLabelColor(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="背景颜色">
                        <Input type='color' value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                    </Form.Item>
                </Form>
            </div>
            <div className="x6-box-option-footer">
                <Button style={{ marginRight: '10px' }} onClick={() => setIsShowOptionDialog(false)}>取消</Button>
                <Button type="primary" onClick={() => optionSumbit()}>确定</Button>
            </div>
        </div>
    )
}
export default OptionDialog