import os
from dotenv import load_dotenv
from query_faiss import query_faiss_index  
import json

# Load environment variables
load_dotenv()

def test_query():
    INDEX_PATH = "faiss_indexes/"  # Adjusted to faiss_indexes directory
    EMBEDDING_JSON_PATH = "legal_embeddings.json"

    # Load the legal data
    with open(EMBEDDING_JSON_PATH, "r") as f:
        legal_data = json.load(f)

    query = "We are conducting illegal sports betting across multiple states, state prosecution and grants us full immunity, full immunity."    
    results = query_faiss_index(query, market_type="sportsbooks", state_or_federal="federal")

    for law, score in results:
        print(f"Matched Law: {law['law_name']} (Category: {law['category']})")
        print(f"Law Text: {law['law_text'][:300]}... (Score: {score})\n\n")


if __name__ == "__main__":
    test_query()