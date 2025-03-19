import faiss
import numpy as np
import json
from openai import OpenAI
from dotenv import load_dotenv
from faiss_index_builder import get_embedding  # Import from the correct location
import os
import json

# Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

INDEX_PATH = "faiss_indexes/"  # Adjusted to faiss_indexes directory
EMBEDDING_JSON_PATH = "legal_embeddings.json"
# Load the legal data
with open(EMBEDDING_JSON_PATH, "r") as f:
    legal_data = json.load(f)

# Load FAISS index & JSON file
def query_faiss_index(query_text, market_type=None, state_or_federal=None, top_k=3):
    # Pre-filter the laws based on market_type and state_or_federal
    filtered_laws = filter_laws(legal_data, market_type, state_or_federal)
    
    # If no laws are found after filtering, return early
    if not filtered_laws:
        return []

    # Generate the embedding for the query
    query_embedding = np.array(get_embedding(query_text), dtype=np.float32).reshape(1, -1)

    # Perform FAISS search on the filtered laws
    filtered_index = create_filtered_faiss_index(filtered_laws)
    distances, indices = filtered_index.search(query_embedding, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx == -1:
            continue

        # Get the law from the filtered laws
        law = filtered_laws[idx]
        results.append((law, distances[0][i]))

    return results


# Filter laws based on market_type and state_or_federal
def filter_laws(legal_data, market_type, state_or_federal):
    filtered_laws = []

    for m_type, jurisdictions in legal_data.items():
        if market_type and m_type != market_type:
            continue  # Skip if market type doesn't match

        for jurisdiction, laws in jurisdictions.items():
            if state_or_federal and jurisdiction != state_or_federal:
                continue  # Skip if jurisdiction doesn't match

            filtered_laws.extend(laws)

    return filtered_laws


# Create FAISS index for filtered laws
def create_filtered_faiss_index(filtered_laws):
    dimension = 1536  # Embedding dimension size (for text-embedding-ada-002)
    filtered_index = faiss.IndexFlatL2(dimension)

    # Add embeddings for the filtered laws
    embeddings = []
    for law in filtered_laws:
        law_text = law["law_text"]
        embedding = np.array(get_embedding(law_text), dtype=np.float32)
        embeddings.append(embedding)

    embeddings = np.array(embeddings)
    filtered_index.add(embeddings)  # Add all filtered embeddings at once

    return filtered_index

# Formats results into a nice JSON file
def format_results(results):
    formatted_results = []

    for law, score in results:
        formatted_results.append({
            "Law Name": law["law_name"],
            "Category": law["category"],
            "Law Text": law["law_text"].replace('\n', ' ').strip(),
            "Updated On": law["updated_on"],
            "Score": float(score)  # Convert np.float32 to native float for JSON compatibility
        })

    return json.dumps(formatted_results, indent=2)  # Return a JSON string

def GETRELEVANTLAWS(query, market_type, state_or_federal):
    INDEX_PATH = "faiss_indexes/"  # Adjusted to faiss_indexes directory
    EMBEDDING_JSON_PATH = "legal_embeddings.json"
    
    # Get the search results from the FAISS query
    results = query_faiss_index(query, market_type=market_type, state_or_federal=state_or_federal)

    # Format the results into a JSON string
    formatted_results = format_results(results)

    return formatted_results
