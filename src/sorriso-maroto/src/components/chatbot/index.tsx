import { useEffect } from 'react';

declare global {
    interface Window {
      watsonAssistantChatOptions?: {
        integrationID: string;
        region: string;
        serviceInstanceID: string;
        clientVersion?: string;
        onLoad: (instance: any) => void;
      };
    }
  }

const WatsonChat = () => {
    useEffect(() => {
      window.watsonAssistantChatOptions = {
        integrationID: "9a39b0e7-2a3e-491d-ac2a-b62736086690",
        region: "au-syd",
        serviceInstanceID: "e2dd6a36-87ff-423e-9eea-2c6a069caded",
        onLoad: async (instance: any) => { await instance.render(); }
      };
  
      const script = document.createElement('script');
      script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
      document.head.appendChild(script);
  
      // Limpeza quando o componente é desmontado
      return () => {
        document.head.removeChild(script);
      };
    }, []); // O array vazio garante que o efeito é executado apenas uma vez após a montagem do componente
  
    return null; // Este componente não renderiza nada
  };
  
  export default WatsonChat;