/* eslint-disable @typescript-eslint/no-explicit-any */
import { Graph,Path } from '@antv/x6';
import { useCallback, useEffect, useState } from 'react';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Export } from '@antv/x6-plugin-export';
import { History } from '@antv/x6-plugin-history';

// 定义useAntvX6 Hook接收一个包含容器引用的配置对象
const useAntvX6 = (config: any) => {
    const { container, connectorType } = config;
    const [x6Graph, setX6Graph] = useState<Graph>();

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
                // img: {
                //     'xlink:href':
                //         'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
                //     width: 12, // 增加图标大小
                //     height: 12,
                //     x: 15,
                //     y: 15,
                // },
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
        },
        true
    );
    // 中心主题或分支主题
    Graph.registerNode(
        'topic',
        {
            inherit: 'rect',
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
                    rx: 6,
                    ry: 6,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                    strokeWidth: 1,
                },
                img: {
                    ref: 'body',
                    refX: '100%',
                    refY: '50%',
                    refY2: -8,
                    width: 16,
                    height: 16,
                    'xlink:href':
                        'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ',
                    event: 'add:topic',
                    class: 'topic-image',
                },
                label: {
                    fontSize: 14,
                    fill: '#262626',
                },
            },
        },
        true,
    )

    // 子主题
    Graph.registerNode(
        'topic-child',
        {
            inherit: 'rect',
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body',
                },
                {
                    tagName: 'text',
                    selector: 'label',
                },
                {
                    tagName: 'path',
                    selector: 'line',
                },
            ],
            attrs: {
                body: {
                    fill: '#ffffff',
                    strokeWidth: 0,
                    stroke: '#5F95FF',
                },
                label: {
                    fontSize: 14,
                    fill: '#262626',
                    textVerticalAnchor: 'bottom',
                },
                line: {
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    d: 'M 0 15 L 60 15',
                },
            },
        },
        true,
    )

    // 连接器
    Graph.registerConnector(
        'mindmap',
        (sourcePoint, targetPoint, _routerPoints, options) => {
            const midX = sourcePoint.x + 10
            const midY = sourcePoint.y
            const ctrX = (targetPoint.x - midX) / 5 + midX
            const ctrY = targetPoint.y
            const pathData = `
       M ${sourcePoint.x} ${sourcePoint.y}
       L ${midX} ${midY}
       Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
      `
            return options.raw ? Path.parse(pathData) : pathData
        },
        true,
    )

    // 边
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