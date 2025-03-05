from openai import OpenAI
import openai
import PyPDF2
import tiktoken
from dotenv import load_dotenv
import os
import faiss
import json
import numpy as np

# Set up dot_env (need to get openai api key) and set up client
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

# General Question Request
def question_request(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# Generate the embedding Itself
def get_embedding(text, model="text-embedding-ada-002"):
    """Generate embeddings from OpenAI model"""
    return openai.Embedding.create(input=[text], model=model)["data"][0]["embedding"]

# Function to generate embeddings for all laws and store in FAISS
def create_faiss_index_from_legal_data(legal_data):
    # FAISS index setup
    dimension = 1536  # Embedding size for text-embedding-ada-002
    index = faiss.IndexFlatL2(dimension)  # L2 distance (Euclidean)

    # This will store the mapping of text indices to their corresponding legal data
    text_mapping = {}

    # For each market type, jurisdiction, and law
    embedding_list = []
    for market_type, jurisdictions in legal_data.items():
        for jurisdiction, laws in jurisdictions.items():
            for law, text_list in laws.items():
                for law_text in text_list:
                    embedding = np.array(get_embedding(law_text), dtype=np.float32)
                    index.add(np.array([embedding]))  # Add embedding to FAISS index
                    embedding_list.append(embedding)
                    # Mapping embedding to (market_type, jurisdiction, law, text)
                    text_mapping[len(embedding_list) - 1] = {
                        "market_type": market_type,
                        "jurisdiction": jurisdiction,
                        "law": law,
                        "text": law_text
                    }

    # Save the FAISS index and text mapping
    faiss.write_index(index, "faiss_index")
    with open("text_mapping.json", "w") as f:
        json.dump(text_mapping, f)

    print("FAISS index and text mapping saved.")

def query_faiss_index(query_text, top_k=3):
    # Load FAISS index
    index = faiss.read_index("faiss_index")
    
    # Load text mapping
    with open("text_mapping.json", "r") as f:
        text_mapping = json.load(f)

    # Generate embedding for the query
    query_embedding = np.array(get_embedding(query_text), dtype=np.float32).reshape(1, -1)

    # Search the FAISS index for the top K most similar laws
    distances, indices = index.search(query_embedding, top_k)

    # Return the most relevant laws based on the indices and distances
    results = []
    for i, idx in enumerate(indices[0]):
        if idx != -1:  # Skip invalid indices
            result = text_mapping[str(idx)]
            result["distance"] = distances[0][i]  # Add the distance score
            results.append(result)

    return results
    