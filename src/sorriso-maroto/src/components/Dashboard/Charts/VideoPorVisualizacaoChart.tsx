import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TimeData {
  value: number;
  video_count: number;
  avg_views: number;
  sum_views: number;
  avg_comments: number;
  sum_comments: number;
  avg_ratings: number;
  sum_ratings: number;
}

interface FormalityChartProps{
  data: TimeData[];
}

const getTopFive = (data: TimeData[]) => {
  const sortedData = [...data].sort((a, b) => b.video_count - a.video_count);
  return sortedData.slice(0,5);
}

export const VideoPorVisualizacaoChart: React.FC<FormalityChartProps> = ({ data }) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const topFiveMetrics = getTopFive(data)
  const minutes = topFiveMetrics.map(item => (item.value + ' até' + ' ' + (item.value + 29)));
  const views = topFiveMetrics.map(item => item.video_count);

  

  const handlePointClick = (event: any) => {
    setSelectedValue(event.point.y);
  };

  const chartConfig = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Distribuição da Quantidade de Vídeos por Duração',
    },
    xAxis: {
      categories: minutes,
      title: {
        text: 'Minutos',
      },
    },
    yAxis: {
      title: {
        text: 'Quantidade de vídeos',
      },
    },
    plotOptions: {
      series: {
        point: {
          events: {
            click: handlePointClick,
          },
        },
        cursor: 'pointer',
      },
    },
    series: [
      {
        name: 'Quantidade de vídeos',
        data: views,
        colorByPoint: false,
        color: '#58CC94',
        dataLabels: {
          enabled: true,
          format: '{point.y}',
        },
      },
    ],
  };

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '10px', padding: '10px'}}>
      <div className="card-content">
        <div style={{ color: '#58CC94', textAlign: 'right', fontWeight: 'bold' , paddingRight: '10px' }}>
          {selectedValue !== null && `${selectedValue} minutos`}
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartConfig} />
      </div>
    </div>
  );
};

export default VideoPorVisualizacaoChart;
