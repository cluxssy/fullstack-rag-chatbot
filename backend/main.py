import os
import chromadb
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 1. SETUP and INITIALIZATION ---
print("--- Starting Backend Server ---")

# Load environment variables
load_dotenv()

# Configure the Google Generative AI client
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found. Please check your .env file.")
genai.configure(api_key=api_key)

# Initialize ChromaDB client and get the collection
client = chromadb.PersistentClient(path="./db")
collection = client.get_collection(name="coding_book_knowledge")
print("Successfully connected to ChromaDB collection.")

# Initialize the Gemini model
llm = genai.GenerativeModel('gemini-1.5-flash')
print("Gemini model initialized.")

# Initialize FastAPI app
app = FastAPI()

# --- 2. CORS MIDDLEWARE ---
# Setup CORS to allow requests from our frontend
# (Update origins to your frontend's URL in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Pydantic Model for Request Body ---
class ChatRequest(BaseModel):
    query: str

# --- 4. The Core RAG API Endpoint ---
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        user_query = request.query
        print(f"Received query: {user_query}")

        # --- RETRIEVAL ---
        # 1. Embed the user's query
        query_embedding = genai.embed_content(
            model="models/text-embedding-004",
            content=user_query,
            task_type="RETRIEVAL_QUERY"
        )['embedding']

        # 2. Query ChromaDB to find relevant documents
        # We ask for the 5 most relevant chunks.
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=5
        )
        
        # Extract the document texts from the results
        retrieved_docs = results['documents'][0]
        context = "\n\n".join(retrieved_docs)

        # --- AUGMENTATION & GENERATION ---
        # 3. Create the prompt for the LLM
        prompt = f"""
        You are a helpful and expert coding assistant.
        Answer the following question based on the provided context.
        If the context does not contain the answer, state that you cannot answer based on the available information.
        Do not make up information.

        CONTEXT:
        {context}

        QUESTION:
        {user_query}

        ANSWER:
        """

        # 4. Generate the response
        response = llm.generate_content(prompt)

        print("Successfully generated response.")
        return {"response": response.text}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during chat processing.")

@app.get("/")
def read_root():
    return {"message": "Coding Chatbot API is running!"}