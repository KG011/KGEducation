/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { RollbackOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload, Button, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import './index.scss';
import TabContent from "@/components/TabContent";
import TableMember from "@/components/TableMember";
import CreateDirectory from "@/components/createDirectory";
import type { TreeDataNode } from 'antd';
import { getMenuDetailApi } from "@/config/apis/modules/course";
import axios from "axios";

const CourseMember: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const course_id = searchParams.get('course_id');
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [fileList, setFileList] = useState<{ [key: string]: UploadFile[] }>({});
    /**
     * 上传图片前的校验
     * @param file 
     * @returns 
     */
    const beforeUpload = (file: UploadFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片!');
        }
        const isLt2M = file.size !== undefined && file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片必须小于 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (nodeKey: string, info: { fileList: UploadFile[] }) => {
        setFileList({ ...fileList, [nodeKey]: info.fileList });
    };
    /**
     * 删除图片
     * @param file 
     * @param nodeTitle 
     */
    const handleRemove = async (file: UploadFile, nodeTitle: string) => {
        try {
            await axios.post('http://localhost:3000/delete-directory-image', {
                fileName: file.name,
                title: nodeTitle,
                course_id
            });
            const newFileList = fileList[nodeTitle].filter(item => item.uid !== file.uid);
            setFileList({ ...fileList, [nodeTitle]: newFileList });
            message.success('图片删除成功');
        } catch (error) {
            console.error('Failed to delete image:', error);
            message.error('图片删除失败');
        }
    };
    /**
     * 根据二级导航动态生成上传按钮
     * @param data 
     * @returns 
     */
    const renderUploadButtons = (data: TreeDataNode[]) => {

        const uploadButtons: JSX.Element[] = [];

        const traverseTree = (nodes: any) => {
            nodes.forEach((node:any) => {
                if (node.isLeaf) {
                    uploadButtons.push(
                        <div key={`${node.title}`}>
                            <h4>{node.title}</h4>
                            <Upload
                                name="directoryImage"
                                action="http://localhost:3000/upload-directory-image"
                                listType="picture"
                                fileList={fileList[String(node.title)] || []}
                                onChange={(info) => handleChange(node.title as string, info)}
                                beforeUpload={beforeUpload}
                                multiple
                                data={{ title: node.title, course_id }}
                                onRemove={(file) => handleRemove(file, node.title)}
                            >
                                <Button icon={<UploadOutlined />}>上传图片</Button>
                            </Upload>
                        </div>
                    );
                }
                if (node.children) {
                    traverseTree(node.children);
                }
            });
        };

        traverseTree(data);
        return uploadButtons;
    };
    /**
     * 图片初始化
     */
    const initData = async () => {
        try {
            const {data} = await getMenuDetailApi({ course_id })
            const imagesData = JSON.parse(data.MenuDetail[0].menu_detail); 
            const newFileList: { [key: string]: UploadFile[] } = {};

            imagesData.forEach((image: string) => {
                const [title, fileName] = image.split('-');
                if (!newFileList[title]) {
                    newFileList[title] = [];
                }
                newFileList[title].push({
                    uid: `${title}-${fileName}`,
                    name: fileName,
                    status: 'done',
                    url: `http://localhost:3000/uploads/${fileName}`
                });
            });

            setFileList(newFileList);
        } catch (error) {
            console.error('Failed to fetch images:', error);
        }
    }
    React.useEffect(() => {
        initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="container-head">
                <span className="container-head-back" onClick={() => navigate(-1)}><RollbackOutlined /> 返回课程</span>
                <span>课程管理</span>
                <span></span>
            </div>
            <div className="container course-admin-container">
                <TabContent stepNum={'1'} stepLabel={'目录修改/创建'}>
                    <CreateDirectory onDataChange={setTreeData} />
                </TabContent>
                <TabContent stepNum={'2'} stepLabel={'学员管理'}>
                    <TableMember />
                </TabContent>
                <TabContent stepNum={'3'} stepLabel={'图片上传'}>
                    {renderUploadButtons(treeData)}
                </TabContent>
            </div>
        </>
    );
};

export default CourseMember;