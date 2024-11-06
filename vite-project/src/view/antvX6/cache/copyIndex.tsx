/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Graph } from '@antv/x6';
import type { Cell } from '@antv/x6';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Transform } from '@antv/x6-plugin-transform';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Export } from '@antv/x6-plugin-export'
import { History } from '@antv/x6-plugin-history'
// import { Scroller } from '@antv/x6-plugin-scroller'
import OptionDialog from '../optionDialog';
import FunctionalZone from '../functionalZone';
import { deleteNotebookApi, getNotebookJsonDataApi } from '@/config/apis/modules/course';
import { useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '@/context/Global';
const AntvX6 = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    //画布ID
    const notebook_id = searchParams.get('notebook_id');
    //画布渲染盒子
    const containerRef = useRef<HTMLDivElement>(null);
    //物料区
    const stencilContainer = useRef<HTMLDivElement>(null);
    const [isShowOptionDialog, setIsShowOptionDialog] = useState(false)
    const [selectedCellsNew, setSelectedCellsNew] = useState<Cell[]>([]);
    const [labelValue, setLabelValue] = useState('Hello')
    const [labelColor, setLabelColor] = useState('#000')
    const [bgColor, setBgColor] = useState('#fff')
    const [historyState, setHistoryState] = useState({ canRedo: false, canUndo: false })
    const [graphNew, setGraphNew] = useState<Graph>()
    const commonAttrs = {
        body: {
            fill: '#fff',
            stroke: '#8f8f8f',
            strokeWidth: 1,
        },
    };
    const maxAttrs = {
        body: {
            fill: '#6BC1ff',
            stroke: '#8f8f8f',
            strokeWidth: 1,
        },
    }
    /** 控制连接点显示/隐藏 */
    const showPorts = useCallback(
        (show: boolean) => {
            const container = containerRef.current;
            const ports = container?.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>;
            for (let i = 0, len = ports.length; i < len; i += 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden';
            }
        },
        []
    );
    /** 清除选择状态 */
    const clearCells = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (graph: { getCells: () => any; }) => {
            setIsShowOptionDialog(false)
            const cells = graph.getCells();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cells.forEach((cell: any) => {
                if (cell.isNode()) {
                    // 恢复默认样式并移除工具按钮
                    cell.attr('body/stroke', '#8f8f8f');
                    cell.removeTools(['button-remove']);
                }
            });
        }
        , [])
    //编辑区确定修改
    const handleButtonClick = () => {
        selectedCellsNew.forEach((cell) => {
            if (cell.isNode()) {
                // 修改节点的 label 属性
                console.log(labelColor);
                // console.log(cell.toJSON);
                cell.attr('text/text', labelValue);
                cell.attr('text/fill', labelColor);
                cell.attr('body/fill', bgColor);
            }
        });
    };
    // 撤销恢复等操作合集
    const operate = (type: string) => {
        if (!graphNew) return;
        switch (type) {
            // 撤销
            case 'canUndo':
                graphNew.canUndo() && graphNew.undo();
                break;
            // 恢复
            case 'canRedo':
                graphNew.canRedo() && graphNew.redo();
                break;
            // 恢复
            case 'delete':
                deleteGraph()
                break;
            // 保存
            case 'saveToJSON':
                return graphNew.toJSON();
            // 导出为PDF
            case 'exportPDF':
                graphNew.exportSVG(`PDF-${new Date()}`);
                break;

        }
    };
    //删除画布
    const deleteGraph = async () => {
        await deleteNotebookApi({ notebook_id })
        setRouter(-1)
    }
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

    useEffect(() => {
        if (!containerRef.current) return;
        const graph = new Graph({
            container: containerRef.current,
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
                //自动规避拦截点
                // router: 'manhattan',
                connector: {
                    name: 'smooth',
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

        // graph.addNode({
        //     shape: 'custom-node',
        //     x: 40,
        //     y: 40,
        //     ports: {
        //         items: [{
        //             id: 'port_5',
        //             group: 'top',
        //         },
        //         {
        //             id: 'port_6',
        //             group: 'left',
        //         },
        //         {
        //             id: 'port_7',
        //             group: 'right',
        //         },
        //         {
        //             id: 'port_8',
        //             group: 'bottom',
        //         },]
        //     },
        //     label: labelValue,
        //     attrs: maxAttrs
        // });
        // graph.addNode({
        //     shape: 'custom-node',
        //     x: 160,
        //     y: 180,
        //     label: labelValue,
        //     ports: {
        //         items: [{
        //             id: 'port_5',
        //             group: 'top',
        //         },
        //         {
        //             id: 'port_6',
        //             group: 'left',
        //         },
        //         {
        //             id: 'port_7',
        //             group: 'right',
        //         },
        //         {
        //             id: 'port_8',
        //             group: 'bottom',
        //         },]
        //     },
        //     attrs: maxAttrs

        // });
        graph.use(
            new Snapline({
                enabled: true,
            })
        );
        graph.use(
            new Transform({
                resizing: true,
            })
        );
        //快捷键插件
        graph.use(
            new Clipboard({
                enabled: true,
            })
        );
        //快捷键插件
        graph.use(
            new Keyboard({
                enabled: true,
            })
        );
        //框选插件
        graph.use(
            new Selection({
                rubberband: true,
                rubberEdge: true
            })
        )
        //撤销恢复插件
        graph.use(
            new History({
                enabled: true,
            }),
        )
        //图片导出插件
        graph.use(new Export())
        const stencil = new Stencil({
            title: 'Stencil',
            target: graph,
            search(cell, keyword) {
                return cell.shape.indexOf(keyword) !== -1;
            },
            placeholder: 'Search by shape name',
            notFoundText: 'Not Found',
            collapsable: true,
            stencilGraphHeight: 0,
            groups: [
                {
                    name: 'group1',
                    title: 'Group(Collapsable)',
                },
                {
                    name: 'group2',
                    title: 'Group',
                    collapsable: false,
                },
            ],
        });
        stencilContainer.current?.appendChild(stencil.container);
        const n1 = graph.createNode({
            shape: 'rect',
            x: 40,
            y: 40,
            width: 80,
            height: 40,
            label: '元素',
            attrs: commonAttrs,

        });
        const n2 = graph.createNode({
            shape: 'circle',
            x: 180,
            y: 40,
            width: 40,
            height: 40,
            label: 'circle',
            attrs: commonAttrs,
        });
        const n3 = graph.createNode({
            shape: 'custom-node',
            x: 280,
            y: 40,
            width: 80,
            height: 40,
            label: '导航',
            attrs: maxAttrs,
            ports: {
                items: [
                    {
                        id: 'port_1',
                        group: 'top',
                    },
                    {
                        id: 'port_2',
                        group: 'left',
                    },
                    {
                        id: 'port_3',
                        group: 'right',
                    },
                    {
                        id: 'port_4',
                        group: 'bottom',
                    },
                ],
            },
        });
        const n4 = graph.createNode({
            shape: 'path',
            x: 420,
            y: 40,
            width: 40,
            height: 40,
            path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
            attrs: {
                body: {
                    fill: 'red',
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                },
            },
            label: 'love',

        });
        stencil.load([n1, n2], 'group1');
        stencil.load([n3, n4], 'group2');

        // 监听鼠标悬浮事件
        graph.on('cell:mouseenter', (event) => {
            const cell = event.cell
            if (cell.isNode()) {
                showPorts(true)
            }
        });
        // 监听鼠标悬浮事件
        graph.on('cell:mouseleave', (event) => {
            const cell = event.cell
            if (cell.isNode()) {
                showPorts(false)
            }
        });
        //复制
        graph.bindKey('ctrl+c', () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.copy(cells)
            }
            return false
        })
        //粘贴
        graph.bindKey('ctrl+v', () => {
            if (!graph.isClipboardEmpty()) {
                const cells = graph.paste({ offset: 32 })
                graph.cleanSelection()
                graph.select(cells)
            }
            return false
        })
        // 监听框选事件
        graph.on('selection:changed', () => {
            clearCells(graph)
            const selectedCells = graph.getSelectedCells();
            setSelectedCellsNew(selectedCells)
            selectedCells.forEach((cell) => {
                if (cell.isNode()) {
                    // 类似点击后的效果，比如改变边框颜色
                    cell.attr('body/stroke', 'blue');
                    cell.addTools(['button-remove']);
                    // console.log(cell.toJSON())
                }
            });
            // graph.batchUpdate(() => {

            // });

        });
        // 监听画布点击事件
        graph.on('blank:click', () => {

            clearCells(graph)
        });
        // 监听画布点击事件
        graph.on('node:dblclick', () => {
            const selectedCells = graph.getSelectedCells();
            if (selectedCells[0].attrs && selectedCells.length <= 1) {
                const selectLabelValue = selectedCells[0].attrs.text.text
                const selectLabelColor = selectedCells[0].attrs.text.fill
                const selectBgColor = selectedCells[0].attrs.body.fill
                setLabelValue(selectLabelValue as string)
                setLabelColor(selectLabelColor as string)
                setBgColor(selectBgColor as string)

            }
            setIsShowOptionDialog(true)
        });
        // 监听历史操作，修改按钮状态
        graph.on('history:change', () => {
            setHistoryState({ canRedo: graph.canRedo(), canUndo: graph.canUndo(), })
        })
        graph.centerContent()
        setGraphNew(graph)
        getJsonData(graph)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getJsonData = async (graph: Graph) => {
        const res = await getNotebookJsonDataApi({ notebook_id })
        graph?.fromJSON(JSON.parse(res.data.JsonData[0].notebook_data).cells)

    }
    return (
        <div className="x6-box" id={`x6-box`}>
            <div ref={stencilContainer} className="x6-box-stencilContainer"></div>
            <div ref={containerRef} className="x6-box-container" id={`x6-box-container`}></div>
            <FunctionalZone
                historyState={historyState}
                operate={operate}
                notebook_id={notebook_id||''}
            />
            {isShowOptionDialog && <OptionDialog
                handleButtonClick={handleButtonClick}
                labelValue={labelValue}
                labelColor={labelColor}
                bgColor={bgColor}
                setLabelValue={setLabelValue}
                setLabelColor={setLabelColor}
                setBgColor={setBgColor}
                setIsShowOptionDialog={setIsShowOptionDialog}

            >
            </OptionDialog>}
        </div>
    );
};

export default AntvX6;