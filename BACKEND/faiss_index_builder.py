import faiss
import numpy as np
import json
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Define paths
LEGAL_EMBEDDINGS_PATH = "legal_embeddings.json"
FAISS_DIRECTORY = "./faiss_indexes/"  # Directory for FAISS index files

# Ensure FAISS directory exists
if not os.path.exists(FAISS_DIRECTORY):
    os.makedirs(FAISS_DIRECTORY)

# Function to generate embeddings using OpenAI API
def get_embedding(text, model="text-embedding-ada-002"):
    # Clean up the text by removing newline characters
    text = text.replace("\n", " ")
    embedding = client.embeddings.create(input=[text], model=model).data[0].embedding
    return np.array(embedding, dtype=np.float32)

# Load JSON data
def load_json(path):
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}

# Create or update FAISS index for each market type and jurisdiction
def create_faiss_index(market_type, jurisdiction, laws):
    # Construct file name for FAISS index
    faiss_filename = f"{market_type}_{jurisdiction}_faiss.index"
    faiss_filepath = os.path.join(FAISS_DIRECTORY, faiss_filename)

    # Check if FAISS index already exists
    if os.path.exists(faiss_filepath):
        index = faiss.read_index(faiss_filepath)
    else:
        # Create a new index if not found
        dimension = 1536  # Dimensionality of the embedding
        index = faiss.IndexFlatL2(dimension)

    # Add new embeddings to the FAISS index
    embeddings = []
    for law in laws:
        law_text = law["law_text"]
        # Generate embedding for the law text
        embedding = get_embedding(law_text)
        embeddings.append(embedding)

    embeddings = np.array(embeddings)
    index.add(embeddings)  # Add to FAISS

    # Save the updated FAISS index
    faiss.write_index(index, faiss_filepath)
    print(f"✅ FAISS index for {market_type}_{jurisdiction} updated/created successfully.")

# Main function to process legal data and create FAISS indices
def main():
    # Load the legal data
    legal_data = load_json(LEGAL_EMBEDDINGS_PATH)

    # Iterate through legal data and create FAISS indices for each market and jurisdiction
    for market_type, jurisdictions in legal_data.items():
        for jurisdiction, laws in jurisdictions.items():
            create_faiss_index(market_type, jurisdiction, laws)

    print("✅ FAISS indices for all market types and jurisdictions created/updated.")

if __name__ == "__main__":
    main()