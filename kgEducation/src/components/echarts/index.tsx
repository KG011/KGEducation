/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";

interface EchartsComponentProps {
    options: any;
}

const EchartsComponent: React.FC<EchartsComponentProps> = (props) => {
    const echartDom = useRef<HTMLDivElement>(null);
    const [chartInstance, setChartInstance] = useState<any>(null);

    // 初始化图表的函数，抽离出来方便复用
    const initEchart = (options: any) => {
        if (echartDom.current) {
            // 销毁之前的Echarts实例（如果存在）
            echarts.dispose(echartDom.current);
            const chart = echarts.init(echartDom.current);
            chart.setOption(options);
            setChartInstance(chart);
        }
    };

    useEffect(() => {
        initEchart(props.options);
    }, [props.options]);

    // 监听窗口大小变化，用于调整图表大小
    useEffect(() => {
        const chart = chartInstance;
        if (chart) {
            const resizeHandler = () => {
                chart.resize();
            };
            window.addEventListener("resize", resizeHandler);
            return () => {
                window.removeEventListener("resize", resizeHandler);
            };
        }
    }, [chartInstance]);

    useEffect(() => {
        return () => {
            if (chartInstance) {
                echarts.dispose(chartInstance);
            }
        };
    }, [chartInstance]);

    return (
        <div ref={echartDom} style={{ width: '100%', height: '100%' }}></div>
    );
};

export default EchartsComponent;