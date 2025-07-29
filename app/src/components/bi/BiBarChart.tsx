import React from "react";
import ReactECharts from "echarts-for-react";
import { BiBarChartData } from "@/types";

interface BiBarChartProps {
  data: BiBarChartData;
}

const BiBarChart: React.FC<BiBarChartProps> = ({ data }) => {
  const option = {
    title: {
      text: "Valor por Unidade Acadêmica (R$)",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: unknown) {
        const param = params as Array<{ name: string; value: number }>;
        const value = param[0].value;
        return `${param[0].name}: R$ ${value.toLocaleString("pt-BR")}`;
      },
    },
    legend: {
      data: [data.unidade_academica.name, data.reitoria.name],
      bottom: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      max: 30000,
      axisLabel: {
        formatter: function (value: number) {
          return `R$ ${(value / 1000).toFixed(0)}k`;
        },
      },
    },
    yAxis: {
      type: "category",
      data: ["Total"],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: data.unidade_academica.name,
        type: "bar",
        stack: "total",
        data: [data.unidade_academica.value],
        itemStyle: {
          color: data.unidade_academica.color,
        },
      },
      {
        name: data.reitoria.name,
        type: "bar",
        stack: "total",
        data: [data.reitoria.value],
        itemStyle: {
          color: data.reitoria.color,
        },
      },
    ],
  };

  return (
    <div className="w-full h-80">
      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
};

export default BiBarChart;
