import faiss
import numpy as np
import openai
import json
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Function to generate OpenAI embeddings (Updated)
def get_embedding(text, model="text-embedding-ada-002"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

# Function to create FAISS index and store embeddings
def create_faiss_index(legal_texts, index_path="faiss_index"):
    dimension = 1536  # OpenAI embedding dimension
    index = faiss.IndexFlatL2(dimension)  # L2 distance (Euclidean)

    embeddings = []
    text_mapping = {}

    for i, text in enumerate(legal_texts):
        embedding = np.array(get_embedding(text), dtype=np.float32)
        index.add(np.array([embedding]))  # Add to FAISS
        embeddings.append(embedding)
        text_mapping[i] = text  # Store mapping

    # Save index and text mapping
    faiss.write_index(index, index_path)
    with open("text_mapping.json", "w") as f:
        json.dump(text_mapping, f)

    print("FAISS index and text mapping saved.")

# Function to query FAISS index
def query_faiss_index(query_text, index_path="faiss_index", top_k=3):
    # Load FAISS index
    index = faiss.read_index(index_path)
    
    # Load text mapping
    with open("text_mapping.json", "r") as f:
        text_mapping = json.load(f)

    # Get query embedding
    query_embedding = np.array(get_embedding(query_text), dtype=np.float32).reshape(1, -1)

    # Search FAISS index
    distances, indices = index.search(query_embedding, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx == -1:  # No match found
            continue
        results.append((text_mapping[str(idx)], distances[0][i]))

    return results

# Example Usage
if __name__ == "__main__":

    # # Sample legal texts
    # legal_docs = [
    #     "Federal law prohibits unauthorized gambling across state lines.",
    #     "State law mandates all sportsbooks register with the state commission.",
    #     "Online gambling platforms must verify user identity before allowing bets."
    # ]

    # # Create FAISS index
    # create_faiss_index(legal_docs)

    # # Query FAISS index
    # query = "Do online gambling platforms need to verify users?"
    # results = query_faiss_index(query)

    # # Display results
    # for text, distance in results:
    #     print(f"Matched: {text} (Score: {distance})")
    pass