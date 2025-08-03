import os
import chromadb
from dotenv import load_dotenv
import google.generativeai as genai
import pypdf
from langchain.text_splitter import RecursiveCharacterTextSplitter


print("--- Starting Ingestion Process ---")

load_dotenv(dotenv_path='../.env')


api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found. Please check your .env file in the 'backend' directory.")
genai.configure(api_key=api_key)


client = chromadb.PersistentClient(path="../db")
collection = client.get_or_create_collection(name="coding_book_knowledge")


pdf_directory = '../data'
raw_text = ""

print(f"Loading PDFs from directory: {pdf_directory}")
for filename in os.listdir(pdf_directory):
    if filename.endswith('.pdf'):
        filepath = os.path.join(pdf_directory, filename)
        print(f"Reading: {filename}")
        try:
            reader = pypdf.PdfReader(filepath)
            for page in reader.pages:
                
                raw_text += page.extract_text() + " "
        except Exception as e:
            print(f"Error reading {filename}: {e}")

if not raw_text.strip():
    raise ValueError("No text extracted from PDFs. Check the 'pdf_data' directory and ensure files are not empty or corrupted.")

print("Successfully loaded text from all PDF(s).")

# --- 3. TEXT CHUNKING ---
print("Splitting text into chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    length_function=len
)
chunks = text_splitter.split_text(raw_text)
print(f"Split text into {len(chunks)} chunks.")

# --- 4. EMBEDDING & STORAGE ---
print("Embedding chunks and storing them in ChromaDB...")

# Prepare document IDs
doc_ids = [f"doc_{i}" for i in range(len(chunks))]

# Check for existing documents to avoid re-embedding
existing_ids = collection.get(ids=doc_ids)['ids']
new_chunks = [chunk for i, chunk in enumerate(chunks) if doc_ids[i] not in existing_ids]
new_doc_ids = [doc_id for doc_id in doc_ids if doc_id not in existing_ids]

if new_chunks:
    print(f"Found {len(new_chunks)} new chunks to add.")
    # Embed and add new documents in batches to handle API limits
    batch_size = 100 # Gemini API has a limit on documents per call
    for i in range(0, len(new_chunks), batch_size):
        batch_chunks = new_chunks[i:i+batch_size]
        batch_ids = new_doc_ids[i:i+batch_size]
        
        print(f"Processing batch {i//batch_size + 1}...")
        embeddings = genai.embed_content(
            model="models/text-embedding-004",
            content=batch_chunks,
            task_type="RETRIEVAL_DOCUMENT"
        )['embedding']

        collection.add(
            documents=batch_chunks,
            embeddings=embeddings,
            ids=batch_ids
        )
    print("Successfully added all new chunks to the database.")
else:
    print("No new chunks to add. Database is up-to-date.")

print("\n--- Ingestion Complete ---")
print(f"Total documents in collection: {collection.count()}")