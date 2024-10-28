import React, { ReactNode, SetStateAction, useState } from 'react';
import { Tree, Input, Popconfirm, message } from 'antd';
import type { PopconfirmProps, TreeDataNode, TreeProps, } from 'antd';
import './index.scss'
import { editCourseMenuApi } from '@/config/apis/modules/course';
import { useSearchParams } from 'react-router-dom';
const defaultData: TreeDataNode[] = [{ title: '目录导航1', key: 'newRootKey', children: [{ title: '目录详细1', key: 'newRootKey1' }] }];



const CreateDirectory: React.FC = () => {
  const [gData, setGData] = useState(defaultData);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null);
  const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [searchParams] = useSearchParams();
  const courseName = searchParams.get('course_name');

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const updateData = (data: TreeDataNode[]) => {
      const newData = [...data];
      let dragObj: TreeDataNode;
      const loop = (
        data: TreeDataNode[],
        key: React.Key,
        callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
      ) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children!, key, callback);
          }
        }
      };
      loop(newData, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        loop(newData, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else {
        let ar: TreeDataNode[] = [];
        let i: number;
        loop(newData, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i!, 0, dragObj!);
        } else {
          ar.splice(i! + 1, 0, dragObj!);
        }
      }
      return newData;
    };

    setGData(updateData(gData));
  };

  const onTreeSelect = (selectedKeys: React.Key[]) => {
    setSelectedNodeKey(selectedKeys[0] as string);
  };

  const addRootNode = () => {
    const newRootKey = `newRoot_${Date.now()}`;
    const newRootNode = { title: '新目录导航', key: newRootKey, children: [] };
    setGData([newRootNode, ...gData]);
  };

  const addChildNode = () => {
    if (selectedNodeKey) {
      const newData = [...gData];
      const parentNode = newData.find(node => node.key === selectedNodeKey);
      if (parentNode) {
        const newChildKey = `${selectedNodeKey}-newChild_${Date.now()}`;
        const newChildNode = { title: '新目录详细', key: newChildKey, children: [] };
        parentNode.children = parentNode.children || [];
        parentNode.children.push(newChildNode);
        setGData(newData);
      }
    }
  };

  const startEditing = (nodeKey: string) => {
    setEditingNodeKey(nodeKey);
    const findNode = (data: TreeDataNode[]) => {
      for (const node of data) {
        if (node.key === nodeKey) {
          setNewNodeTitle(node.title as SetStateAction<string>);
          return;
        }
        if (node.children) {
          findNode(node.children);
        }
      }
    };
    findNode(gData);
  };

  const saveEditedNode = () => {
    if (editingNodeKey && newNodeTitle.trim() !== '') {
      const updateData = (data: TreeDataNode[]) => {
        const newData = [...data];
        const loop = (
          data: TreeDataNode[],
          key: React.Key,
          callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
        ) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
              return callback(data[i], i, data);
            }
            if (data[i].children) {
              loop(data[i].children!, key, callback);
            }
          }
        };
        loop(newData, editingNodeKey, (_node, index, arr) => {
          arr[index].title = newNodeTitle;
        });
        return newData;
      };
      setGData(updateData(gData));
      setEditingNodeKey(null);
      setNewNodeTitle('');
    }
  };

  const renderTreeNodes = (data: TreeDataNode[]) => {
    return data.map(item => (
      <Tree.TreeNode
        title={
          editingNodeKey === item.key
            ? <Input value={newNodeTitle} onChange={(e) => setNewNodeTitle(e.target.value)} />
            : <span onDoubleClick={() => startEditing(item.key as string)}>{item.title as ReactNode}</span>
        }
        key={item.key}
      >
        {item.children && item.children.length > 0 ? renderTreeNodes(item.children) : null}
      </Tree.TreeNode>
    ));
  };
  const confirm: PopconfirmProps['onConfirm'] = async () => {
    await editCourseMenuApi({ course_name: courseName, data: JSON.stringify(gData) })
    message.success('成功提交修改');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('取消修改');
  };

  return (
    <div>
      <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
        onSelect={onTreeSelect}
      >
        {renderTreeNodes(gData)}
      </Tree>
      <Popconfirm
        title="温馨提升"
        description="是否确定提交当前目录?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <button className='Editbutton'>确定修改目录</button>
      </Popconfirm>

      <button onClick={addRootNode} className='Editbutton'>添加根节点</button>
      <button onClick={addChildNode} className='Editbutton'>添加子节点</button>
      {editingNodeKey && (
        <button onClick={saveEditedNode} className='Editbutton'>保存编辑</button>
      )}
    </div>
  );
};

export default CreateDirectory;