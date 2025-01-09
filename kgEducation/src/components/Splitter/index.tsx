import React from 'react';
import { Splitter } from 'antd';
import type { SplitterProps } from 'antd';


const SplitterComponent: React.FC<Readonly<SplitterProps & { generateContent: (param: string) => React.ReactNode }>> = ({ style, generateContent,...restProps }) => (
    <Splitter style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',...style }} {...restProps}>
        <Splitter.Panel collapsible defaultSize='70%' min="20%" max='80%'>
            {generateContent('content')}
        </Splitter.Panel>
        <Splitter.Panel collapsible>
            {generateContent('menu')}
        </Splitter.Panel>
    </Splitter>
);


export default SplitterComponent;