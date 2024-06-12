import { Title } from "../../components/Title";
import { Chart } from "../../components/Dashboard/Charts";
import VideoPorVisualizacaoChart from "../../components/Dashboard/Charts/VideoPorVisualizacaoChart";
import { OtherInfo } from "../../components/Dashboard/Info";
import { Footer } from "../../components/Footer";
import { ApexChart } from "../../components/Dashboard/Metrics";
import { useState, useEffect } from "react";
import BackendService from "../../services/backendService";
import { fetchAnalyticsData } from "../../services/fetchChartData";
import WatsonChat from "../../components/chatbot";
import TopicsTable from "../../components/Dashboard/Table";
import mockdata2 from "../../mockdata2";
import TopicsTable2 from "../../components/Dashboard/Table/melhoresTopicosPlatafora";
import MetaphorChart from "../../components/Dashboard/Charts/MetaforasChart";
import ExampleChart from "../../components/Dashboard/Charts/ExampleChart";
import FormalityChart from "../../components/Dashboard/Charts/FormalityChart";
import InterationChart from "../../components/Dashboard/Charts/interation";
import { series } from "../../components/Dashboard/Metrics";

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
  example: TimeData[];
  interaction: TimeData[];
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

export const DashBoard = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [otherInfoResult, setOtherInfoResult] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [padroesSucesso, setPadroesSucesso] = useState<number[]>([]);
  console.log(series)

  useEffect(() => {
    const fetchData = async () => {
      const mockdata = mockdata2
      // const data = await fetchAnalyticsData();
      setAnalyticsData(mockdata);
      setPadroesSucesso(series);
    };
    fetchData();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        console.log('Stoping record');
        const audioBlob = new Blob(audioChunks);
        setOtherInfoResult(await uploadAudio(audioBlob));
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  }

  const stopRecording = () => {
    mediaRecorder?.stop();
    setMediaRecorder(null);
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const result = await BackendService.getSearchInfoByAudio(audioBlob) as any;
    return result;
  };

  function handleMicrophoneClick(){
    if(mediaRecorder) {
      stopRecording();
    } else {
      startRecording();
    }
  }


  return (
    <div className="flex flex-col w-full h-screen justify-between">
      <div style={{ fontSize: '24px' }}>
        <Title title={"Dashboard de Análise de Conteúdo"} />
      </div>
      <OtherInfo
            isAudioActive={!!mediaRecorder}
            onAudioSearchClick={handleMicrophoneClick}
            searchResult={otherInfoResult}
            />

<div className="grid lg:flex-row grid-flow-row-dense flex-col justify-start h-full p-4 bg-gray-100 shadow-lg rounded-lg m-4 transition-all duration-300 hover:bg-gray-200">
  <p className="text-xl font-semibold text-gray-700">
    Com base nas análises realizadas em seus vídeos, identificamos as métricas ideais a serem utilizadas:
  </p>
  <br></br>
  <ul className="list-disc list-inside space-y-2">
    <li className="text-gray-600">
      <span className="font-semibold text-gray-800">
        {padroesSucesso[0]}
      </span>
      %{} de exemplos para ilustrar conceitos e tornar o conteúdo mais tangível;
    </li>
    <li className="text-gray-600">
      <span className="font-semibold text-gray-800">
        {padroesSucesso[1]} 
      </span>
      %{} de interações para fomentar o engajamento e promover a participação da audiência;
    </li>
    <li className="text-gray-600">
      <span className="font-semibold text-gray-800">
        {padroesSucesso[2]}
      </span>
      %{} de formalidade para transmitir credibilidade e profissionalismo;
    </li>
    <li className="text-gray-600">
      <span className="font-semibold text-gray-800">
        {padroesSucesso[3]}
      </span>
      %{} de uso de metáforas para enriquecer a comunicação e facilitar a compreensão de conceitos complexos.
    </li>
  </ul>
</div>

      <div style={{ fontSize: '24px', textAlign: 'center'}}>
        <Title title={"Padrões de sucesso X Padrões da plataforma"} />
      </div>
      
      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-1 grid-row-2 flex-col justify-around h-full gap-2 m-2">

        <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
          {analyticsData?.time && <Chart data={analyticsData.time}/>}
        </div>
        
        <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
            {analyticsData?.time && <VideoPorVisualizacaoChart data={analyticsData.time}/>}
        </div>

      </div>

      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-2 grid-row-2 flex-col justify-around h-full gap-2 m-2">
        <div style={{ fontSize: '24px', textAlign: 'center'}}>
          <Title title={"Quantidade de vídeos por tópicos"} />
        </div>

        <div style={{ fontSize: '24px', textAlign: 'center'}}>
          <Title title={"Tópicos mais assistidos"} />

        </div>
      </div>

      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-2 grid-row-2 flex-col justify-around h-full gap-2 m-2">

        <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">

          {analyticsData?.topics_metrics && <TopicsTable topics={analyticsData.topics_metrics}/>}
        </div>  

        <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
          {analyticsData?.topics_metrics && <TopicsTable2 topics={analyticsData.topics_metrics}/>}
        </div>  


      </div>

      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-1 grid-row-2 flex-col justify-around h-full gap-2 m-2">
        <div style={{ fontSize: '24px', textAlign: 'center'}}>
          <Title title={'Melhores níveis de Métricas de Comunicação'} />

        </div>
      </div>

      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-1 grid-row-2 flex-col justify-around h-full gap-2 m-2">
      <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
        {analyticsData?.topics_metrics && <ApexChart data={analyticsData.communication_metrics}/>}
      </div>
      </div>


      
      <br></br>

      <div className="grid lg:flex-row grid-flow-row-dense grid-cols-1 grid-row-2 flex-col justify-around h-full gap-2 m-2">
        {/* <div style={{ fontSize: '24px', textAlign: 'center', color:'red'}}>
          <Title title={"Fora dos Padrões de sucesso"} />
        </div> */}

          <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
            {analyticsData?.communication_metrics.example && <ExampleChart data={analyticsData.communication_metrics.example}/>}
          </div>

          <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
            {analyticsData?.communication_metrics.metaphor && <MetaphorChart data={analyticsData.communication_metrics.metaphor}/>}
          </div>

          <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
            {analyticsData?.communication_metrics.formality && <FormalityChart data={analyticsData.communication_metrics.formality}/>}
          </div>

          <div className="flex flex-col justify-around h-full w-full lg:w-full gap-2">
            {analyticsData?.communication_metrics.interaction && <InterationChart data={analyticsData.communication_metrics.interaction}/>}
          </div>
      </div>
      <WatsonChat/>
      <Footer />
    </div>
  );
};



