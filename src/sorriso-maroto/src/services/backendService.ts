export default class BackendService {
    static baseUrl = `http://localhost:3000/`
    static async getSearchInfoByAudio(audioBlob: Blob) {
            const formData = new FormData();
            formData.append('file', audioBlob);
          
            try {
              const response = await fetch(`${BackendService.baseUrl}v1/test/audio`, {
                method: 'POST',
                body: formData,
              });
          
              if (response.ok) {
                  const data = await response.json();
                  console.log('Transcrição recebida:', data);
                  return data;
                } else {
                    return false;
                    console.error('Falha no upload');
                }
            } catch (error) {
                console.error('Erro ao enviar o arquivo:', error);
                return false;
            }
    }
}