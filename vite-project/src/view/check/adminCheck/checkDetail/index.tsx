/* eslint-disable @typescript-eslint/no-explicit-any */
import { getExamTableApi } from "@/config/apis/modules/course";
import { Button, Space, Table, TableProps, Tag } from "antd";
import { RollbackOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"
import { useGlobalContext } from "@/context/Global";
import { useSearchParams } from "react-router-dom";
import './index.scss'
interface DataType {
    key: string;
    name: string;
    course_name: string;
    grade: string;
    tags: string[];
}
const CheckDetail = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const course_name = searchParams.get('course_name');
    const [tableData, setTableData] = useState<DataType[]>()
    //表格配置
    const columns: TableProps<DataType>['columns'] = [
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '课程名',
            dataIndex: 'course_name',
            key: 'course_name',
        },
        {
            title: '成绩',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: '状态',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = 'geekblue';
                        switch (tag) {
                            case '未提交':
                                color = 'volcano'
                                break
                            case '未修改':
                                color = 'volcano'
                                break
                            case '已修改':
                                color = 'green'
                                break
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'tags',
            render: (_, { name, tags }) => (
                <Space size="middle">
                    <Button type="primary" disabled={tags[0] == '未提交'}
                        onClick={() => setRouter(`/editExam?student_name=${name}&course_name=${course_name}`)}
                    >修改</Button>
                </Space>
            ),
        },
    ];
    // const data: DataType[] = [
    //     {
    //         key: '1',
    //         name: 'John Brown',
    //         course_name: '计算机原理',
    //         grade: '98',
    //         tags: ['已提交', '已修改'],
    //     },
    //     {
    //         key: '2',
    //         name: 'Jim Green',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['已提交', '未修改'],
    //     },
    //     {
    //         key: '3',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '4',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '5',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '6',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '7',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '8',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    //     {
    //         key: '9',
    //         name: 'Joe Black',
    //         course_name: '计算机原理',
    //         grade: '0',
    //         tags: ['未提交', '未修改'],
    //     },
    // ];
    const initData = async () => {
        const data = {
            course_name
        }
        const res = await getExamTableApi(data)
        const newTableData = res.data.tableData.map((item: any) => {
            return {
                ...item,
                tags: JSON.parse(item.tags),
                key: item.exam_table__id,
                name: item.student_name
            };
        });
        setTableData(newTableData)
    }
    useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="container">
            <div className="container-head">
                <span className="container-head-back" onClick={() => setRouter(-1)}><RollbackOutlined /> 返回</span>
                <span>{course_name}</span>
                <span >课程管理</span>
            </div>
            <Table<DataType> columns={columns} dataSource={tableData} />
        </div>
    )
}
export default CheckDetail