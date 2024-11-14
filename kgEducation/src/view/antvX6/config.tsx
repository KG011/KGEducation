import React from "react";
import {
    CaretRightOutlined
} from '@ant-design/icons';
import { Markup } from "@antv/x6";

/** 自定义节点shape */
export const CUSTOM_SHAPE = 'mind-map-node';
export const CUSTOM_SHAPE_WIDTH = 140;
export const CUSTOM_SHAPE_HEIGHT = 60;


export const CUSTOM_SHAPE_ITEM = 'mind-map-node-item';
export const CUSTOM_SHAPE_WIDTH_ITEM = 70;
export const CUSTOM_SHAPE_HEIGHT_ITEM = 30;

export const BASE_RECT_SHAPE = 'base-node-rect';
export const BASE_RECT_WIDTH = 70;
export const BASE_RECT_HEIGHT = 30;


/** 节点工具配置 */
export const NODE_TOOLS = [
    { placement: 'right' },
    { placement: 'left' }
];

/** 连线通用配置 */
export const EDGE_CONFIG = {
    attrs: {
        line: {
            stroke: '#A7ACB1',
            strokeWidth: 3,
            targetMarker: {
                name: 'block',
                width: 6,
                height: 11,
                open: true,
                offset: -4,
                strokeWidth: 3
            }
        }
    },
    zIndex: 0,
    defaultLabel: {
        markup: Markup.getForeignObjectMarkup(),
        attrs: {
            fo: {
                width: 100,
                height: 28,
                x: -50,
                y: -36
            }
        },
        position: 0.5
    }
};
export const useNodeSortConfig = () => {
    const config = React.useMemo(() => {
        return [
            {
                label: <span><CaretRightOutlined style={{ color: 'blue' }}/>主题</span>,
                type: 'main',
                nodeList: [
                    {
                        title: '默认',
                        tips: '思维导图的节点',
                        formType: 'main-default',
                        data: {}
                    }
                ]
            },
            {
                label: <span><CaretRightOutlined style={{ color: 'blue' }}/>子标签</span>,
                type: 'item',
                // icon: <Target />,
                nodeList: [
                    {
                        title: '默认',
                        tips: '思维导图的子标签',
                        formType: 'item-default',
                        data: {}
                    }
                ]
            }
        ]
    }, [])
    return config
}