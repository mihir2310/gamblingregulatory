import faiss
import json
import os
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import numpy as np
from pdf_ingestion import process_pdf

# Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Define where the embeddings will be stored
EMBEDDING_JSON_PATH = "legal_embeddings.json"
INDEX_PATH = "faiss_index"

# Generate OpenAI Embeddings
def get_embedding(text, model="text-embedding-ada-002"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

# Function to determine category based on file name
def categorize_law(file_name):
    if "tax" in file_name.lower():
        return "Taxation"
    elif "license" in file_name.lower() or "permit" in file_name.lower():
        return "Licensing"
    elif "gaming" in file_name.lower() or "gambling" in file_name.lower():
        return "Gambling"
    elif "compliance" in file_name.lower():
        return "Compliance"
    else:
        return "General"

# Function to create FAISS index & JSON storage
def create_faiss_index(pdf_files, selected_chunks=None):
    dimension = 1536
    index = faiss.IndexFlatL2(dimension)

    # Load or initialize JSON data
    if os.path.exists(EMBEDDING_JSON_PATH):
        with open(EMBEDDING_JSON_PATH, "r") as f:
            legal_data = json.load(f)
    else:
        legal_data = {}

    for pdf_path in pdf_files:
        print(f"Processing {pdf_path}...")

        # Extract metadata from filename
        file_name = os.path.basename(pdf_path).replace(".pdf", "")
        parts = file_name.split("_")
        if len(parts) < 3:
            print(f"Skipping {pdf_path}: Filename should follow 'MarketType_State_LawName.pdf' format")
            continue
        
        market_type, state_or_federal, law_name = parts[0], parts[1], "_".join(parts[2:])
        category = categorize_law(law_name)
        updated_on = str(datetime.today().date())

        text_chunks = process_pdf(pdf_path)

        # If chunks are provided, use them; otherwise, use all chunks
        chunks_to_process = selected_chunks if selected_chunks is not None else text_chunks

        for chunk in chunks_to_process:
            embedding = np.array(get_embedding(chunk), dtype=np.float32)
            index.add(np.array([embedding]))  # Add to FAISS

            # Add to JSON structure
            if market_type not in legal_data:
                legal_data[market_type] = {}

            if state_or_federal not in legal_data[market_type]:
                legal_data[market_type][state_or_federal] = []

            legal_data[market_type][state_or_federal].append({
                "law_name": law_name.replace("_", " "),
                "category": category,
                "law_text": chunk,
                "updated_on": updated_on
            })

    # Save FAISS index & structured JSON
    faiss.write_index(index, INDEX_PATH)
    with open(EMBEDDING_JSON_PATH, "w") as f:
        json.dump(legal_data, f, indent=2)

    print("FAISS index & structured JSON saved successfully.")
