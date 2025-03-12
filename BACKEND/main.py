import openai
import numpy as np
import faiss
import json
import os
from dotenv import load_dotenv
from BACKEND.embedding_storage import *

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


# Example Usage
if __name__ == "__main__":
    '''
    Script workflow. 

    HARD PART
    1. First identify document name (UIGEA, Wire Act of 1961, etc.).
    2. Identify Document Type (federal (U.S.), state) - Only ingesting federal documents for now.
    3. First get properly formatted chunks (each chunk should be an individual statute).

    EASY PART
    4. Generate FAISS Indices.
    5. Insert into the faiss index pickle file/

    '''