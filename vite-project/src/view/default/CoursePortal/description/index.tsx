import React from 'react';
import { Badge, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: '课程编号',
    children: '',
    span: 2,
  },
  {
    key: '2',
    label: '课程时长',
    children: '',
    span: 2,
  },
  {
    key: '3',
    label: '专业大类',
    children: '',
    span: 2,
  },
  {
    key: '4',
    label: '开课时间',
    children: '',
    span: 2,
  },
  {
    key: '5',
    label: '结课时间',
    children: '',
    span: 2,
  },
  {
    key: '6',
    label: '课程状态',
    children: <Badge status="processing" text="开课中" />,
    span: 2,
  }
];

const App: React.FC = () => <Descriptions bordered items={items} />;

export default App;