from langchain_community.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader, WebBaseLoader, YoutubeLoader, DirectoryLoader, TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.metrics.pairwise import cosine_similarity
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from openai import OpenAI
import numpy as np
import tiktoken
import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv(dotenv_path='../.env.local')

pinecone_api_key = os.getenv("PINECONE_API_KEY")
os.environ['PINECONE_API_KEY'] = pinecone_api_key

openai_api_key = os.getenv("OPENAI_API_KEY")
os.environ['OPENAI_API_KEY'] = openai_api_key

embeddings = OpenAIEmbeddings()
embed_model = "text-embedding-3-small"
openai_client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
    response = openai_client.embeddings.create(input=text, model=model)
    return response.data[0].embedding

def cosine_similarity_between_words(sentence1, sentence2):
    embedding1 = np.array(get_embedding(sentence1))
    embedding2 = np.array(get_embedding(sentence2))

    embedding1 = embedding1.reshape(1, -1)
    embedding2 = embedding2.reshape(1, -1)

    return cosine_similarity(embedding1, embedding2)[0][0]

def tiktoken_len(text):
    tokenizer = tiktoken.get_encoding('p50k_base')
    tokens = tokenizer.encode(text, disallowed_special=())
    return len(tokens)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100,
    length_function=tiktoken_len,
    separators=["\n\n", "\n", " ", ""]
)

# Load and split youtube transcript
#loader = YoutubeLoader.from_youtube_url("https://www.youtube.com/watch?v=e-gwvmhyU7A", add_video_info=True)
#data = loader.load()
#texts = text_splitter.split_documents(data)

index_name = "rag-ai-assistant"
namespace = "youtube-videos"
#vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

#vectorstore_from_texts = PineconeVectorStore.from_texts(
#    [f"Source: {t.metadata['source']}, Title: {t.metadata['title']} \n\nContent: {t.page_content}" for t in texts],
#    embeddings,
#    index_name=index_name,
#    namespace=namespace
#)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"),)
pinecone_index = pc.Index(index_name)

# Function to perform RAG
def perform_rag(query):
    raw_query_embedding = openai_client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    )
    query_embedding = raw_query_embedding.data[0].embedding
    top_matches = pinecone_index.query(
        vector=query_embedding,
        top_k=10,
        include_metadata=True,
        namespace=namespace
    )

    contexts = [item['metadata']['text'] for item in top_matches['matches']]
    augmented_query = "<CONTEXT>\n" + "\n\n-------\n\n".join(contexts[:10]) + "\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + query

    system_prompt = """You are an expert personal assistant. Answer any questions I have about the Youtube Video provided. 
    You always answer questions based on the context that you have been provided. Also keep in mind this text is being displayed using
    react-markdown so format the text accordingly."""

    res = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": augmented_query}
        ]
    )

    answer = res.choices[0].message.content
    return {"answer": answer}
