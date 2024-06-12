import ReactApexChart from 'react-apexcharts';
import React from 'react';

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

interface ApexChartProps{
  data: {
    metaphor: TimeData[];   
    formality: TimeData[];
    example: TimeData[];
    interaction: TimeData[],
  };
}

export const  series: number[] = [];

export const ApexChart: React.FC<ApexChartProps> = ({ data }) => {
  const getMaxValue = (metrics: TimeData[]) => {
    return metrics.reduce((acc, curr) => {
        return (curr.video_count > acc.video_count) ? curr : acc;
    }, { value: 0, video_count: 0 } as TimeData).value;
  };
  
  const maxValueMetaphor = getMaxValue(data.metaphor)* 10;
  const maxValueFormality = getMaxValue(data.formality) * 10;
  const maxValueExample = getMaxValue(data.example)*10;
  const maxValueInteraction = getMaxValue(data.interaction)*10;
  

  const options = {
    chart: {
      height: 380,
      type: 'radialBar',
      offsetY: 15
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            formatter: function(val: number) {
              return `${val}%`; 
            }
          }
        }
      }
    },
    colors: ['#4E97D1', '#9ABE36', '#E07A5F', '#C59FC9'],
    labels: ['Exemplos', 'Interação', 'Formalidade', 'Metáforas'],
    legend: {
      show: true,
      floating: true,
      fontSize: '16px',
      position: 'left', 
      offsetX: 300,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0
      },
      formatter: function(seriesName: unknown, opts: any) {
        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}%`;
      },
      itemMargin: {
        vertical: 3
      }
    },
    responsive: [{
      breakpoint: 780,
      options: {
        legend: {
            show: false
        }
      }
    }],
  };

  series[0] = maxValueExample,
  series[1] = maxValueInteraction,
  series[2] = maxValueFormality; 
  series[3] = maxValueMetaphor;

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '10px', padding: '10px'}}>
      <div className="card-content">
        <div style={{ color: '#58CC94', textAlign: 'right', fontWeight: 'bold' , paddingRight: '10px' }}>
          <ReactApexChart options={options} series={series} type="radialBar" height={390} />
        </div>
      </div>
    </div>
  );
};

