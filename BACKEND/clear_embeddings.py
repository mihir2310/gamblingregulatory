import faiss
import json
import os

# Define file paths
EMBEDDING_JSON_PATH = "legal_embeddings.json"
INDEX_PATH = "faiss_index"

# Clear the JSON file by writing an empty dictionary
with open(EMBEDDING_JSON_PATH, "w") as f:
    json.dump({}, f, indent=2)

# Clear the FAISS index by creating a new empty index with the same dimension (1536)
dimension = 1536
empty_index = faiss.IndexFlatL2(dimension)
faiss.write_index(empty_index, INDEX_PATH)

print("Embeddings and FAISS index cleared.")
