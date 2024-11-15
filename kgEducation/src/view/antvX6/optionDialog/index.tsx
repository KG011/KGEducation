/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import './index.scss'
import React, { useState, useEffect } from 'react';
import { Graph } from '@antv/x6';

interface OptionDialogProps {
    handleButtonClick?: () => void
    notebook_type?: any
    x6Data?: any
    x6Graph?: Graph
    setLabelValue?:(str:string)=>void
    setLabelColor?:(str:string)=>void
    setBgColor?:(str:string)=>void
}

const OptionDialog: React.FC<OptionDialogProps> = (props) => {
    const { x6Data, x6Graph, handleButtonClick, notebook_type,setLabelValue,setLabelColor,setBgColor } = props;
    // 当前编辑的节点
    const [node, setNode] = useState<any>(null);
    const [isShowOptionDialog, setIsShowOptionDialog] = useState(false);
    // 用于存储表单数据的状态，初始化为当前节点的表单数据
    const [formData, setFormData] = useState({});
    const [form] = Form.useForm();


    const optionSumbit = () => {
        form.validateFields().then((values) => {
            // 更新x6Data.nodeFormDataMap中的数据
            x6Data.nodeFormDataMap[node.id] = { ...x6Data.nodeFormDataMap[node.id], ...values };
            // 更新x6Data.nodeOperateMap中的数据
            if(x6Data?.nodeOperateMap[node.id]?.setNodeData){
                x6Data.nodeOperateMap[node.id].setNodeData({ ...x6Data.nodeFormDataMap[node.id], ...values });
            }
            node.data={...node.data,...x6Data.nodeFormDataMap[node.id], ...values}
            // 更新formData状态为最新提交的值
            setFormData(values);

            // 明确设置表单字段的值，使表单显示新数据
            form.setFieldsValue(values);


        });
        handleButtonClick?.()
    }

    const deleteNode=()=>{
        x6Graph?.removeCell(node)
    }
    useEffect(() => {
        const handleNodeDoubleClick = (args: { node: any; }) => {
            const { node } = args;
            setNode(node);
            console.log(node,123);
            
            // 当前节点数据发生变化
            if (x6Data.nodeFormDataMap[node.id] !== formData) {
                // 获取当前节点的表单数据
                const nodeData = x6Data.nodeFormDataMap[node.id];
                // 如果节点数据为undefined，设置formData为空对象，并设置表单初始值为空
                if (nodeData === undefined) {
                    setFormData(node.data);
                    form.setFieldsValue(node.data);
                } else {
                    setFormData(nodeData);
                    form.setFieldsValue(nodeData);
                }
            }

            setIsShowOptionDialog?.(true);
        };

        x6Graph?.on('node:dblclick', handleNodeDoubleClick);
        return () => {
            x6Graph?.off('node:dblclick', handleNodeDoubleClick);
        };
    }, [form, formData, x6Data.nodeFormDataMap, x6Graph]);

    return !isShowOptionDialog ? null : (
        <div className="x6-box-option">
            <div className="x6-box-option-title">
                <span>配置区</span>
                <Button type="primary" icon={<CloseOutlined />} style={{ float: 'right' }} />
            </div>
            <div className="x6-box-option-content">
                <Form
                    layout={'vertical'}
                    form={form}
                    style={{ maxWidth: 600 }}
                    initialValues={formData}
                >
                    <Form.Item label="文本值" name='name'>
                        <Input onChange={(e)=>setLabelValue?.(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="文本颜色" name='labelColor'>
                        <Input type='color'  onChange={(e)=>setLabelColor?.(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="背景颜色" name='bgColor'>
                        <Input type='color' onChange={(e)=>setBgColor?.(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="边框颜色" name='borderColor'>
                        <Input type='color' />
                    </Form.Item>
                </Form>
            </div>
            <div className="x6-box-option-footer">
                <Button style={{ marginRight: '10px' }} onClick={() => setIsShowOptionDialog(false)}>取消</Button>
                {!notebook_type ? null : <Button style={{ marginRight: '10px' }}  type="primary" danger onClick={() => deleteNode()}>删除节点</Button>}
                <Button type="primary" onClick={() => optionSumbit()}>确定</Button>
            </div>
        </div>
    )
}

export default OptionDialog;