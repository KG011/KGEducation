/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useGlobalContext } from '@/context/Global';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getTreeDataApi } from '@/config/apis/modules/course';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
    {
        title: '金融科技历史',
        key: '1',
        selectable: false,
        children: [
            { title: '历史起源', key: '1-1', isLeaf: true },
            { title: '馈赠阿萨德', key: '1-2', isLeaf: true },
        ],
    },
    {
        title: '金融科技效果',
        key: '2',
        selectable: false,
        children: [
            { title: '大娃娃的', key: '2-1', isLeaf: true },
            { title: '阿瓦达我的挖的挖', key: '2-2', isLeaf: true },
        ],
    },
];

const MenuList: React.FC = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const course_name = searchParams.get('course_name');
    const course_id = searchParams.get('course_id');
    const [menuData, setMenuData] = React.useState(treeData)
    // const treeId = searchParams.get('treeId');

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
        if (!info.node.isLeaf) return
        setRouter(`course?course_name=${course_name}&course_id=${course_id}&treeId=${keys}&treeLabel=${info.node.exactTitle}`)
    };
    const initData = async () => {
        const { data } = await getTreeDataApi({ course_id })
        if (data.treeData.length > 0) {
            setMenuData(JSON.parse(data.treeData[0].course_menu));
        }
    }
    React.useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    /**
     * 二次处理树数据，添加阅读状态
     * @param data 
     * @returns 
     */
    const renderTitle = (node: any) => {
        return (
            <span>
                {node.title}
                {node.isLeaf &&
                    node.itemDone ? <span style={{ float:'right',marginRight:'10px',color: '#31DDB3' }}><CheckOutlined /></span>
                    : <span><CloseOutlined style={{ float:'right',marginRight:'10px',color: 'red' }} /></span>
                }
            </span>
        );
    };
    /**
     * 二次处理树数据，添加阅读状态
     * @param data 
     * @returns 
     */
    const processTreeData = (data: TreeDataNode[]): TreeDataNode[] => {
        return data.map(node => ({
            ...node,
            title: renderTitle(node),
            exactTitle: node.title,
            children: node.children ? processTreeData(node.children) : undefined,
        }));
    };

    return (
        <DirectoryTree
            multiple
            defaultExpandedKeys={['0-0']}
            defaultSelectedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={processTreeData(menuData)}
        />
    );
};

export default MenuList;