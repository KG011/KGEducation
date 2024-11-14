import { Graph } from "@antv/x6";
import './index.scss'
interface ZoomProps{
    x6Graph?:Graph
}
const Zoom:React.FC<ZoomProps>=()=>{
    return (
        <>
            <div className="x6-box-footer">
                 <div className="x6-box-footer-item">
                    鼠标
                 </div>
            </div>
        </>
    )
}
export default Zoom