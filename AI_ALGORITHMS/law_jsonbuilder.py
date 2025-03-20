import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define paths
LEGAL_EMBEDDINGS_PATH = "legal_embeddings.json"
PDF_INGESTION_OUTPUT_PATH = "pdf_ingest_output.json"

# Load JSON data
def load_json(path):
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}

# Merge new laws into existing structure
def merge_data(existing_data, new_data):
    for market_type, states in new_data.items():
        if market_type not in existing_data:
            existing_data[market_type] = {}

        for state_or_federal, laws in states.items():
            if state_or_federal not in existing_data[market_type]:
                existing_data[market_type][state_or_federal] = []

            existing_data[market_type][state_or_federal].extend(laws)  # Append new laws
    return existing_data

# Main function to update legal_embeddings.json
def main():
    # Load existing and new data
    existing_data = load_json(LEGAL_EMBEDDINGS_PATH)
    new_data = load_json(PDF_INGESTION_OUTPUT_PATH)

    # Merge new data into the existing data
    updated_data = merge_data(existing_data, new_data)

    # Save updated data back to legal_embeddings.json
    with open(LEGAL_EMBEDDINGS_PATH, "w") as f:
        json.dump(updated_data, f, indent=2)

    print("✅ Legal data merged and legal_embeddings.json updated successfully.")

if __name__ == "__main__":
    main()