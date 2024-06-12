import InputText from "../../components/Input/InputText.tsx/InputText";
import { IoMdSearch } from "react-icons/io";
import { TiMicrophoneOutline } from "react-icons/ti";
import AudioRecorder from "../../components/Input/InputAudio.tsx/InputAudio";

export default function Testepage() {
  return (
    <div className="w-64">
      <InputText
        required={false}
        label="Envie sua solicitação"
        icon={<IoMdSearch size={26} />}
        secondaryIcon={<TiMicrophoneOutline size={24} />}
      />
      <br></br>
      <AudioRecorder></AudioRecorder>
    </div>
  );
}
