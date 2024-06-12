import { useState } from 'react';
import BackendService from '../../../services/backendService';

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [text, setText] = useState<String>('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        console.log('Vai mandar o upload');
        const audioBlob = new Blob(audioChunks);
        await uploadAudio(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = () => {
    console.log('clicou em parar');
    mediaRecorder?.stop();
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const result = await BackendService.getSearchInfoByAudio(audioBlob) as any;
    setText(result.transcription);
    return result;
  };

  return (
    <div>
      <button onClick={startRecording} style={{marginBottom: '10px'}}>Start Recording</button><br></br>
      <button onClick={stopRecording} disabled={!mediaRecorder}>Stop Recording</button>
      <span style={{display: 'block', marginTop: '5px'}}>
        Transcription: {text}
      </span>
    </div>
  );
};

export default AudioRecorder;
