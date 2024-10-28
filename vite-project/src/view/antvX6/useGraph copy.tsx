/* eslint-disable @typescript-eslint/no-explicit-any */
import { Graph, Shape } from "@antv/x6";
import { useCallback, useEffect, useState } from "react";
import { register } from '@antv/x6-react-shape';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Transform } from '@antv/x6-plugin-transform'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { CUSTOM_SHAPE, CUSTOM_SHAPE_WIDTH, CUSTOM_SHAPE_HEIGHT, PORT_LIST, EDGE_CONFIG } from './constans';
import { Progress } from "antd";
interface Config {
    /** 画布容器选择器 */
    containerSelector: string;
    /**
     * 画布自适应容器，选择器
     * 默认值为画布容器
     */
    autoFitContainerSelector?: string;
    /**
     * 公用数据
     */
    x6Data?: any;
}
const NodeComponent = () => {
    return (
        <div className="react-node">
            <Progress type="circle" percent={30} width={80} />
        </div>
    )
}
const AntvX6 = (config: Config) => {
    const { containerSelector, autoFitContainerSelector } = config;
    const [x6Graph, setX6Graph] = useState<Graph>();
    /** 初始化插件 */
    const initPlugin = useCallback((graph: Graph) => {
        graph.use(
            new Snapline({
                enabled: true,
            }),
        )
        graph.use(
            new Transform({
                resizing: true,
            }),
        )

        graph.use(
            new Clipboard({
                enabled: true,
            })
        )
        graph.use(
            new Keyboard({
                enabled: true,
            })
        )
    }, []);
    /** 控制连接点显示/隐藏 */
    const showPorts = useCallback(
        (show: boolean) => {
            const container = document.querySelector(containerSelector)!;
            const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>;
            for (let i = 0, len = ports.length; i < len; i += 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden';
            }
        },
        [containerSelector]
    );

    /** 初始化连接点 */
    const initPorts = useCallback(
        (graph: Graph) => {
            graph.on('node:mouseenter', () => showPorts(true));
            graph.on('node:mouseleave', () => {
                showPorts(false)
            });
        },
        [showPorts]
    );

    /** 初始化连线事件 */
    // const initEdgeEvent = useCallback(
    //     (graph: Graph) => {
    //         graph.on('edge:selected', ({ edge }) => {
    //             showPorts(true);
    //             edge.setAttrs({ line: { stroke: '#3666D6' } });
    //             edge.addTools([
    //                 {
    //                     // 调整箭头工具
    //                     name: 'target-arrowhead',
    //                     args: {
    //                         attrs: { fill: '#3666D6' }
    //                     }
    //                 }
    //             ]);
    //         });
    //         graph.on('edge:unselected', ({ edge }) => {
    //             showPorts(false);
    //             edge.setAttrs({ line: { stroke: '#A7ACB1' } });
    //             edge.removeTools();
    //         });
    //     },
    //     [showPorts]
    // );
    //入口初始化
    const initGraph = useCallback(() => {
        if (!containerSelector) return console.error('containerSelector is required');
        const container = document.querySelector(containerSelector) as HTMLElement;
        const autoFitContainer = autoFitContainerSelector
            ? (document.querySelector(autoFitContainerSelector) as HTMLElement)
            : container;
        if (!container) return console.error('graph container is not found');
        const graph = new Graph({
            container,
            autoResize: autoFitContainer || container || true,
            connecting: {
                router: 'manhattan',
                connector: {
                    name: 'rounded',
                    args: { radius: 4 }
                },
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: false,
                snap: { radius: 20 },
                createEdge: () => new Shape.Edge(EDGE_CONFIG),
                validateConnection({ sourceCell, targetCell, targetMagnet }) {
                    // 目标点不能为空
                    if (!targetMagnet) return false;
                    // 不能连接自己
                    if (sourceCell === targetCell) return false;
                    return true;
                }
            },
            highlighting: {
                // 连接点的高亮配置
                magnetAdsorbed: {
                    name: 'stroke',
                    args: {
                        attrs: { fill: '#fff', stroke: '#3666d6' }
                    }
                }
            },
            // 画布缩放配置
            mousewheel: {
                enabled: true,
                modifiers: ['ctrl']
            }
        });
        initPlugin(graph);
        initPorts(graph);
        // initEdgeEvent(graph);
        setX6Graph(graph);
    }, [containerSelector, autoFitContainerSelector, initPlugin, initPorts]);
    const registerNode = () => {
        register({
            shape: CUSTOM_SHAPE,
            width: CUSTOM_SHAPE_WIDTH,
            height: CUSTOM_SHAPE_HEIGHT,
            component: NodeComponent,
            ports: PORT_LIST
        });
    };
    useEffect(() => {
        registerNode();
        initGraph();
    }, [initGraph]);
    return { x6Graph };

}
export default AntvX6