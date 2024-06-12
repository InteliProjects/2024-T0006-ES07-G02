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

interface ChartProps{
  data: TimeData[];
}

const getTopFive = (data: TimeData[]) => {
  const sortedData = [...data].sort((a, b) => b.video_count - a.video_count);
  return sortedData.slice(0,10);
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const topFiveMetrics = getTopFive(data)
  const minutes = topFiveMetrics.map(item => (item.value + ' até' + ' ' + (item.value + 29)));
  const views = topFiveMetrics.map(item => item.avg_views);

  

  const handlePointClick = (event: any) => {
    setSelectedValue(event.point.y);
  };

  const chartConfig = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Tempo ideal de vídeo',
    },
    xAxis: {
      categories: minutes,
      title: {
        text: 'Minutos',
      },
    },
    yAxis: {
      title: {
        text: 'Visualizações',
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
        name: 'Visualizações',
        color: '#CCCCCC',
        data: views.map((view, index, arr) => {
          const maxView = Math.max(...arr);
          return {
            y: view,
            color: view === maxView ? '#58CC94' : '#CCCCCC',
            dataLabels: {
              enabled: true,
              format: '{point.y}',
            },
          };
        }),
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

export default Chart;
