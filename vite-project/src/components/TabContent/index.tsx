import React, { ReactNode } from "react"
import './index.scss'
interface TabContentProps {
    children?: ReactNode
    stepNum?:string
    stepLabel?:string
}
const TabContent: React.FC<TabContentProps> = ({ children,stepNum ,stepLabel}) => {
    return (
        <>
            <div className="container-tab">
                <div className="container-tab-step"><span className="container-tab-step-number">{stepNum}</span></div>{stepLabel}
            </div>
            {children}
        </>
    )
}
export default TabContent