import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useGlobalContext } from '@/context/Global';
interface ModalComponent {
    title?: string,
    setIsNewCourse?: (bol: boolean) => void,
    setIsShowExam?: (bol: boolean) => void,
    setGetNewList?: () => void,
    children?: React.ReactNode;
    formData?: object
    notFooter?: boolean
    submitExam?: () => void
    submitEdit?: () => void
    goBack?: () => void
    sumbitGrade?:()=>void
    modalType?: string
}
const ModalComponent: React.FC<ModalComponent> = (
    { title, setIsNewCourse, modalType, submitEdit,sumbitGrade, submitExam,setIsShowExam, setGetNewList, notFooter, children }) => {
    const { openModel, setOpenModel, setRouter } = useGlobalContext()
    const [loading, setLoading] = useState(false);
    const handleOk = () => {
        setLoading(true);
        switch (modalType) {
            case '退出':
                setOpenModel(false);
                if(setIsShowExam){
                    setIsShowExam?.(false)
                    return
                }
                setRouter(-1)
                return
            case '确定批阅':
                submitEdit?.()
                setLoading(false);
                setOpenModel(false);
                setRouter(-1)
                return
            case '确定答卷':
                submitExam?.()
                setIsShowExam?.(false)
                break
            case '确定新课程':
                //确定则改变新课程状态
                setIsNewCourse?.(true)
                setGetNewList?.()
                break
            case '确定生成可视化图':
                sumbitGrade?.()
                setLoading(false);
                setRouter(-1)
                break
        }
        setTimeout(() => {
            setLoading(false);
            setOpenModel(false);
        }, 500);
    };
    const handleCancel = () => {
        setOpenModel(false);
    };
    const footer = [
        <Button key="back" onClick={handleCancel}>
            取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => handleOk()}>
            确定
        </Button>
    ]
    return (
        <>
            <Modal
                open={openModel}
                title={title || "Title"}
                onOk={() => handleOk()}
                onCancel={handleCancel}
                footer={notFooter ? null : footer}
            >
                {children}
            </Modal>
        </>
    );
};

export default ModalComponent;