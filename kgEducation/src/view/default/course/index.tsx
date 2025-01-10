/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { RollbackOutlined } from '@ant-design/icons';
import './index.scss'
import { useSearchParams } from "react-router-dom";
import { useGlobalContext } from "@/context/Global";
import SplitterComponent from "@/components/Splitter";
import { Tabs, TabsProps, UploadFile } from "antd";
import MenuList from "./components/menu";
import { getMenuDetailApi } from "@/config/apis/modules/course";

const Menu: React.FC = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '目录',
            children: <MenuList />,
        },
        {
            key: '2',
            label: '讨论',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: '笔记',
            children: 'Content of Tab Pane 3',
        },
    ];
    return (
        <Tabs defaultActiveKey="1" items={items} size="large" />
    )
}

const Content: React.FC = () => {
    const [searchParams] = useSearchParams();
    const treeLabel = searchParams.get('treeLabel');
    const course_name = searchParams.get('course_name');
    const course_id = searchParams.get('course_id');
    const [fileList, setFileList] = React.useState<{ [key: string]: UploadFile[] }>({});
    // 用于记录是否滚动到页面底部，初始值设为 false
    const [isAtBottom, setIsAtBottom] = React.useState(false);
    const messagesRef = React.useRef<HTMLDivElement>(null);
    /**
         * 图片初始化
         */
    const initData = async () => {
        try {
            const { data } = await getMenuDetailApi({ course_id })
            const imagesData = JSON.parse(data.MenuDetail[0].menu_detail);
            const newFileList: { [key: string]: any[] } = {};
            imagesData.forEach((image: string) => {
                const [title, fileName] = image.split('-');
                if (!newFileList[title]) {
                    newFileList[title] = [];
                }
                newFileList[title].push({
                    uid: `${title}-${fileName}`,
                    name: fileName,
                    status: 'done',
                    done: data.MenuDetail[0].done,
                    url: `http://localhost:3000/uploads/${fileName}`
                });
            });

            setFileList(newFileList);
        } catch (error) {
            console.error('Failed to fetch images:', error);
        }
    }
    const handleScroll = () => {
        if (messagesRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesRef.current;
            // 判断是否滚动到了底部，当滚动条距离底部的距离小于等于一个较小的值（这里设为 10，可根据实际情况调整）时，认为滚动到了底部
            const isAtBottomNow = scrollHeight - scrollTop - clientHeight <= 10;
            if (isAtBottomNow!== isAtBottom) {
                setIsAtBottom(isAtBottomNow);
            }
        }
    };
    React.useEffect(() => {
        initData()
        const currentMessagesRef = messagesRef.current;
        if (currentMessagesRef) {
            currentMessagesRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentMessagesRef) {
                currentMessagesRef.removeEventListener('scroll', handleScroll);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(()=>{
        console.log(isAtBottom,777);
    },[isAtBottom])
    return (
        <div className="course-content-container" ref={messagesRef}>
            <div className="course-content-container-title">
                <h1>{treeLabel ? treeLabel : course_name}</h1>
            </div>
            <div className="course-content-container-course">
                {Object.keys(fileList).map((title, index) => (
                    <div className="course-content-container-course-item-images"  key={index + title}>
                        {fileList[title].map((file) => {
                            const [title] = file.uid.split('-');
                            if (title === treeLabel) {
                                return <img key={file.uid} src={file.url} alt={file.name} />
                            }
                        })}
                    </div>))}
            </div>
        </div>
    )
}


const Course: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const courseName = searchParams.get('course_name');
    const courseId = searchParams.get('course_id');

    const generateContent = (param: string) => {
        if (param === 'menu') {
            return <Menu />
        }
        return <Content />
    };
    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => setRouter('/home/default')}><RollbackOutlined /> 返回课程</span>
                <span>{courseName}</span>
                {localStorage.getItem('role') !== 'teacher' ? <span></span> : <span className="container-head-go" onClick={() => setRouter(`home/courseMembers?course_name=${courseName}&course_id=${courseId}`)}>课程管理</span>}
            </div>
            <div className=" course-container">
                <SplitterComponent generateContent={generateContent}></SplitterComponent>
                {/* <CourseMenu setDetailLabel={setDetailLabel}></CourseMenu>
                <CourseDetail label={detailLabel} courseName={courseName||''}></CourseDetail> */}
            </div>
        </>
    )
}
export default Course