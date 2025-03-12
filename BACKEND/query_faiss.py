import faiss
import numpy as np
import json
from openai import OpenAI
from dotenv import load_dotenv
from embedding_storage import get_embedding

# Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

INDEX_PATH = "faiss_index"
EMBEDDING_JSON_PATH = "legal_embeddings.json"

# Load FAISS index & JSON file
def query_faiss_index(query_text, market_type=None, state_or_federal=None, top_k=3):
    index = faiss.read_index(INDEX_PATH)

    with open(EMBEDDING_JSON_PATH, "r") as f:
        legal_data = json.load(f)

    query_embedding = np.array(get_embedding(query_text), dtype=np.float32).reshape(1, -1)
    distances, indices = index.search(query_embedding, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx == -1:
            continue

        # Search JSON for corresponding laws
        for m_type, jurisdictions in legal_data.items():
            if market_type and m_type != market_type:
                continue

            for jurisdiction, laws in jurisdictions.items():
                if state_or_federal and jurisdiction != state_or_federal:
                    continue

                for law in laws:
                    if query_text.lower() in law["law_text"].lower():
                        results.append((law, distances[0][i]))

    return results

# Example query
if __name__ == "__main__":
    query = "What are the taxation laws for sports betting in Nevada?"
    results = query_faiss_index(query, market_type="Sports_Gambling", state_or_federal="Nevada")

    for text, score in results:
        print(f"Matched Law: {text['law_name']} (Category: {text['category']})")
        print(f"Law Text: {text['law_text'][:300]}... (Score: {score})")
