from fastapi import FastAPI, HTTPException, BackgroundTasks
from dotenv import load_dotenv
import os
import pika
import json

import uvicorn
import pandas as pd
from pydantic import BaseModel
from typing import List
from nlp_service import find_most_similar_intent, load_and_process_data, pipeline


# COLOCAR . SRC ANTES DE SUBIR
from src.comparison_metric_apii import pipeline as comparisonPipeline
from src.tag_metric_api import pipeline_get_tags as tagPipeline
from src.formality_metric_api.formality_metric_service import pipeline as formalityPipeline

import requests
from datetime import datetime
import time


load_dotenv()

gptKey = os.getenv("gpt_key")
nluKey = os.getenv("ibm_nlu_key")
rabbit_connection = os.getenv("rabbit_connection")
rabbitqueueName = os.getenv("queue_name")
rabbit_username = os.getenv("rabbit_username")
rabbit_password = os.getenv("rabbit_password")
rabbit_host = os.getenv("rabbit_host")
backend_host = os.getenv("backend_host")
porta = 5672

#Se der erro de caminho é só ajustar para o docker
# Para rodar local "formality_metric_api/informais.csv" || "formality_metric_api/formais.csv"
caminho_informais = "src/formality_metric_api/informais.csv"
caminho_formais = "src/formality_metric_api/formais.csv"

app = FastAPI()


class PredictInput(BaseModel):
    text: str

def conectar_rabbitmq():
    # Conectar ao servidor RabbitMQ
    credentials = pika.PlainCredentials(rabbit_username, rabbit_password)
    parametros_conexao = pika.ConnectionParameters(host=rabbit_host, port=porta, credentials=credentials)
    
    try:
        conexao = pika.BlockingConnection(parametros_conexao)
        canal = conexao.channel()
        print("Conexão com RabbitMQ estabelecida com sucesso!")
        return conexao, canal
    except Exception as e:
        print(f"Erro ao conectar ao RabbitMQ: {e}")
        time.sleep(5)
        return conectar_rabbitmq()
    

def consumir_fila(canal):
    def callback(ch, method, properties, body):
        try:
            mensagem = json.loads(body.decode('utf-8'))
            metricas = generate_metrics_and_send_to_webhook(mensagem)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as error:
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
            
    canal.basic_qos(prefetch_count=50)
    canal.queue_declare(queue=rabbitqueueName, durable=True)
    canal.basic_consume(queue=rabbitqueueName, on_message_callback=callback, auto_ack=False)
    print("Aguardando mensagens. Para sair, pressione CTRL+C")

    try:
        canal.start_consuming()
    except KeyboardInterrupt:
        print("Parando de consumir mensagens...")
        canal.stop_consuming()


def send_webhook(info):
    try:
        response = requests.post(f"{backend_host}webhooks/videos/metrics", json=info)
        response.raise_for_status()  # Isso lançará uma exceção se a solicitação não for bem-sucedida
        return {"statuscode": response.status_code}  # Retorna o código de status da resposta se a solicitação for bem-sucedida
    except requests.exceptions.RequestException as e:
        print("Erro ao fazer a requisição:", e)
        return {"statuscode": 500}

def generate_metrics_and_send_to_webhook(data):
    try:
        print(f'[{datetime.now().strftime("%d/%m/%Y %H:%M:%S")}] Sending PROCESSING to "{data["id"]}" id')
        send_webhook({
            "id": data["id"],
            "status": "PROCESSING"
        })

        texto = data["metadata"]["transcription"]
        tags = tagPipeline(texto, nluKey) 
        metaphors = comparisonPipeline(texto, gptKey)
        formality = formalityPipeline(texto, caminho_informais, caminho_formais)
        

        print(f'[{datetime.now().strftime("%d/%m/%Y %H:%M:%S")}] Sending FINISHED to "{data["id"]}" id')
        send_webhook({
            "id": data["id"],
            "status": "FINISHED",
            "metaphor": metaphors["category"],
            "formality": formality["formality"],  
            "topics": tags["tags"],
            "interaction": 5  
        })
    except Exception as error:
        print(f'[{datetime.now().strftime("%d/%m/%Y %H:%M:%S")}] Sending ERROR to "{data["id"]}" id')
        send_webhook({
            "id": data["id"],
            "status": "ERROR",
            "metaphor": metaphors["category"],
            "formality": formality["formality"],  
            "topics": tags["tags"],
            "interaction": 5  
        })

        raise error


conexao, canal_da_conexao = conectar_rabbitmq()

@app.post('/intent')
async def predict_intent(input_data: PredictInput):
    csv_path = "./data/saida.csv"
    df = pd.read_csv(csv_path)
    predicted_intent = find_most_similar_intent(input_data.text, load_and_process_data(df))
    return {"intent": predicted_intent}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

print(consumir_fila(canal_da_conexao))

print(conexao,canal_da_conexao)