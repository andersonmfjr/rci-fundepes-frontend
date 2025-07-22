import React from "react";
import ReactECharts from "echarts-for-react";
import { BiDonutChartData } from "@/types";

interface BiDonutChartProps {
  data: BiDonutChartData;
}

const BiDonutChart: React.FC<BiDonutChartProps> = ({ data }) => {
  const chartData = [
    {
      name: data.realizado.name,
      value: data.realizado.value,
      itemStyle: { color: data.realizado.color },
    },
    {
      name: data.disponivel.name,
      value: data.disponivel.value,
      itemStyle: { color: data.disponivel.color },
    },
    {
      name: data.suspenso.name,
      value: data.suspenso.value,
      itemStyle: { color: data.suspenso.color },
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    title: {
      text: "Valor por situação (R$)",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: unknown) {
        const param = params as { name: string; value: number };
        const percentage = ((param.value / total) * 100).toFixed(0);
        return `${param.name}: R$ ${param.value.toLocaleString(
          "pt-BR"
        )} (${percentage}%)`;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: chartData.map((item) => item.name),
    },
    series: [
      {
        name: "Situação",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
};

export default BiDonutChart;
