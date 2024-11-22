import { GetProp, message, Upload, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss'
import { useSearchParams } from 'react-router-dom';
import React from 'react';
import { getPersonlApi } from '@/config/apis';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface UserInfo {
    avatar: string
}
const Personal = () => {
    const [searchParams] = useSearchParams();
    const user_name = searchParams.get('user_name');
    const [loading, setLoading] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState<UserInfo>();

    const getBase64 = (img: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    // 验证逻辑的beforeUpload函数.
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        if (!file.name) { // 新增验证，检查文件名是否存在
            message.error('请选择有效的文件！');
            return false;
        }
        return isJpgOrPng && isLt2M;
    };

    //额外参数
    const beforeDataQuery = () => {
        return { user_id: Number(localStorage.getItem('id')) };
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as File, (url) => {
                setLoading(false);
                setUserInfo({ ...userInfo, avatar: url });
                message.success('更新头像成功')
            });
        }
    };
    const initData = async () => {
        const { data } = await getPersonlApi({ user_id: Number(localStorage.getItem('id')) })
        console.log(data.personalInfo[0].avatar);
        setUserInfo({
            ...data.personalInfo[0],
            avatar: 'http://localhost:3000/uploads/'+data.personalInfo[0].avatar
        });
    }
    React.useEffect(() => {
        initData()
    }, [])

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <div className="container personal-container">
            <div className="personal-header">
                <Upload
                    name="avata"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="http://127.0.0.1:3000/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    data={beforeDataQuery}
                >
                    {userInfo?.avatar ? <img src={userInfo.avatar} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
                </Upload>
                <div className="personal-header-name">{user_name}</div>
            </div>

        </div>
    )
}
export default Personal