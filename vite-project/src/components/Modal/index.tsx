import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useGlobalContext } from '@/context/Global';
interface ModalComponent {
    title?: string,
    setIsNewCourse:(bol:boolean)=>void,
    setGetNewList:()=>void,
    children?:React.ReactNode;
    formData?:object
}
const ModalComponent: React.FC<ModalComponent> = ({ title,setIsNewCourse,setGetNewList,children }) => {
    const { openModel, setOpenModel } = useGlobalContext()
    const [loading, setLoading] = useState(false);
    const handleOk = () => {
        setLoading(true);
        //确定则改变新课程状态
        setIsNewCourse(true)
        setGetNewList()
        setTimeout(() => {
            setLoading(false);
            setOpenModel(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpenModel(false);
    };

    return (
        <>
            <Modal
                open={openModel}
                title={title || "Title"}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        Submit
                    </Button>
                ]}
            >
                {children}
            </Modal>
        </>
    );
};

export default ModalComponent;