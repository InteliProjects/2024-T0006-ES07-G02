# -*- coding: utf-8 -*-

import pandas as pd
import re
import nltk
import spacy
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


nltk.download('punkt')
nltk.download('stopwords')
spacy.cli.download('pt_core_news_lg')
nlp = spacy.load("pt_core_news_lg")
stopwords = nltk.corpus.stopwords.words('portuguese')

def clean_text(text):
    cleaned_text = re.sub(r"[^\w\s]", "", text).lower()
    return cleaned_text

def tokenizacao(text):
    doc = nlp(text)
    tokens = [token.text for token in doc]
    return tokens

def remove_stopwords(array_tokens):
    tokens_filtered = [word for word in array_tokens if word.lower() not in stopwords]
    return tokens_filtered

def lemmatization(array_of_tokens):
    text = ' '.join(array_of_tokens)
    doc = nlp(text)
    tokens_lemma = [token.lemma_ for token in doc]
    return tokens_lemma

def BowVectorizer(df):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(df['processed_message_str'])
    df_bow = pd.DataFrame(X.toarray(), columns=vectorizer.get_feature_names_out())
    df_bow['intent'] = df['intent']
    return df_bow

def pipeline(frase):

  p1 = clean_text(frase)
  p2 = tokenizacao(p1)
  p3 = remove_stopwords(p2)
  p4 = lemmatization(p3)
  return p4

df = pd.read_csv("/app/src/data/saida.csv")

def load_and_process_data(df):
    df['processed_message'] = df['message'].apply(pipeline)
    df['processed_message_str'] = df['processed_message'].apply(lambda x: ' '.join(x))
    df_bow = BowVectorizer(df)
    return df_bow

df_bow = load_and_process_data(df)

def find_most_similar_intent(input_text, df_bow):
    # Processa a frase de entrada usando o pipeline
    input_processed = pipeline(input_text)
    input_processed_str = ' '.join(input_processed)

    # Usa o mesmo vetorizador utilizado no DataFrame
    vectorizer = CountVectorizer(vocabulary=df_bow.columns[:-1])  # Excluindo a coluna 'intent'
    input_vectorized = vectorizer.transform([input_processed_str])

    # Calcula a similaridade do cosseno entre a entrada e todas as frases no DataFrame
    similarities = cosine_similarity(input_vectorized, df_bow.iloc[:, :-1])

    # Obtém o índice da frase mais similar
    most_similar_index = similarities.argmax()

    # Obtém o intent correspondente à frase mais similar
    most_similar_intent = df_bow.iloc[most_similar_index]['intent']

    return most_similar_intent

# Define a mensagem de entrada que se deseja analisar
input_text = 'mostre os assuntos em alta'

# Obtém a intenção mais provável associada à mensagem de entrada
predicted_intent = find_most_similar_intent(input_text, df_bow)

# Exibe na console a mensagem indicando a intenção prevista para a mensagem de entrada
print(f'A frase "{input_text}" é mais similar ao intent: {predicted_intent}')