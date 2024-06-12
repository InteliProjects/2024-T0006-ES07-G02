import { IamAuthenticator } from 'ibm-watson/auth';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
require('dotenv').config();

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_API_KEY!,
    }),
    serviceUrl: process.env.IBM_SERVICE_URL,
});

export default speechToText;
