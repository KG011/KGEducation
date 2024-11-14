import React from 'react';
import '../index.scss'
import { getMyNotebookApi } from '@/config/apis/modules/course';
// import courseImage from '@/assets/course1.png';
import { useGlobalContext } from '@/context/Global';
// import courseImg from '@/assets/course1.png'
// import PhotoShow from '@/components/photoShow';
import { getUserIDFromLocalStorage } from '@/utils/storage'
import { Button, FloatButton, Image } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ModalComponent from '@/components/Modal';
import NewNotebook from '@/components/newNotebook';


interface MyNotebookProps {
    jumpRouter: (path: string) => void
}
interface NotebookData {
    user_name: string;
    notebookList: Array<{ [name: string]: string }>
}
const MyNotebook: React.FC<MyNotebookProps> = () => {
    const { userInfo, setIsPhotoShow, setRouter, setOpenModel } = useGlobalContext()
    const [notebookData, setNotebookData] = React.useState<NotebookData>()
    React.useEffect(() => {
        const myNotebookData = async () => {
            try {
                const response = await getMyNotebookApi({ userId: getUserIDFromLocalStorage() });
                if (response.data.status == 500) {
                    setRouter('/login')
                }
                //更新我的课程列表
                setNotebookData(response.data.notebookData)
                
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }

        };
        myNotebookData();
    }, [setRouter, userInfo])
    return (
        <>
            <div className="education-cantainer">
                {notebookData?.notebookList?.map((item, index) => {
                    return (
                        <div key={index} className="edu-item" >
                            <div className="edu-item-img" onClick={() => setIsPhotoShow(true)}>
                                <Image
                                    width={'100%'}
                                    height={'100%'}
                                    src={item.imgUrl}
                                />
                            </div>
                            <div className="notebook-label">
                                <span className='edu-item-label-teacher'>制作人：{notebookData.user_name}</span>
                                <Button type="link" onClick={() => setRouter(`/antvX6?notebook_type=${item.notebook_type}&notebook_id=${item.notebook_id}`)}>
                                    在线编排
                                </Button>
                            </div>
                        </div>
                    )
                })}
                <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
                    <FloatButton icon={<QuestionCircleOutlined />} />
                    <FloatButton tooltip={<div>创建新笔记</div>} onClick={() => { setOpenModel(true) }} />
                    <FloatButton.BackTop visibilityHeight={0} />
                </FloatButton.Group>
            </div>

            <ModalComponent title='创建新笔记' notFooter={true}>
                <NewNotebook></NewNotebook>
            </ModalComponent>
            {/* <PhotoShow imgSrc={courseImg}></PhotoShow> */}
        </>
    )
}
export default MyNotebook