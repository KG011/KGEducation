/* eslint-disable @typescript-eslint/no-explicit-any */
import { Graph } from '@antv/x6';
import { useCallback, useEffect, useState } from 'react';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Export } from '@antv/x6-plugin-export';
import { History } from '@antv/x6-plugin-history';
import { register } from '@antv/x6-react-shape'
import MindMapNode, { MindMapNodeItem } from './mindMapNode';
import { CUSTOM_SHAPE, CUSTOM_SHAPE_HEIGHT, CUSTOM_SHAPE_HEIGHT_ITEM, CUSTOM_SHAPE_ITEM, CUSTOM_SHAPE_WIDTH, CUSTOM_SHAPE_WIDTH_ITEM } from './config';
// 定义useAntvX6 Hook接收一个包含容器引用的配置对象
const useAntvX6 = (config: any) => {
    const { container, connectorType, x6Data } = config;
    const [x6Graph, setX6Graph] = useState<Graph>();
    //基础画布
    Graph.registerNode(
        'polygonNew',
        {
            inherit: 'polygon',
            ports: {
                groups: {
                    top: {
                        position: 'top',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6, // 增加连接桩半径
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    bottom: {
                        position: 'bottom',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    left: {
                        position: 'left',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    right: {
                        position: 'right',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                },
            },
            data: {
                name: '流程',
                labelColor: '#000',
                bgColor: '#6BC1FF',
                borderColor: '#8F979D'
            }
        },true
    )
    Graph.registerNode(
        'custom-node',
        {
            inherit: 'rect',
            width: 120, // 增加宽度
            height: 50, // 增加高度
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body',
                },
                {
                    tagName: 'image',
                    selector: 'img',
                },
                {
                    tagName: 'text',
                    selector: 'label',
                },
            ],
            attrs: {
                body: {
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    fill: '#fff',
                    rx: 8, // 增加圆角半径
                    ry: 8,
                },
            },
            ports: {
                groups: {
                    top: {
                        position: 'top',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6, // 增加连接桩半径
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    bottom: {
                        position: 'bottom',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    left: {
                        position: 'left',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                    right: {
                        position: 'right',
                        attrs: {
                            circle: {
                                magnet: true,
                                stroke: '#8f8f8f',
                                r: 6,
                                style: {
                                    visibility: 'hidden'
                                } // 默认隐藏
                            },
                        },
                    },
                },
            },
            data: {
                name: '导航',
                labelColor: '#000',
                bgColor: '#6BC1FF',
                borderColor: '#8F979D'
            }
        },
        true
    );

    // 思维导图中心主题
    register({
        shape: CUSTOM_SHAPE,
        width: CUSTOM_SHAPE_WIDTH,
        height: CUSTOM_SHAPE_HEIGHT,
        component: ({ node, graph }) => {
            return <MindMapNode graph={graph} node={node} x6Data={x6Data} /> as any
        },
        data: {
            name: '默认主题',
            labelColor: '#000000',
            bgColor: '#EFF4FF',
            borderColor: '#5f95ff',
            fontSize: '14px'
        }
    })

    // 思维导图子标签
    register({
        shape: CUSTOM_SHAPE_ITEM,
        width: CUSTOM_SHAPE_WIDTH_ITEM,
        height: CUSTOM_SHAPE_HEIGHT_ITEM,
        component: ({ node, graph }) => {
            return <MindMapNodeItem graph={graph} node={node} x6Data={x6Data} /> as any
        },
        data: {
            name: '默认子标签',
            labelColor: '#000000',
            bgColor: '#FFFFFF',
            borderColor: '#FF4D4F',
            fontSize: '12px'
        }
    })

    Graph.registerEdge(
        'mindmap-edge',
        {
            inherit: 'edge',
            connector: {
                name: 'mindmap',
            },
            attrs: {
                line: {
                    targetMarker: '',
                    stroke: '#A2B1C3',
                    strokeWidth: 2,
                },
            },
            zIndex: 0,
        },
        true,
    )
    // 初始化插件的函数
    const initPlugins = useCallback((graph: any) => {
        // 添加对齐线插件
        graph.use(new Snapline({ enabled: true }));

        // 添加剪贴板插件
        graph.use(new Clipboard({ enabled: true }));
        // 添加键盘插件
        graph.use(new Keyboard({ enabled: true }));
        // 添加选择插件
        graph.use(new Selection({ rubberband: true, rubberEdge: true }));
        // 添加导出插件
        graph.use(new Export());
        // 添加历史记录插件
        graph.use(new History({ enabled: true }));

        return graph;
    }, []);

    // 初始化图形的函数
    const initGraph = useCallback(() => {
        if (!container.current) return;
        const graph = new Graph({
            container: container.current,
            width: 800,
            height: 600,
            autoResize: true,
            background: {
                color: '#F2F7FA',
            },
            grid: {
                visible: true,
                type: 'doubleMesh',
                args: [
                    {
                        color: '#eee',
                        thickness: 1,
                    },
                    {
                        color: '#ddd',
                        thickness: 1,
                        factor: 4,
                    },
                ],
            },
            connecting: {
                allowBlank: false,
                allowMulti: true,
                allowLoop: false,
                allowNode: true,
                allowEdge: false,
                // 自动规避拦截点
                router: 'manhattan',
                connector: {
                    name: connectorType ? connectorType : 'rounded',
                    // name: 'smooth',
                    args: { radius: 4 }
                },
                anchor: 'center',
                snap: { radius: 20 },
            },
            highlighting: {
                magnetAvailable: {
                    name: 'stroke',
                    args: {
                        attrs: {
                            fill: '#fff',
                            stroke: '#3d66f5',
                            strokeWidth: 4,
                        },
                    },
                },
                magnetAdsorbed: {
                    name: 'stroke',
                    args: {
                        attrs: {
                            stroke: '#3d66f5',
                            strokeWidth: 4,
                        },
                    },
                },
            },
        });
        return initPlugins(graph);
    }, [connectorType, container, initPlugins]);

    useEffect(() => {
        const graph = initGraph();
        if (graph) {
            setX6Graph(graph);
        }
    }, [initGraph]);

    return { x6Graph };
};

export default useAntvX6;