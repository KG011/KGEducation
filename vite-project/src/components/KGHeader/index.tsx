import React from "react";
import './index.scss'
interface KGHeader{
    middleTitle?:string
    rightConfig?:() => JSX.Element
}
const KGHeader:React.FC<KGHeader>=(props)=>{
    return (
        <div className="kg-header">
            <span></span>
            <span>{props.middleTitle||''}</span>
            <span>{props?.rightConfig?.()||''}</span>
        </div>
    )
}
export default KGHeader