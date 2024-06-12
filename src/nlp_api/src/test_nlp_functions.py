import re
import unittest
import nltk
from nltk.corpus import stopwords
from nlp_service import clean_text, tokenizacao, lemmatization,remove_stopwords
from comparison_metric_apii import categorizar_porcentagem,definicao_quantidade_frases,contar_ocorrencias

# Baixar as stopwords do NLTK se ainda não estiverem baixadas



# Definindo as funções


# Classe para os testes
class TestRemoveStopwordsFunction(unittest.TestCase):

    def test_remove_stopwords(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO REMOVE STOPWORDS\033[0m")  # Título em vermelho
        input_tokens_1 = ["o", "rápido", "cão", "marrom", "pula", "sobre", "o", "cão", "preguiçoso"]
        expected_output_1 = ["rápido", "cão", "marrom", "pula", "sobre", "cão", "preguiçoso"]
        output_1 = remove_stopwords(input_tokens_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        input_tokens_2 = ["um"]
        expected_output_2 = []
        output_2 = remove_stopwords(input_tokens_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        input_tokens_3 = []
        expected_output_3 = []
        output_3 = remove_stopwords(input_tokens_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde

        input_tokens_4 = ["linguagem", "programação", "Python"]
        expected_output_4 = ["linguagem", "programação", "Python"]
        output_4 = remove_stopwords(input_tokens_4)
        print("\033[1;33mCaso de teste 4:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_4)  # Input em verde
        print("\033[92mOutput:\033[0m", output_4)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_4)  # Output esperado em verde

        input_tokens_5 = ["o", "e", "ou", "mas"]
        expected_output_5 = []
        output_5 = remove_stopwords(input_tokens_5)
        print("\033[1;33mCaso de teste 5:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_5)  # Input em verde
        print("\033[92mOutput:\033[0m", output_5)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_5)  # Output esperado em verde


class TestCleanTextFunction(unittest.TestCase):

    def test_clean_text(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO CLEAN TEXT\033[0m")  # Título em vermelho
        # Caso de teste 1: Texto com caracteres especiais
        input_text_1 = "Isso é um texto com !@# caracteres especiais."
        expected_output_1 = "isso é um texto com  caracteres especiais"
        output_1 = clean_text(input_text_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Texto vazio
        input_text_2 = ""
        expected_output_2 = ""
        output_2 = clean_text(input_text_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Texto sem caracteres especiais
        input_text_3 = "Isso é um texto sem caracteres especiais."
        expected_output_3 = "isso é um texto sem caracteres especiais"
        output_3 = clean_text(input_text_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde


class TestTokenizacaoFunction(unittest.TestCase):

    def test_tokenizacao(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO TOKENIZAÇÃO\033[0m")  # Título em vermelho
        # Caso de teste 1: Texto com múltiplas palavras
        input_text_1 = "Isso é um teste de tokenizacao."
        expected_output_1 = ["Isso", "é", "um", "teste", "de", "tokenizacao", "."]
        output_1 = tokenizacao(input_text_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Texto vazio
        input_text_2 = ""
        expected_output_2 = []
        output_2 = tokenizacao(input_text_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Texto com apenas uma palavra
        input_text_3 = "Teste"
        expected_output_3 = ["Teste"]
        output_3 = tokenizacao(input_text_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde


class TestLemmatizationFunction(unittest.TestCase):

    def test_lemmatization(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO LEMMATIZATION\033[0m")  # Título em vermelho
        # Caso de teste 1: Lematização de uma lista de tokens comuns
        input_tokens_1 = ["carros", "correram", "todas", "ruas"]
        expected_output_1 = ["carro", "correr", "todo", "rua"]
        output_1 = lemmatization(input_tokens_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Lematização de uma lista vazia
        input_tokens_2 = []
        expected_output_2 = []
        output_2 = lemmatization(input_tokens_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Lematização de uma lista com uma única palavra
        input_tokens_3 = ["cachorros"]
        expected_output_3 = ["cachorro"]
        output_3 = lemmatization(input_tokens_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde

        # Caso de teste 4: Lematização de uma lista com palavras já lematizadas
        input_tokens_4 = ["cachorro", "correu", "rápido"]
        expected_output_4 = ["cachorro", "correr", "rápido"]
        output_4 = lemmatization(input_tokens_4)
        print("\033[1;33mCaso de teste 4:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_tokens_4)  # Input em verde
        print("\033[92mOutput:\033[0m", output_4)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_4)  # Output esperado em verde


class TestCategorizarPorcentagemFunction(unittest.TestCase):

    def test_categorizar_porcentagem(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO CATEGORIZAR PORCENTAGEM\033[0m")  # Título em vermelho
        # Caso de teste 1: Valor dentro do intervalo de 0 a 1
        input_value_1 = 0.12
        expected_output_1 = 5
        output_1 = categorizar_porcentagem(input_value_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_value_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Valor menor que 0
        input_value_2 = -0.5
        expected_output_2 = "Valor fora do intervalo de 0 a 1"
        output_2 = categorizar_porcentagem(input_value_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_value_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Valor maior que 1
        input_value_3 = 1.5
        expected_output_3 = "Valor fora do intervalo de 0 a 1"
        output_3 = categorizar_porcentagem(input_value_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_value_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde


class TestDefinicaoQuantidadeFrasesFunction(unittest.TestCase):

    def test_definicao_quantidade_frases(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO DEFINIÇÃO QUANTIDADE FRASES\033[0m")  # Título em vermelho
        # Caso de teste 1: Quantidade maior que 50
        input_quantity_1 = 55
        expected_output_1 = 0.25
        output_1 = definicao_quantidade_frases(input_quantity_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_quantity_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Quantidade entre 41 e 50
        input_quantity_2 = 45
        expected_output_2 = 0.45
        output_2 = definicao_quantidade_frases(input_quantity_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_quantity_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Quantidade entre 31 e 40
        input_quantity_3 = 35
        expected_output_3 = 0.6
        output_3 = definicao_quantidade_frases(input_quantity_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_quantity_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde

        # Caso de teste 4: Quantidade entre 18 e 30
        input_quantity_4 = 20
        expected_output_4 = 0.75
        output_4 = definicao_quantidade_frases(input_quantity_4)
        print("\033[1;33mCaso de teste 4:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_quantity_4)  # Input em verde
        print("\033[92mOutput:\033[0m", output_4)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_4)  # Output esperado em verde

        # Caso de teste 5: Quantidade menor ou igual a 18
        input_quantity_5 = 15
        expected_output_5 = 1.0
        output_5 = definicao_quantidade_frases(input_quantity_5)
        print("\033[1;33mCaso de teste 5:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_quantity_5)  # Input em verde
        print("\033[92mOutput:\033[0m", output_5)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_5)  # Output esperado em verde


class TestContarOcorrenciasFunction(unittest.TestCase):

    def test_contar_ocorrencias(self):
        print("="*100)
        print("\033[1;31mTESTE DA FUNÇÃO CONTAR OCORRÊNCIAS\033[0m")  # Título em vermelho
        # Caso de teste 1: Texto contendo todas as palavras
        input_text_1 = "Nenhuma metáfora comparação nenhuma comparação."
        expected_output_1 = {'nenhuma': 2, 'metáfora': 1, 'comparação': 2}
        output_1 = contar_ocorrencias(input_text_1)
        print("\033[1;33mCaso de teste 1:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_1)  # Input em verde
        print("\033[92mOutput:\033[0m", output_1)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_1)  # Output esperado em verde

        # Caso de teste 2: Texto sem nenhuma palavra
        input_text_2 = "Isso é um teste."
        expected_output_2 = {'nenhuma': 0, 'metáfora': 0, 'comparação': 0}
        output_2 = contar_ocorrencias(input_text_2)
        print("\033[1;33mCaso de teste 2:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_2)  # Input em verde
        print("\033[92mOutput:\033[0m", output_2)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_2)  # Output esperado em verde

        # Caso de teste 3: Texto contendo apenas uma palavra
        input_text_3 = "Metáfora"
        expected_output_3 = {'nenhuma': 0, 'metáfora': 1, 'comparação': 0}
        output_3 = contar_ocorrencias(input_text_3)
        print("\033[1;33mCaso de teste 3:\033[0m")  # Texto em amarelo e negrito
        print("\033[92mInput:\033[0m", input_text_3)  # Input em verde
        print("\033[92mOutput:\033[0m", output_3)  # Output em verde
        print("\033[92mOutput Esperado:\033[0m", expected_output_3)  # Output esperado em verde


if __name__ == '__main__':
    unittest.main()



