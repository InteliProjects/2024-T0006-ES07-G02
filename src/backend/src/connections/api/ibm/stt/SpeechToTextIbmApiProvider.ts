import SpeechToTextIbmApiConnection from './SpeechToTextIbmApiConnection';

export class SpeechToTextIbmApiProvider {
    ibmSttConnection?: SpeechToTextIbmApiConnection = undefined;

    public async setConnection(environmentVars: any) {
        this.ibmSttConnection = new SpeechToTextIbmApiConnection(
            environmentVars.IBM_STT_BASE_URL,
            environmentVars.IBM_STT_API_KEY,
        );
    }
}

const speechToTextIbmApiProvider = new SpeechToTextIbmApiProvider();
export default speechToTextIbmApiProvider;



