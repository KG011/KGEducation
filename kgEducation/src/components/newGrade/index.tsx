import React from "react";
import './index.scss'
import pieSVG from '@/assets/pie.svg';
import rankingSVG from '@/assets/ranking.svg';
// import { useGlobalContext } from "@/context/Global";
const NewGrade: React.FC = () => {
    // const { setRouter, setOpenModel } = useGlobalContext()
    const notebookTypeConfig = [
        {
            key: 'base',
            label: '柱状图',
            url: rankingSVG
        },
        {
            key: 'mind_map',
            label: '饼图',
            url: pieSVG

        },
    ]

    // const gradeChart = (item:any) => {
    //     setOpenModel(false);
    //     setRouter(`/antvX6?notebook_type=${item.key}&notebook_id=-1`)
    // }
    return (
        <>
            <div className="newNotebook-container">
                {notebookTypeConfig.map((item) => (
                    <div key={item.key} className="notebookType-item">
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
export default NewGrade