import pandas as pd
import re
import nltk
import spacy
import json
import os
import math
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from openai import OpenAI
from dotenv import load_dotenv

nltk.download('punkt')

load_dotenv()


def definicao_quantidade_frases(quantidade):
    if quantidade > 50:
        return 0.25  # Retorna 25% das frases
    elif 40 < quantidade <= 50:
        return 0.45  # Retorna 45% das frases
    elif 30 < quantidade <= 40:
        return 0.6  # Retorna 60% das frases
    elif 18 <= quantidade <= 30:
        return 0.75  # Retorna 75% das frases
    else:
        return 1.0  # Retorna 100% das frases se for menor ou igual a 20

def resumir_texto(texto):
  parser = PlaintextParser.from_string(texto, Tokenizer("portuguese"))
  num_frases = sum(1 for _ in parser.document.sentences)
  porcentagem_frases = definicao_quantidade_frases(num_frases)
  frases40 = math.ceil(num_frases * porcentagem_frases)
  summarizer = LsaSummarizer()
  resumo = summarizer(parser.document, frases40)
  resumo_texto = ' '.join(str(sentenca) for sentenca in resumo)
  return resumo_texto

def analisar_frase(frase,key):
    messages = [
        {"role": "system", "content": "Você receberá um texto que representa uma lista de frases, Cada frase está separada por um '.' . Me responda apenas se uma frase é uma metáfora, comparação ou nenhuma. Dentro dessas 3 opções (comparação, metáfora ou nenhuma) diga a qual opção cada frase pertence. Me responda apenas a opção que a frase pertence, não precisa dizer qual frase é e separe o resultado de cada frase com quebra de linha"},
        {"role": "user", "content": frase}
    ]

    client = OpenAI(api_key=key)

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return completion.choices[0].message.content

def contar_ocorrencias(texto):
    # Converte o texto para minúsculas e remove os pontos finais no final das palavras
    texto = texto.lower().replace('.', '')

    # Define as palavras a serem contadas
    palavras = ["nenhuma", "metáfora", "comparação"]

    # Inicializa um dicionário para armazenar as contagens
    contagem = {palavra: 0 for palavra in palavras}

    # Itera sobre as palavras no texto e atualiza as contagens
    for palavra in palavras:
        contagem[palavra] = texto.split().count(palavra)

    return contagem

def porcentagem(quantidade,total):
  porcentagem = (quantidade/total)
  return round(porcentagem,2)

def categorizar_porcentagem(valor):
    intervalos = {
        (0, 0.02): 0,
        (0.03, 0.04): 1,
        (0.05, 0.06): 2,
        (0.07, 0.08): 3,
        (0.09, 0.1): 4,
        (0.11, 0.12): 5,
        (0.13, 0.14): 6,
        (0.15, 0.16): 7,
        (0.17, 0.18): 8,
        (0.19, 0.2): 9,
        (0.21, 1): 10
    }

    for intervalo, categoria in intervalos.items():
        if intervalo[0] <= valor <= intervalo[1]:
            return categoria

    return "Valor fora do intervalo de 0 a 1"

def pipeline(texto,gpt):
  p = resumir_texto(texto)
  p1 = analisar_frase(p,gpt)
  p2 = contar_ocorrencias(p1)
  soma_comparacao_metafora = p2["comparação"] + p2["metáfora"]
  soma_tudo = p2["comparação"] + p2["metáfora"] + p2["nenhuma"]
  ocorrencias_nenhuma = p2["nenhuma"]
  percentage = porcentagem(soma_comparacao_metafora,soma_tudo)
  category = categorizar_porcentagem(percentage)

  data = {
    "percentage": percentage,
    "category": category,
    "none": ocorrencias_nenhuma,
    "metaphors":soma_comparacao_metafora,
    "phrases_quantity": soma_tudo
  }

  return data
