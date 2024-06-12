import { Title } from "../../Title";
import InputText from "../../Input/InputText.tsx/InputText";
import { IoMdSearch } from "react-icons/io";
import { TiMicrophoneOutline, TiMicrophone } from "react-icons/ti";

export const OtherInfo = ({
  onAudioSearchClick,
  isAudioActive = false,
  searchResult
}: {onAudioSearchClick: CallableFunction, isAudioActive: boolean, searchResult: any}) => {
  return (
    <div className="w-full h-full bg-white rounded-lg border border-slate-100 flex justify-between flex-col">
      <div className="w-full flex mb-1">
        <div className=" w-full  pt-2">
          <InputText
                required={false}
                label=""
                icon={<IoMdSearch size={26} />}
                secondaryIcon={isAudioActive ? <TiMicrophone color="red" size={26} /> : <TiMicrophoneOutline size={24} /> }
                onSecondaryIconClick={onAudioSearchClick}
                value={searchResult?.transcription}
            />
        </div>
      </div>
      <div className="h-[90%] border-slate-400 flex items-center justify-center">
        {searchResult ? (
          <>
          <div className="w-1/2">
            <span className="font-bold">Intenção: </span><span>{searchResult?.intent}</span>
            <div className="w-full">
              {searchResult?.intent === 'show_trending_topics' ? (<ol>
                {searchResult?.data.map((data: any, index: number) => {
                  return <li key={`index-${index}`}>{index + 1}. {data.topic}</li>
                })}
              </ol>) : searchResult?.intent === 'popular_videos' ? (<table className="w-full">
                <thead>
                  <tr><th>Título</th><th>Views</th></tr>
                </thead>
                <tbody>
                  {searchResult?.data.map((data: any, index: number) => {
                    return <tr key={`index-${index}`}><td>{data?.title}</td><td>{data?.views}</td></tr>
                  })}
                </tbody>
              </table>) : searchResult?.intent === 'graph_views_minutes' ? searchResult?.data.map((data: any, index: number) => {
                  return <li key={`index-${index}`}>{data?.minutes} minutos - {data?.views} views</li>
                }) : null}
            </div>
          </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
