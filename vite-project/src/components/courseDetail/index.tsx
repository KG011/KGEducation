import React, { useState } from "react";
import './index.scss';
import { Button, message } from "antd";
import { editCourseMenuApi } from '@/config/apis/modules/course';

interface CourseDetailProps {
    [name:string]: string;
}

const CourseDetail: React.FC<CourseDetailProps> = (props) => {
    const { label,courseName } = props
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [inputKey, setInputKey] = useState(0);
    //目录对应图片集合
    const [menuListDetail, setMenuListDetail] = useState({})
    //处理照片
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                    setSelectedImage(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    //删除照片状态
    const handleDeleteImage = () => {
        setSelectedImage(null);
        setInputKey((prevKey) => prevKey + 1);
    };
    //保存照片
    const saveImage = async () => {
        const menu_detail={ ...menuListDetail, [props.label]: selectedImage }
        await editCourseMenuApi({ course_name: courseName,menu_detail})
        message.success('成功提交修改');
        setMenuListDetail({ ...menuListDetail, [props.label]: selectedImage })
    }
    React.useEffect(() => {
        handleDeleteImage()

    }, [label])

    return (
        <div className="course-detail">
            <div className="course-detail-container">
                {label}
                <div className="image-upload-section">
                    <input type="file" onChange={handleImageChange} key={inputKey} />
                    {selectedImage && (
                        <>
                            <Button type="primary" onClick={saveImage}>保存图片</Button>
                            <Button type="primary" danger onClick={handleDeleteImage}>删除图片</Button>
                        </>
                    )}
                </div>
                {selectedImage && <img src={selectedImage} alt="Selected" className="selected-image" />}
            </div>
        </div>
    );
};

export default CourseDetail;