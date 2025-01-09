import React from "react";
import { RollbackOutlined } from '@ant-design/icons';
import './index.scss'
import { useSearchParams } from "react-router-dom";
import { useGlobalContext } from "@/context/Global";
import SplitterComponent from "@/components/Splitter";
import { Tabs, TabsProps } from "antd";
import MenuList from "./components/menu";

const Menu: React.FC = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '目录',
            children: <MenuList/>,
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
        <Tabs defaultActiveKey="1" items={items} size="large"/>
    )
}

const Content: React.FC = () => {
    const [searchParams] = useSearchParams();
    const treeLabel = searchParams.get('treeLabel');
    const course_name = searchParams.get('course_name');
    return (
        <div className="course-content-container">
            <div className="course-content-container-title">
                <h1>{treeLabel?treeLabel:course_name}</h1>
            </div>
            <div className="course-content-container-course">
                
            </div>
        </div>
    )
}


const Course: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const courseName = searchParams.get('course_name');
    const courseId = searchParams.get('course_id');
    // const [courseLabel, setCourseLabel] = useState('')

    
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
                <span className="container-head-go" onClick={() => setRouter(`home/courseMembers?course_name=${courseName}&course_id=${courseId}`)}>课程管理</span>
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