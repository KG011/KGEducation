import React from 'react';
import { Avatar, List } from 'antd';
import './index.scss'
import courseImage from '@/assets/course1.png'
const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

const Exam: React.FC = () => {
    return (
        <div className="container">
            <ul className='exam-list'>
                {data.map(() => {
                    return (
                        <li className='exam-list-item'>
                            <div className="exam-list-item-meta">
                                <div className="exam-list-item-meta-avater">
                                    <img src={courseImage} alt="" />
                                </div>
                                <div className="exam-list-item-meta-content">
                                    <div className="exam-list-item-meta-content-title">考试：《计算机网络》周测</div>
                                    <div className="exam-list-item-meta-content-user">发布人：黄老师</div>
                                </div>
                            </div>

                        </li>
                    )
                })}
            </ul>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Exam;