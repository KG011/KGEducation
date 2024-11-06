import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useGlobalContext } from '@/context/Global';
interface ModalComponent {
    title?: string,
    setIsNewCourse?: (bol: boolean) => void,
    setGetNewList?: () => void,
    children?: React.ReactNode;
    formData?: object
    notFooter?: boolean
    submitExam?: () => void
}
const ModalComponent: React.FC<ModalComponent> = ({ title, setIsNewCourse, submitExam, setGetNewList, notFooter, children }) => {
    const { openModel, setOpenModel } = useGlobalContext()
    const [loading, setLoading] = useState(false);
    const handleOk = () => {
        setLoading(true);
        //确定则改变新课程状态
        setIsNewCourse?.(true)
        setGetNewList?.()
        submitExam?.()
        setTimeout(() => {
            setLoading(false);
            setOpenModel(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpenModel(false);
    };
    const footer = [
        <Button key="back" onClick={handleCancel}>
            取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            确定
        </Button>
    ]
    return (
        <>
            <Modal
                open={openModel}
                title={title || "Title"}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={notFooter ? null : footer}
            >
                {children}
            </Modal>
        </>
    );
};

export default ModalComponent;