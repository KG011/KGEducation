// import React, { useState } from "react";
// import "./App.css"; // 假设用于自定义样式，下面会简单提及样式相关内容

// // 定义树形数据结构类型（这里简化示意，和你之前的类似）
// interface TreeDataNode {
//     title: string;
//     key: string;
//     children?: TreeDataNode[];
//     isLeaf?: boolean;
// }

// const App: React.FC = () => {
//     // 使用状态管理树形数据
//     const [treeData, setTreeData] = useState<TreeDataNode[]>([
//         {
//             title: "1金融科技历史",
//             key: "0-0",
//             children: [
//                 { title: "1历史起源", key: "0-0-0", isLeaf: true },
//                 { title: "2馈赠阿萨德", key: "0-0-1", isLeaf: true },
//             ],
//         },
//         {
//             title: "2金融科技效果",
//             key: "0-1",
//             children: [
//                 { title: "1大娃娃的", key: "0-1-0", isLeaf: true },
//                 { title: "2阿瓦达我的挖的挖", key: "0-1-1", isLeaf: true },
//             ],
//         },
//     ]);

//     // 查找节点的辅助函数，根据给定的 key 在树中查找节点
//     const findNodeByKey = (key: string, tree: TreeDataNode[]): TreeDataNode | null => {
//         for (const node of tree) {
//             if (node.key === key) {
//                 return node;
//             }
//             if (node.children && node.children.length > 0) {
//                 const foundInChildren = findNodeByKey(key, node.children);
//                 if (foundInChildren) {
//                     return foundInChildren;
//                 }
//             }
//         }
//         return null;
//     };

//     // 添加节点的函数
//     const addNode = () => {
//         const parentKey = prompt("请输入要添加节点的父节点 key（留空则添加到根节点）");
//         const title = "请输入新节点的标题";
//         const newKey = generateUniqueKey(); // 生成一个唯一的 key，这里简单示意，实际可优化
//         const isLeaf = confirm("是否为叶子节点？");
//         const newNode: TreeDataNode = { title, key: newKey, children: [], isLeaf };

//         if (!parentKey) {
//             setTreeData([...treeData, newNode]);
//         } else {
//             const parentNode = findNodeByKey(parentKey, treeData);
//             if (parentNode) {
//                 if (!parentNode.children) {
//                     parentNode.children = [];
//                 }
//                 setTreeData(prevData => {
//                     const updatedData = [...prevData];
//                     const parentIndex = updatedData.findIndex(node => node.key === parentNode.key);
//                     updatedData[parentIndex].children?.push(newNode);
//                     return updatedData;
//                 });
//             } else {
//                 alert("未找到对应的父节点，请检查输入的 key 是否正确");
//             }
//         }
//     };

//     // 删除节点的函数
//     const deleteNode = () => {
//         const keyToDelete = prompt("请输入要删除节点的 key");
//         const parentKey = prompt("请输入该节点的父节点 key");

//         const parentNode = findNodeByKey(parentKey!, treeData);
//         if (parentNode) {
//             setTreeData(prevData => {
//                 const updatedData = [...prevData];
//                 const parentIndex = updatedData.findIndex(node => node.key === parentNode.key);
//                 const indexToDelete = updatedData[parentIndex].children?.findIndex(
//                     node => node.key === keyToDelete
//                 );
//                 if (indexToDelete!== -1) {
//                     updatedData[parentIndex].children?.splice(indexToDelete!, 1);
//                 } else {
//                     alert("未在指定父节点的子节点中找到该节点，请检查输入的 key 是否正确");
//                 }
//                 return updatedData;
//             });
//         } else {
//             alert("未找到对应的父节点，请检查输入的 key 是否正确");
//         }
//     };

//     // 编辑标题的函数
//     const editTitle = () => {
//         const keyToEdit = prompt("请输入要编辑标题的节点 key");
//         const newTitle = "请输入新的标题";
//         const nodeToEdit = findNodeByKey(keyToEdit!, treeData);
//         if (nodeToEdit) {
//             setTreeData(prevData => {
//                 const updatedData = [...prevData];
//                 const indexToEdit = updatedData.findIndex(node => node.key === nodeToEdit.key);
//                 updatedData[indexToEdit].title = newTitle;
//                 return updatedData;
//             });
//         } else {
//             alert("未找到对应的节点，请检查输入的 key 是否正确");
//         }
//     };

//     // 简单生成一个唯一 key 的函数，实际应用中可结合更多逻辑确保唯一性
//     const generateUniqueKey = () => {
//         return Math.random().toString(36).substr(2, 5);
//     };

//     // 渲染树形结构的函数
//     const renderTree = (tree: TreeDataNode[], level = 0) => {
//         return tree.map((node) => (
//             <div key={node.key} style={{ marginLeft: level * 20 }}>
//                 <span>{node.title} ({node.key})</span>
//                 {!node.isLeaf && (
//                     <button onClick={() => addNodeTo(node.key)}>添加子节点</button>
//                 )}
//                 <button onClick={() => deleteNode(node.key)}>删除节点</button>
//                 <button onClick={() => editTitle(node.key)}>编辑标题</button>
//                 {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
//             </div>
//         ));
//     };

//     return (
//         <div className="app-container">
//             <button onClick={addNode}>添加节点</button>
//             <button onClick={deleteNode}>删除节点</button>
//             <button onClick={editTitle}>编辑标题</button>
//             <div>{renderTree(treeData)}</div>
//         </div>
//     );
// };

// export default App;