/* eslint-disable @typescript-eslint/no-explicit-any */
import EchartsComponent from "@/components/echarts";
import { getExamGradeApi } from "@/config/apis/modules/course";
import * as echarts from "echarts";
import './index.scss'
import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const GradeDetail = () => {

  const [searchParams] = useSearchParams();
  const exam_id = searchParams.get('exam_id');
  const [studentList, setStudentList] = useState(['李魁', '张三', '李四', '黄超', '火鸡面', '2017', '2018', '2019'])
  const [gradeList, setGradeList] = useState([400, 400, 300, 300, 300, 400, 400, 400, 300])
  const [totalGrade,setTotalGrade]=useState(0)
  const defaultOptionRanking = {
    backgroundColor: '#080b30',
    title: {
      text: '成绩排名展示',
      textStyle: {
        align: 'center',
        color: '#fff',
        fontSize: 20,
      },
      top: '5%',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true
    },
    legend: {
      data: ['成绩'],
      right: 10,
      top: 12,
      textStyle: {
        color: "#fff"
      },
      itemWidth: 12,
      itemHeight: 10,
      // itemGap: 35
    },
    xAxis: {
      type: 'category',
      data: studentList,
      axisLine: {
        lineStyle: {
          color: 'white'

        }
      },
      axisLabel: {
        // interval: 0,
        // rotate: 40,
        textStyle: {
          fontFamily: 'Microsoft YaHei'
        }
      },
    },

    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)'
        }
      },
      axisLabel: {}
    },
    "dataZoom": [{
      "show": true,
      "height": 12,
      "xAxisIndex": [
        0
      ],
      bottom: '8%',
      "start": 10,
      "end": 90,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#d3dee5",

      },
      textStyle: {
        color: "#fff"
      },
      borderColor: "#90979c"
    }, {
      "type": "inside",
      "show": true,
      "height": 15,
      "start": 1,
      "end": 35
    }],
    series: [
      {
        name: '成绩',
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#fccb05'
            }, {
              offset: 1,
              color: '#f5804d'
            }]),
          },
        },
        data: gradeList
      },
    ]
  };
  const randNum = function (minnum: number, maxnum: number) {
    return Math.floor(minnum + Math.random() * (maxnum - minnum));
  };

  const categoryNames = ["初级", "残疾", "精神病", "患病"]; // 类别名称列表，可以根据实际情况动态修改或扩展

  const generateRandomData = (categoryNames: any[]) => {
    const datas: { name: any; value: number; }[] = [];
    categoryNames.forEach((name: any) => {
      const value = randNum(10, 100);
      datas.push({ name, value });
    });
    return datas;
  };
  function generateArrayByTotal(total: number): { start: number; end: number }[] {
    const partSize = Math.floor(total / 4);
    const result: { start: number; end: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const start = i * partSize + 1;
      const end = (i === 3) ? total : (i + 1) * partSize;
      result.push({ start, end });
    }
    return result;
  }

  function countInIntervals(a: number[], total: number): { name: string; value: number }[] {
    const intervals = generateArrayByTotal(total);
    const result: { name: string; value: number }[] = [];
    intervals.forEach((interval) => {
      result.push({ name: `${interval.start}-${interval.end}`, value: 0 });
    });
    a.forEach((num) => {
      intervals.forEach((interval) => {
        if (num >= interval.start && num <= interval.end) {
          const index = result.findIndex((item) => item.name === `${interval.start}-${interval.end}`);
          result[index].value++;
        }
      });
    });
    return result;
  }


  const datas = generateRandomData(categoryNames);

  const defaultOptionPie = {
    backgroundColor: "#041139",
    tooltip: {
      trigger: 'item',
      formatter: function (param: { seriesName: string; marker: any; data: { name: any; value: string; }; percent: string; }) {
        if (param.seriesName && param.seriesName == "number") {
          return param.marker + param.data.name + "<br/>" + param.data.value + "人 (" + param.percent + "%)"
        }
      }
    },
    title: {
      text: '成绩排名占比',
      textStyle: {
        align: 'center',
        color: '#fff',
        fontSize: 20,
      },
      top: '5%',
      left: 'center',
    },
    legend: {
      orient: 'vertical',
      y: 'center',
      right: 20,
      itemWidth: 12,
      textStyle: {
        color: "#fff",
        fontSize: 14
      },
      formatter: function (param: any) {
        const item = datas.find((item) => item.name === param);
        return item ? `${item.name} ${item.value}人` : '';
      }
    },
    color: ['#FFAA45', '#8F45FF', '#00AF6D', '#FF45E3', '#FF4545', '#80A4C7'],
    series: [
      {
        name: "number",
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['40%', '50%'],
        label: {
          show: true,
          formatter: "{d}%",
          position: 'inside',
          color: "#fff",
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        data: datas
      },
      {
        type: 'pie',
        radius: '25%',
        center: ['40%', '50%'],
        itemStyle: {
          color: function (param: { dataIndex: number; }) {
            if (param.dataIndex === 0) {
              return '#1E4672'
            } else {
              return '#12305E'
            }
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: datas
      },
      {
        type: 'pie',
        radius: ['60%', '60%'],
        center: ['40%', '50%'],
        itemStyle: {
          borderColor: "#1574AC",
          borderWidth: 1,
          borderType: "dashed"
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: datas
      }
    ]
  };
  const [optionRanking, setOptionRanking] = useState(defaultOptionRanking)
  const [optionPie, setOptionPie] = useState(defaultOptionPie)

  const initData = async () => {
    const dataQuery = {
      exam_id
    }
    const { data } = await getExamGradeApi(dataQuery)
    setStudentList(JSON.parse(data.exam_grade[0].student_list))
    setGradeList(JSON.parse(data.exam_grade[0].grade_list))
    setTotalGrade(data.exam_grade[0].totalGrade)
  }
  React.useEffect(() => {
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam_id])
  React.useEffect(() => {

    const updatedOptionRanking = {
      ...optionRanking,
      series: [
        {
          ...optionRanking.series[0],
          data: gradeList
        }
      ],
      xAxis: {
        ...optionRanking.xAxis,
        data: studentList
      },
      yAxis: {
        ...optionRanking.yAxis,
        max: totalGrade
      }
    };
    const updataOptionPie = {
      ...optionPie,
      legend: {
        orient: 'vertical',
        y: 'center',
        right: 20,
        itemWidth: 12,
        textStyle: {
          color: "#fff",
          fontSize: 14
        },
        formatter: function (param: any) {
          const item = countInIntervals(gradeList, totalGrade).find((item) => item.name === param);
          return item ? `${item.name} : ${item.value}人` : '';
        }
      },
      series: [
        {
          ...optionPie.series[0],
          data: countInIntervals(gradeList, totalGrade)
        },
        {
          ...optionPie.series[1],
          data: countInIntervals(gradeList, totalGrade)

        },
        {
          ...optionPie.series[2],
          data: countInIntervals(gradeList, totalGrade)

        },
        {
          ...optionPie.series[3],
          data: countInIntervals(gradeList, totalGrade)

        }
      ]

    }
    setOptionRanking(updatedOptionRanking);
    setOptionPie(updataOptionPie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentList, gradeList]);
  return (
    <div className="container">
      <div className="grade-detail">
        <div style={{ width: '45%', height: 'calc(100% - 56px)' }}>
          <EchartsComponent options={optionRanking}></EchartsComponent>
        </div>
        <div style={{ width: '45%', height: 'calc(100% - 56px)' }}>
          <EchartsComponent options={optionPie}></EchartsComponent>
        </div>
      </div>

    </div>
  )
}
export default GradeDetail