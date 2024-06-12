import os
from dotenv import load_dotenv
import requests

load_dotenv()

url_nlu = os.getenv("url_nlu")



def analyze_text_with_nlu(roteiro, api_key):
    url = url_nlu

    data = {
        "text": roteiro,
        "features": {
            "categories": {
                "limit": 3
            },
            "keywords": {
                "limit": 3
            },
            "concepts": {
                "limit": 3
            }
        }
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, auth=("apikey", api_key), json=data, headers=headers)

    return response.json()

# Exemplo de uso:


def get_tags(array):
    tags_list = set()  # Usamos um conjunto para evitar repetições

    for categoria in array:
        parts = categoria['label'].split('/')
        for item in parts:
            if item.strip():  # Verifica se o item não está vazio após remover espaços em branco
                tags_list.add(item.strip())  # Adiciona o item ao conjunto

    return list(tags_list)

def pipeline_get_tags(roteiro_do_video,apikey):
  p1 = analyze_text_with_nlu(roteiro_do_video,apikey)
  p2 = p1['categories']
  p3 = get_tags(p2)

  data = {
    "tags": p3
  }

  return(data)


