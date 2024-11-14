/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover } from 'antd'
import { Graph, Node } from "@antv/x6";

import { CUSTOM_SHAPE, CUSTOM_SHAPE_HEIGHT, CUSTOM_SHAPE_ITEM, CUSTOM_SHAPE_WIDTH, EDGE_CONFIG, NODE_TOOLS, useNodeSortConfig } from './config'
import React from 'react';
const ModuleNode = (props: { formType: string, title: string, onSelect?: (data?: any) => void }) => {
    const { onSelect, formType, title } = props
    switch (formType) {
        case 'main-default':
            return (
                <div className='module-node' onClick={() => { onSelect?.({ key: formType }) }}>
                    <div className="mind-map-node"></div>
                    <div className='mind-map-node-title'>{title}</div>
                </div>
            )
        case 'item-default':
            return (
                <div className='module-node' onClick={() => { onSelect?.({ key: formType }) }}>
                    <div className="mind-map-nodeItem"></div>
                    <div className='mind-map-node-title'>{title}</div>
                </div>
            )
    }

}
const NodeContent = (props: { onSelect?: (data?: string) => void }) => {
    const { onSelect } = props
    const pluginConfigList = useNodeSortConfig();
    return (
        <div>
            {pluginConfigList.map((item) => {
                return (
                    <div key={item.type}>
                        <div className="node-title">{item.label}</div>
                        <div className="node-select-container">
                            {item.nodeList.map((nodeItem) => {
                                return (
                                    <ModuleNode
                                        key={nodeItem.formType}
                                        formType={nodeItem.formType}
                                        title={nodeItem.title}
                                        onSelect={data => onSelect?.(data)}
                                    >
                                    </ModuleNode>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
interface x6Data {
    /**
      * 存储校验通过后的配置数据
      */
    nodeFormDataMap: {
        [name: string]: { [name: string]: any };
    };
    nodeOperateMap: {
        [name: string]: { [name: string]: any };
    };
}
interface MindMapNodeProps {
    graph: Graph
    node: Node
    x6Data: x6Data
}
interface NodePosition {
    x: number;
    y: number;
    placement: string;
}
//画布节点
const MindMapNode = (props: MindMapNodeProps) => {
    const { graph, node, x6Data } = props
    const [nodeData, setNodeData] = React.useState(node.data);
    //点击事件
    const onSelect = (placement: string, data?: any) => {
        const { x, y } = node.position();
        const {
            x: targetX,
            y: targetY,
            placement: targetPortPlacement
        } = calcTargetPosition(graph, { x, y, placement });
        //目标节点
        const targetShape = data.key == 'main-default' ? CUSTOM_SHAPE : CUSTOM_SHAPE_ITEM
        const targetLabel = data.key == 'main-default' ? '默认主题' : '默认子标签'
        const target = graph?.addNode({
            shape: targetShape,
            x: targetX,
            y: targetY,
            data: {
                ...data,
                label: targetLabel
            }
        });
        const sourcePortId = node.ports.items.find(port => port.group === placement)?.id;
        const targetPortId = target.ports.items.find(port => port.group === targetPortPlacement)?.id;
        graph.addEdge({
            ...EDGE_CONFIG,
            source: { cell: node, port: sourcePortId }, // 源节点和连接桩 ID
            target: { cell: target, port: targetPortId }, // 目标节点和连接桩 ID
            data: {
                title: '连线',
                formType: 'edge',
                tips: '箭头'
            }
        });
    }

    /**
    * 计算插入节点的位置信息
    * @param sourcePosition 原节点位置信息
    * @returns 插入节点的位置信息
    */
    const calcTargetPosition = (graph: Graph, sourcePosition: NodePosition) => {
        const distance = 140;
        let offset = 0;
        const { x, y, placement } = sourcePosition;
        const targetPosition: NodePosition = { x, y, placement };
        while (true) {
            switch (placement) {
                case 'right':
                    targetPosition.x = x + CUSTOM_SHAPE_WIDTH + distance;
                    targetPosition.y = y + offset;
                    targetPosition.placement = 'left';
                    break;
                case 'left':
                    targetPosition.x = x - CUSTOM_SHAPE_WIDTH - distance;
                    targetPosition.y = y + offset;
                    targetPosition.placement = 'right';
                    break;
                default:
                    break;
            }
            const areaX = ['top', 'bottom'].includes(placement) ? targetPosition.x - 30 : targetPosition.x;
            const areaY = ['right', 'left'].includes(placement) ? targetPosition.y - 30 : targetPosition.y;
            /**
             * strict表示是否严格匹配区域
             * true表示必须完全在区域内才算匹配，结果是会部分重复
             * false表示部分在区域内即算匹配，结果是会完全不重复
             */
            const nodesInArea = graph.getNodesInArea(areaX, areaY, CUSTOM_SHAPE_WIDTH, CUSTOM_SHAPE_HEIGHT, {
                strict: false
            });
            if (nodesInArea.length === 0) break;
            offset++;
        }
        return targetPosition;
    };
    React.useEffect(() => {
        if (!x6Data) return;
        // 记录内部刷新方法，方便后续更新状态
        x6Data.nodeOperateMap[node.id] = {
            setNodeData
        };
    }, [node.id, x6Data])
    return (
        <>
            <div className="mind-map-node"
                style={{
                    background: x6Data?.nodeFormDataMap?.[node.id]?.bgColor || nodeData.bgColor,
                    color: x6Data?.nodeFormDataMap?.[node.id]?.labelColor || nodeData.labelColor,
                    borderColor: x6Data?.nodeFormDataMap?.[node.id]?.borderColor || nodeData.borderColor,
                }}>
                <div className="mind-map-node-title">
                    {x6Data?.nodeFormDataMap?.[node.id]?.label || nodeData.label}
                </div>
                {NODE_TOOLS.map(({ placement }) => {
                    return (
                        <Popover
                            key={placement}
                            content={<NodeContent onSelect={data => onSelect(placement, data)} />}
                            title="点击自动扩展画布"
                            placement="right"
                        >
                            <img
                                className='img'
                                style={{ left: placement === 'left' ? '-16px' : '100%' }}
                                src={'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ'}
                            />
                        </Popover>
                    )
                })}
            </div>

        </>
    )
}
interface MindMapNodeItemProps {
    graph: Graph
    node: Node
    x6Data: x6Data
}
//画布子节点
export const MindMapNodeItem = (props: MindMapNodeItemProps) => {
    const { x6Data, node } = props
    const [nodeData, setNodeData] = React.useState(node.data);
    React.useEffect(() => {
        if (!x6Data) return;
        // 记录内部刷新方法，方便后续更新状态
        x6Data.nodeOperateMap[node.id] = {
            setNodeData
        };
    }, [node.id, x6Data])
    return (
        <div className='true-node-item'
            style={{
                background: x6Data?.nodeFormDataMap?.[node.id]?.bgColor || nodeData.bgColor,
                color: x6Data?.nodeFormDataMap?.[node.id]?.labelColor || nodeData.labelColor,
                borderColor: x6Data?.nodeFormDataMap?.[node.id]?.borderColor || nodeData.borderColor,
            }}>
            <div className='true-node-item-title'>
                {x6Data?.nodeFormDataMap?.[node.id]?.label || nodeData.label}
            </div>
        </div>
    )
}
export default MindMapNode