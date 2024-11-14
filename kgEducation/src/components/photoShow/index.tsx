import React from "react";
import './index.scss'
import { Button } from "antd";
import { useGlobalContext } from "@/context/Global";
interface PhotoShowProps{
    imgSrc:string
}
const PhotoShow: React.FC<PhotoShowProps> = ({imgSrc}) => {
    const { isPhotoShow,setIsPhotoShow } = useGlobalContext()
    const cancel=()=>{
        setIsPhotoShow(false)
    }
    return (
        isPhotoShow && <div className="ViewImage">
            <div className="backBut">
                <Button onClick={()=>cancel()}>X</Button>
            </div>
            <div className="img">
                <img src={imgSrc} />
            </div>
        </div>
    )
}
export default PhotoShow