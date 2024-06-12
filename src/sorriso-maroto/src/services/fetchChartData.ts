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

interface CommunicationMetricsData {
  metaphor: TimeData[];
  formality: TimeData[];
}

interface TopicsMetrics{
  value: string,
  video_count: number,
  avg_views: number,
  sum_views: number,
  avg_comments: number,
  sum_comments: number,
  avg_ratings: number,
  sum_ratings: number
}

interface AnalyticsData {
  time: TimeData[];
  communication_metrics: CommunicationMetricsData;
  topics_metrics: TopicsMetrics;
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
      const response = await fetch('http://18.204.75.236/v1/analytics/last');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data: AnalyticsData = await response.json();
      console.log(data);
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
}
