import { Markup } from '@antv/x6';

const PORT_ATTRS = {
    circle: {
        r: 6, // 半径
        magnet: true, // 是否可连接
        stroke: '#3666d6', // 边框颜色
        strokeWidth: 1, // 边框宽度
        fill: '#fff', // 填充颜色
        style: {
            visibility: 'hidden'
        }
    }
};
/** 四个位置的连接桩 */
export const PORT_LIST = {
    groups: {
        top: {
            position: 'top',
            attrs: PORT_ATTRS
        },
        right: {
            position: 'right',
            attrs: PORT_ATTRS
        },
        bottom: {
            position: 'bottom',
            attrs: PORT_ATTRS
        },
        left: {
            position: 'left',
            attrs: PORT_ATTRS
        }
    },
    items: [{ group: 'top' }, { group: 'right' }, { group: 'bottom' }, { group: 'left' }]
};

/** 自定义节点shape */
export const CUSTOM_SHAPE = 'api-x6-node';
export const CUSTOM_SHAPE_WIDTH = 148;
export const CUSTOM_SHAPE_HEIGHT = 200;

/** 节点工具配置 */
export const NODE_TOOLS = [
    { placement: 'top' },
    { placement: 'right' },
    { placement: 'bottom' },
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
