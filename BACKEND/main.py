import os
from dotenv import load_dotenv
from embedding_storage import create_faiss_index  # Import the function from embedding_storage
from pdf_ingestion import process_pdf  # Import the function from pdf_ingestion

# Load environment variables
load_dotenv()


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
    pdf_file = "./regulatory_docs/dfs_federal_Wire Act of 1961.pdf"  # Replace with actual PDF file paths

    text_chunks = process_pdf(pdf_file)

    # Select chunks 10-15 (indexing starts at 0)
    selected_chunks = text_chunks[10:16]  # This gets chunks 10-15 (index 9-14)

    # Display the selected chunks
    print("Displaying Chunks 10-15:")
    for i, chunk in enumerate(selected_chunks, start=10):
        print(f"Chunk {i}: {chunk}\n")

    # Call function to create the FAISS index and store embeddings
    create_faiss_index([pdf_file], selected_chunks)