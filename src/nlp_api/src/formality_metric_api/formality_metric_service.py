import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
import re
import numpy as np
import json

# Certifique-se de ter nltk e stopwords baixados
nltk.download('punkt')

caminho_formais = '/formais.csv'
caminho_informais = '/informais.csv'

def create_dataframe_from_csv(caminho_arquivo):
    with open(caminho_arquivo, 'r') as file:
        content = file.read()

    palavras = content.split(',')
    df = pd.DataFrame(palavras, columns=["Palavras"])

    return df

def concat_dfs(df1,df2):
  df_total = pd.concat([df1, df2])
  return df_total

def vetorizacao(df_concatenado,df_formal,df_informal):
  vectorizer = TfidfVectorizer()
  X_total = vectorizer.fit_transform(df_concatenado['Palavras'])

  # Divida as matrizes para informais e formais
  X_informal = X_total[:len(df_informal)]
  X_formal = X_total[:len(df_formal)]
  return X_formal,X_informal,vectorizer

def concat_dfs(df1,df2): # O
  df_total = pd.concat([df2, df1])
  return df_total

def processar_texto(texto):
    # Converter para minúsculas
    texto = texto.lower()
    # Remover caracteres especiais
    texto = re.sub(r'[^\wÀ-ÿ]', ' ', texto)
    # Tokenizar
    tokens = nltk.word_tokenize(texto)
    return ' '.join(tokens)


def vetorizacao(df_concatenado,df_formal,df_informal):
  vectorizer = TfidfVectorizer()
  X_total = vectorizer.fit_transform(df_concatenado['Palavras'])

  # Divida as matrizes para informais e formais
  X_informal = X_total[:len(df_informal)]
  X_formal = X_total[:len(df_formal)]
  return X_formal,X_informal,vectorizer

def media_das_similaridades(similaridade_formal,similaridade_informal):
  media_informal = round(np.mean(similaridade_informal), 3)
  media_formal = round(np.mean(similaridade_formal), 3)
  return media_formal,media_informal

def calcular_similaridade(texto, X, vetorizer):
    texto_processado = processar_texto(texto)
    texto_vectorizado = vetorizer.transform([texto_processado])
    similaridade = cosine_similarity(texto_vectorizado, X)
    return similaridade

def classificar_texto(media_informal, media_formal):
    diferenca = abs(media_informal - media_formal)

    if diferenca <= 0.005:
        return 5
    elif media_informal > media_formal:
        return 1
    else:
        return 10


def pipeline(texto_do_usuario,csv_informal,csv_formal):
  texto_processado = processar_texto(texto_do_usuario)
  csv_info = create_dataframe_from_csv(csv_informal)
  csv_fo = create_dataframe_from_csv(csv_formal)
  df_total = concat_dfs(csv_fo,csv_info)
  vetores_e_vectorizer = vetorizacao(df_total,csv_fo,csv_info)
  vectorizer = vetores_e_vectorizer[2]
  similaridade_formal = calcular_similaridade(texto_processado,vetores_e_vectorizer[0],vectorizer)
  similaridade_informal = calcular_similaridade(texto_processado,vetores_e_vectorizer[1],vectorizer)
  medias = media_das_similaridades(similaridade_formal,similaridade_informal)
  classificacao = classificar_texto(medias[1],medias[0])

  data = {
    "formality": classificacao,
    "informal_similarity" : medias[1],
    "formal_similarity" : medias[0],
  }

  return data
