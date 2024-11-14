/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Graph } from "@antv/x6";
import { Transform } from '@antv/x6-plugin-transform';
import { CUSTOM_SHAPE } from "./config";
// interface MindMapData {
//     id: string
//     type: 'topic' | 'topic-branch' | 'topic-child'
//     label: string
//     width: number
//     height: number
//     children?: MindMapData[]
// }
interface InitX6 {
    x6Graph: Graph
    showPorts?: { (show: boolean): void; (arg0: boolean): void; }
    showAdds?: { (show: boolean): void; (arg0: boolean): void; }
    clearCells?: { (x6graph: { getCells: () => any; }): void; (arg0: Graph): void; }
    setSelectedCellsNew?: (cell: Cell[]) => void
    setLabelValue?: (str: string) => void,
    setLabelColor?: (str: string) => void,
    setBgColor?: (str: string) => void,
    setIsShowOptionDialog?: (bol: boolean) => void,
    setHistoryState?: (obj: any) => void
    x6DataRef?:any
}
//基础类型画布
const initBaseX6 = (props: InitX6) => {
    const {
        x6Graph, showPorts, clearCells, setSelectedCellsNew, setLabelValue, setLabelColor,
        setBgColor, setIsShowOptionDialog, setHistoryState
    } = props
    // 添加变换插件
    x6Graph.use(new Transform({ resizing: true }));
    // 监听鼠标悬浮事件
    x6Graph.on('cell:mouseenter', (event) => {
        const cell = event.cell
        if (cell.isNode()) {
            showPorts?.(true)
        }
    });
    // 监听鼠标悬浮事件
    x6Graph.on('cell:mouseleave', (event) => {
        const cell = event.cell
        if (cell.isNode()) {
            showPorts?.(false)
        }
    });
    //复制
    x6Graph.bindKey('ctrl+c', () => {
        const cells = x6Graph.getSelectedCells()
        if (cells.length) {
            x6Graph.copy(cells)
        }
        return false
    })
    //粘贴
    x6Graph.bindKey('ctrl+v', () => {
        if (!x6Graph.isClipboardEmpty()) {
            const cells = x6Graph.paste({ offset: 32 })
            x6Graph.cleanSelection()
            x6Graph.select(cells)
        }
        return false
    })
    // 监听框选事件
    x6Graph.on('selection:changed', () => {
        clearCells?.(x6Graph)
        const selectedCells = x6Graph.getSelectedCells();
        setSelectedCellsNew?.(selectedCells)
        selectedCells.forEach((cell) => {
            if (cell.isNode()) {
                // 类似点击后的效果，比如改变边框颜色
                cell.attr('body/stroke', 'blue');
                cell.addTools(['button-remove']);
            }
        });
    });
    // 监听画布点击事件
    x6Graph.on('blank:click', () => {
        clearCells?.(x6Graph)
    });
    // 监听画布点击事件
    x6Graph.on('node:dblclick', () => {
        const selectedCells = x6Graph.getSelectedCells();
        if (selectedCells[0].attrs && selectedCells.length <= 1) {
            const selectLabelValue = selectedCells[0].attrs.text.text
            const selectLabelColor = selectedCells[0].attrs.text.fill
            const selectBgColor = selectedCells[0].attrs.body.fill
            setLabelValue?.(selectLabelValue as string)
            setLabelColor?.(selectLabelColor as string)
            setBgColor?.(selectBgColor as string)
        }
        setIsShowOptionDialog?.(true)
    });
    // 监听历史操作，修改按钮状态
    x6Graph.on('history:change', () => {
        setHistoryState?.({ canRedo: x6Graph.canRedo(), canUndo: x6Graph.canUndo(), })
    })
    x6Graph.centerContent()
}
//思维导图类型画布
const initMindMapX6 = (props: InitX6) => {
    const {
        x6Graph, showAdds,setHistoryState
    } = props
    x6Graph.addNode({
        shape: CUSTOM_SHAPE,
        x: 280,
        y: 200,
        data:{
            label:'默认主题'
        }
    })
    // 监听鼠标悬浮事件
    x6Graph.on('cell:mouseenter', (event: { cell: any; }) => {
        const cell = event.cell
        if (cell.isNode()) {
            showAdds?.(true)
        }
    });
    // 监听鼠标悬浮事件
    x6Graph.on('cell:mouseleave', (event: { cell: any; }) => {
        const cell = event.cell
        if (cell.isNode()) {
            showAdds?.(false)
        }
    });
    // 监听历史操作，修改按钮状态
    x6Graph.on('history:change', () => {
        setHistoryState?.({ canRedo: x6Graph.canRedo(), canUndo: x6Graph.canUndo(), })
    })
    x6Graph.centerContent()

}
export { initBaseX6, initMindMapX6 }

