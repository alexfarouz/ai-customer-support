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

pinecone_api_key = os.getenv("PINECONE_API_KEY") # Load Pinecone API
os.environ['PINECONE_API_KEY'] = pinecone_api_key

openai_api_key = os.getenv("OPENAI_API_KEY") # Load OpenAI API
os.environ['OPENAI_API_KEY'] = openai_api_key

embeddings = OpenAIEmbeddings()
embed_model = "text-embedding-3-small"
openai_client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"): # Create function to get embeddings from OpenAI API
    response = openai_client.embeddings.create(input=text, model=model)
    return response.data[0].embedding

def cosine_similarity_between_words(sentence1, sentence2): # Function to calculate cosine similarity
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
loader = YoutubeLoader.from_youtube_url("https://www.youtube.com/watch?v=e-gwvmhyU7A", add_video_info=True)
data = loader.load()
texts = text_splitter.split_documents(data)

index_name = "rag-ai-assistant" # Pinecone index name
namespace = "youtube-videos"
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

vectorstore_from_texts = PineconeVectorStore.from_texts(
    [f"Source: {t.metadata['source']}, Title: {t.metadata['title']} \n\nContent: {t.page_content}" for t in texts],
    embeddings,
    index_name=index_name,
    namespace=namespace
)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"),)
pinecone_index = pc.Index(index_name) # Connect to your Pinecone index

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

    system_prompt = f"""You are an expert personal assistant. Answer any questions I have about the Youtube Video provided. You always answer questions based only on the context that you have been provided."""

    res = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": augmented_query}
        ]
    )

    return res.choices[0].message.content

# Sample questions from video:
# What does Aravind mention about pre-training and why it is important?
# What advantages does Perplexity have over other AI companies?

'''
systemPrompt = `You are an AI-powered customer support assistant for Headstarter AI, a platform that provides AI-driven 
    interviews for software engineering (SWE) jobs. Your role is to assist users with their inquiries, provide information about 
    the platform's features, and help troubleshoot any issues they may encounter. Your responses should be clear, concise, and 
    professional. You should also strive to be friendly and supportive, as many users may be anxious about their job search process.

    Key points to remember:

    Always greet the user warmly.
    Provide accurate and helpful information about Headstarter AI and its services.
    Guide users through the process of scheduling and preparing for AI-driven interviews.
    Assist with technical issues, such as account problems, interview setup, and accessing resources.
    Offer tips and best practices for succeeding in AI-driven interviews.
    Ensure users feel supported and encouraged throughout their interaction with you.
    Example queries you might handle:

    "How do I sign up for an AI-driven interview on Headstarter AI?"
    "What kind of questions will be asked during the AI interview?"
    "I'm having trouble accessing my account. Can you help me reset my password?"
    "Can you explain how the AI evaluates my interview performance?"
    "What should I do to prepare for my upcoming AI-driven interview?"
    Always aim to provide a positive experience and build confidence in users as they navigate their job search with Headstarter AI.`
'''