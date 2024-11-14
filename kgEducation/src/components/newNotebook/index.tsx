import React from "react";
import './index.scss'
import mindmapSVG from '@/assets/mindmap.svg';
import baseSVG from '@/assets/base.svg';

import { useGlobalContext } from "@/context/Global";
const NewNotebook: React.FC = () => {
    const { setRouter, setOpenModel } = useGlobalContext()
    const notebookTypeConfig = [
        {
            key: 'base',
            label: '基础画布',
            url:baseSVG
        },
        {
            key: 'mind_map',
            label: '思维导图',
            url:mindmapSVG

        },
    ]
    return (
        <>
            <div className="newNotebook-container">
                {notebookTypeConfig.map((item) => (
                    <div key={item.key} className="notebookType-item" onClick={() => { setOpenModel(false); setRouter(`/antvX6?notebook_type=${item.key}&notebook_id=-1`) }}>
                        <div className="notebookType-item-img">
                            <img src={item.url} alt="" />
                        </div>
                        <div className="notebookType-item-title">{item.label}</div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default NewNotebook