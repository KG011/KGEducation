/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Graph } from '@antv/x6';
import type { Cell } from '@antv/x6';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';
import OptionDialog from './optionDialog';
import FunctionalZone from './functionalZone';
import { addNotebookApi, deleteNotebookApi, getNotebookJsonDataApi } from '@/config/apis/modules/course';
import { useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '@/context/Global';
import useAntvX6 from './useGraph';
import { Stencil } from '@antv/x6-plugin-stencil';
import { initBaseX6, initMindMapX6 } from './initGraph';
import { getUserIDFromLocalStorage } from '@/utils/storage';
import { message } from 'antd';
import Zoom from './zoom';
const AntvX6 = () => {
    const { setRouter } = useGlobalContext()
    const [searchParams] = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();

    //画布ID
    const notebook_id = searchParams.get('notebook_id');
    //画布类型
    const notebook_type = searchParams.get('notebook_type');
    //画布渲染盒子
    const containerRef = useRef<HTMLDivElement>(null);
    //物料区
    const stencilContainer = useRef<HTMLDivElement>(null);
    const [selectedCellsNew, setSelectedCellsNew] = useState<Cell[]>([]);
    const [labelValue, setLabelValue] = useState('Hello')
    const [labelColor, setLabelColor] = useState('#000')
    const [bgColor, setBgColor] = useState('#fff')
    const [stencilStyle, setStencilStyle] = useState({})
    const [historyState, setHistoryState] = useState({ canRedo: false, canUndo: false })
    const [connectorType, setConnectorType] = useState('rounded')
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
    /**
     * 存储一些公用的数据
     */
    const x6DataRef = useRef<any>({
        nodeFormDataMap: {},
        nodeOperateMap: {},
    });
    /** 控制基础画布连接点显示/隐藏 */
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
    /** 控制思维导图连接点显示/隐藏 */
    const showAdds = useCallback(
        (show: boolean) => {
            const container = containerRef.current;
            const ports = container?.querySelectorAll('.mind-map-node .img') as NodeListOf<HTMLImageElement>;
            for (let i = 0, len = ports.length; i < len; i += 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden';
            }
        },
        []
    );
    /** 清除选择状态 */
    const clearCells = useCallback(
        (x6graph: { getCells: () => any; }) => {
            // setIsShowOptionDialog(false)
            const cells = x6graph.getCells();
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
                // console.log(cell.toJSON);
                cell.attr('text/text', labelValue);
                cell.attr('text/fill', labelColor);
                cell.attr('body/fill', bgColor);
            }
        });
    };
    //画布保存
    const saveX6Data = async (imgUrl: string) => {
        const data = {
            JsonData: x6Graph?.toJSON(),
            userId: getUserIDFromLocalStorage(),
            notebook_id: notebook_id,
            imgUrl,
            notebook_type
        }
        const res = await addNotebookApi(data)
        if (res.status == 200) {
            messageApi.open({
                type: 'success',
                content: '保存成功',
            });
        }
    }
    // 撤销恢复等操作合集
    const operate = (type: string) => {
        if (!x6Graph) return;
        switch (type) {
            // 撤销
            case 'canUndo':
                x6Graph.canUndo() && x6Graph.undo();
                break;
            // 恢复
            case 'canRedo':
                x6Graph.canRedo() && x6Graph.redo();
                break;
            // 恢复
            case 'delete':
                deleteGraph()
                break;
            // 保存
            case 'saveToJSON':
                x6Graph.toPNG(saveX6Data)
                break
            // 导出为PDF
            case 'exportPDF':
                x6Graph?.exportPNG(`PDF-${new Date().toISOString().slice(0, 10)}`)
                break
        }
    };
    //删除画布
    const deleteGraph = async () => {
        await deleteNotebookApi({ notebook_id })
        setRouter(-1)
    }
    //初始渲染获取JSONData数据并渲染
    const getJsonData = async (x6graph: Graph) => {
        if (!notebook_id || notebook_id == '-1') return
        const res = await getNotebookJsonDataApi({ notebook_id })
        x6graph?.fromJSON(JSON.parse(res.data.JsonData[0].notebook_data).cells)

    }
    //创建物料区
    const createStencil = (x6Graph: Graph) => {
        const stencil = new Stencil({
            title: 'Stencil',
            target: x6Graph,
            search(cell, keyword) {
                return cell.shape.indexOf(keyword) !== -1;
            },
            placeholder: '搜索物料shape名字',
            notFoundText: '没找到',
            collapsable: true,
            stencilGraphHeight: 0,
            groups: [
                {
                    name: 'group1',
                    title: '物料区1',
                },
                {
                    name: 'group2',
                    title: '物料区2',
                    collapsable: false,
                },
            ],
        });
        stencilContainer.current?.appendChild(stencil.container);
        const n1 = x6Graph.createNode({
            shape: 'rect',
            x: 40,
            y: 40,
            width: 80,
            height: 40,
            label: '元素',
            attrs: commonAttrs,
            data: {
                label: '元素',
                labelColor: '#000',
                bgColor: '#FFFFFF',
                borderColor: '#8F979D'
            }

        });
        const n2 = x6Graph.createNode({
            shape: 'circle',
            x: 180,
            y: 40,
            width: 40,
            height: 40,
            label: '圆',
            attrs: commonAttrs,
            data: {
                label: '圆',
                labelColor: '#000',
                bgColor: '#FFFFFF',
                borderColor: '#8F979D'
            }
        });
        const n3 = x6Graph.createNode({
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
        const n4 = x6Graph.createNode({
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
            label: '爱心',
            data: {
                label: '爱心',
                labelColor: '#000',
                bgColor: 'red',
                borderColor: '#8F979D'
            }


        });
        const n5 = x6Graph.createNode({
            shape: 'ellipse',
            x: 280,
            y: 40,
            width: 80,
            height: 40,
            attrs: commonAttrs,
            label: '椭圆',
            data: {
                label: '椭圆',
                labelColor: '#000',
                bgColor: '#FFFFFF',
                borderColor: '#8F979D'
            }


        });
        stencil.load([n1, n2, n5], 'group1');
        stencil.load([n3, n4], 'group2');
    }
    //初始化X6
    const { x6Graph } = useAntvX6({ container: containerRef, connectorType, x6Data: x6DataRef.current })
    // x6Graph && getGraph?.(x6Graph);
    useEffect(() => {
        if (x6Graph) {
            //监听类型显示不同的画布
            switch (notebook_type) {
                case 'base':
                    createStencil(x6Graph)
                    initBaseX6({
                        x6Graph, showPorts, clearCells, setSelectedCellsNew, setLabelValue,
                        setLabelColor, setBgColor, setHistoryState
                    })
                    break;
                case 'mind_map':
                    setStencilStyle({ display: 'none' })
                    setConnectorType('rounded')
                    initMindMapX6({
                        x6Graph, showAdds, clearCells, setSelectedCellsNew, setLabelValue,
                        setLabelColor, setBgColor, setHistoryState, x6DataRef: x6DataRef.current
                    })
                    break;
                default:
                    break;
            }
            getJsonData(x6Graph)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [x6Graph, notebook_type])
    return (
        <>
            {contextHolder}
            <div className="x6-box" id={`x6-box`}>
                {<div ref={stencilContainer} className="x6-box-stencilContainer" style={stencilStyle}></div>}
                <div ref={containerRef} className="x6-box-container" id={`x6-box-container`}></div>
                <FunctionalZone
                    historyState={historyState}
                    operate={operate}
                    notebook_id={notebook_id || '-1'}
                />
                <Zoom x6Graph={x6Graph}></Zoom>
                <OptionDialog
                    handleButtonClick={handleButtonClick}
                    x6Data={x6DataRef.current}
                    x6Graph={x6Graph}
                    notebook_type={notebook_type}

                >
                </OptionDialog>
            </div></>

    );
};

export default AntvX6;