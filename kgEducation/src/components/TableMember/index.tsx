/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Flex, message, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCourseMemberApi, onInviteStuApi } from '@/config/apis/modules/course';
import ModalComponent from '../Modal';
import MemberChoose from './memberChoose';
import { useGlobalContext } from '@/context/Global';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    course_name: string;
}

const columns: TableColumnsType<DataType> = [
    { title: '学员名', dataIndex: 'real_name' },
    { title: '学号', dataIndex: 'student_id' },
    { title: '课程名', dataIndex: 'course_name' },
];

const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    course_name: `London, Park Lane no. ${i}`,
}));

const App: React.FC = () => {
    const { setOpenModel } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const course_id = searchParams.get('course_id');
    const course_name = searchParams.get('course_name');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [checkedValue, setCheckedValue] = React.useState<any>()

    // const [data, setData] = useState(dataSource);
    const [members, setMembers] = useState(dataSource);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const Navigate = useNavigate();

    const onDelete = () => {
        setLoadingDelete(true);
        const newData = members.filter(item => !selectedRowKeys.includes(item.key));
        setMembers(newData);
        setSelectedRowKeys([]);
        setTimeout(() => {
            setLoadingDelete(false);
        }, 1000);
    };
    const onInviteStu = async () => {
        const dataQuery = checkedValue.map((item: string) => {
            const parts = item.split(' - ');
            return {
                student_name: parts[0],
                student_id: parts[1],
                course_id
            };
        });
        const {data}=await onInviteStuApi(dataQuery)
        console.log(data);
        if(data.status==200){
            message.success('添加学员成功！')
        }else{
            message.error('添加学员失败！')
        }
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    const initData = async () => {
        const { data } = await getCourseMemberApi({ course_id })
        const newData = data.course_members.map((item: any) => {
            return {
                ...item,
                course_name,
                key: item.student_id
            }
        })
        setMembers(newData)

    }
    React.useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Flex gap="middle" vertical>
                <Flex align="center" gap="middle">
                    <Button type="primary" onClick={() => Navigate(-1)}>
                        返回
                    </Button>
                    <Button type="primary" onClick={onDelete} danger disabled={!hasSelected} loading={loadingDelete}>
                        删除 学员
                    </Button>
                    <Button type="primary" onClick={() => {
                        setOpenModel(true)
                    }} >
                        邀请 学员
                    </Button>
                    {hasSelected ? `选择了 ${selectedRowKeys.length} 名学员` : null}
                </Flex>
                <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={members} />
            </Flex>
            <ModalComponent title='选择邀请的学员'  modalType='邀请学员' onInviteStu={onInviteStu}>
                <MemberChoose members={members} setCheckedValue={setCheckedValue}></MemberChoose>
            </ModalComponent>
        </>
    );
};

export default App;