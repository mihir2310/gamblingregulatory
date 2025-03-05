import openai
import numpy as np
import faiss
import json
import os
from dotenv import load_dotenv
from APIRequests import *

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


# Example Usage
if __name__ == "__main__":

    legal_data = ''

    # Example: Run this to create the FAISS index
    create_faiss_index_from_legal_data(legal_data)

    # Example
    query = "What are the gambling regulations in California for sports betting?"
    results = query_faiss_index(query)

    # Display the results
    for result in results:
        print(f"Market: {result['market_type']}")
        print(f"Jurisdiction: {result['jurisdiction']}")
        print(f"Law: {result['law']}")
        print(f"Text: {result['text']}")
        print(f"Distance: {result['distance']}")
        print()