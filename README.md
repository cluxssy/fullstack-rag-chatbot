# **Gemini-Powered RAG Chatbot for PDF Knowledge Base**

A sophisticated, full-stack chatbot application that uses a Retrieval-Augmented Generation (RAG) architecture to answer questions based on a private library of PDF documents. This project leverages Google's Gemini Pro and embedding models, a local vector database, and a React/Next.js frontend, all fully containerized with Docker for easy setup and deployment.

## **📋 Table of Contents**

* [About The Project](https://www.google.com/search?q=%23-about-the-project)  
* [Key Features](https://www.google.com/search?q=%23-key-features)  
* [Project Architecture](https://www.google.com/search?q=%23-project-architecture)  
* [Getting Started](https://www.google.com/search?q=%23-getting-started)  
  * [Prerequisites](https://www.google.com/search?q=%23prerequisites)  
  * [Installation & Setup](https://www.google.com/search?q=%23installation--setup)  
* [Usage](https://www.google.com/search?q=%23-usage)  
  * [Running with Docker (Recommended)](https://www.google.com/search?q=%23running-with-docker-recommended)  
  * [Running Locally (for Development)](https://www.google.com/search?q=%23running-locally-for-development)  
* [Troubleshooting](https://www.google.com/search?q=%23-troubleshooting)  
* [Future Improvements](https://www.google.com/search?q=%23-future-improvements)  
* [Acknowledgments](https://www.google.com/search?q=%23-acknowledgments)

## **📖 About The Project**

This project was built to create an intelligent assistant capable of understanding and answering questions from a specific, controlled knowledge base. Instead of relying on the general knowledge of a Large Language Model (LLM), this chatbot uses a RAG pipeline to provide answers grounded in the content of provided PDF documents (in this case, several books on Machine Learning).  
This approach is ideal for applications requiring domain-specific knowledge, such as internal documentation Q\&A, customer support bots, or personal study aids.  
**Core Technologies Used:**

* **Backend:** Python, FastAPI, Uvicorn  
* **AI & RAG:**  
  * **LLM:** Google Gemini 1.5 Pro  
  * **Embeddings:** Google text-embedding-004  
  * **Vector Database:** ChromaDB (local)  
  * **PDF Processing:** pypdf, langchain (for text splitting)  
* **Frontend:** React, Next.js, TypeScript  
* **Containerization:** Docker, Docker Compose  
* **Environment Management:** python-dotenv, venv

## **✨ Key Features**

* **Dynamic Knowledge Base:** Easily ingest and process any collection of PDF documents.  
* **Context-Aware Responses:** Utilizes RAG to ensure answers are relevant and derived directly from the source material.  
* **High-Performance Backend:** Built with FastAPI for fast, asynchronous request handling.  
* **Interactive Frontend:** A clean, responsive chat interface built with Next.js allows for a seamless user experience.  
* **Containerized & Portable:** The entire application is containerized with Docker, ensuring a consistent environment and a simple one-command startup.  
* **Secure API Key Handling:** Uses environment variables to keep sensitive credentials safe.

## **🏗️ Project Architecture**

The application is divided into two main components: a backend server that handles the AI logic and a frontend client for user interaction, orchestrated by Docker Compose.  
\+--------------------------------+      \+--------------------------------+  
|      Frontend (Next.js)        |      |       Backend (FastAPI)        |  
|--------------------------------|      |--------------------------------|  
| \- User Interface (Chat Window) |      | \- API Endpoint (/chat)         |  
| \- State Management (React)     |      | \- RAG Pipeline                 |  
| \- API Calls to Backend         |      | \- PDF Processing & Chunking    |  
\+--------------------------------+      \+--------------------------------+  
             |                                          ^  
             | HTTP Request (User Query)                |  
             v                                          |  
\+--------------------------------+                      |  
|       API Server (Uvicorn)     |      \+--------------------------------+  
|--------------------------------|      |   Vector Database (ChromaDB)   |  
| \- Listens for requests         | \<---\>|--------------------------------|  
| \- Passes to FastAPI            |      | \- Stores Document Embeddings   |  
\+--------------------------------+      | \- Performs Similarity Search   |  
                                        \+--------------------------------+  
                                                       ^  
                                                       | (Embeddings & Prompts)  
                                                       v  
                                        \+--------------------------------+  
                                        |    Google AI Platform (API)    |  
                                        |--------------------------------|  
                                        | \- Gemini 1.5 Pro (Generation)  |  
                                        | \- text-embedding-004 (Embed)   |  
                                        \+--------------------------------+

**Workflow:**

1. A user types a question into the **Frontend**.  
2. The frontend sends an HTTP request to the **Backend** API endpoint (/chat).  
3. The backend embeds the user's query and searches **ChromaDB** for relevant document chunks.  
4. The backend sends the query and the retrieved context to the **Google Gemini API**.  
5. The Gemini API returns a generated answer.  
6. The backend sends the answer back to the frontend, where it is displayed to the user.

## **🚀 Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine.

### **Prerequisites**

* **Docker and Docker Compose:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop/).  
* **Git:** For cloning the repository.  
* **A Google AI API Key:** Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### **Installation & Setup**

1. **Clone the Repository:**  
   git clone https://github.com/your-username/gemini-rag-chatbot.git  
   cd gemini-rag-chatbot

2. **Set Up Environment Variables:**  
   * Navigate to the backend directory.  
   * Create a file named .env in the backend directory. It's a good practice to also create a .env.example file (without your key) to commit to the repository as a template for other users.  
   * Open the .env file and add your Google API key:  
     GOOGLE\_API\_KEY="YOUR\_API\_KEY\_HERE"

3. **Add Your Knowledge Base:**  
   * Place the PDF files you want the chatbot to learn from into the backend/pdf\_data directory.  
4. **Build and Ingest Data:**  
   * This is a one-time setup step. Docker Compose will build the services and run the ingestion script.  
   * From the project root directory, run:  
     docker-compose run \--build backend python scripts/ingest\_data.py

   * This command specifically runs the ingest\_data.py script inside a temporary backend container. This may take several minutes depending on the size of your PDFs.

## **💬 Usage**

### **Running with Docker (Recommended)**

After the initial data ingestion, you can start the full application with a single command.

1. **Start the Application:** From the project root directory, run:  
   docker-compose up

   To run in the background (detached mode):  
   docker-compose up \-d

2. **Access the Application:**  
   * **Frontend:** Open your browser and go to http://localhost:3000  
   * **Backend API Docs:** http://localhost:8000/docs  
3. **Stopping the Application:**  
   * If running in the foreground, press Ctrl \+ C.  
   * If running in detached mode, use: docker-compose down

### **Running Locally (for Development)**

If you prefer to run the services locally without Docker:

1. **Backend:** Navigate to the backend folder, create and activate a virtual environment (venv), install dependencies with pip install \-r requirements.txt, and run the server with uvicorn main:app \--reload.  
2. **Frontend:** Follow the "Frontend Setup" steps.  
3. Ensure both uvicorn and npm run dev servers are running simultaneously.

## **🛠️ Troubleshooting**

* **Error loading ASGI app. Could not import module "main".**  
  * **Cause:** You are running the uvicorn command from the wrong directory or your virtual environment is not active.  
  * **Solution:** Ensure you are in the backend directory and that (venv) appears in your terminal prompt before running the server.  
* **429: You exceeded your current quota...**  
  * **Cause:** You have hit the rate limits for the free tier of the Google AI API.  
  * **Solution:** Wait for the quota to reset (usually per minute/day) or upgrade to a paid plan by enabling billing on your Google Cloud project. You can also try switching from gemini-1.5-pro to the less resource-intensive gemini-1.5-flash model in main.py.  
* **Network response was not ok (Frontend Console Error)**  
  * **Cause:** The frontend cannot reach the backend. This is usually because the backend server has crashed or is not running.  
  * **Solution:** Check the terminal running your uvicorn server (or docker-compose up logs) for error messages. Address the backend error and restart the server.

## **🔮 Future Improvements**

* **Streaming Responses:** To improve perceived performance and provide a more interactive, real-time user experience.  
* **Conversation History:** To enable multi-turn conversations and allow for follow-up questions.  
* **Markdown Rendering:** To properly display formatted content like lists and code blocks, which is crucial for a technical assistant.  
* **Source Highlighting:** To increase trust and allow users to verify the information by showing which part of the source document an answer came from.  
* **Deployment:** To make the application publicly accessible and create a production-ready portfolio piece.

## **🙏 Acknowledgments**

* The authors of the machine learning books used as the knowledge base.  
* The teams behind FastAPI, ChromaDB, Next.js, and Docker for their incredible open-source tools.  
* The extensive official documentation for all the technologies used, which was an invaluable learning resource.  
* AI assistants like GPT for providing guidance and clarification throughout the development process.