import os
from dotenv import load_dotenv
from BACKEND.law_jsonbuilder import create_faiss_index  # Import the function from embedding_storage
from query_faiss import query_faiss_index  # Import query_faiss_index

# Load environment variables
load_dotenv()

# Test query to check for Wire Act violation
def test_query_wire_act():
    # Your test query text (you can adjust this based on how your query matches violations)
    query = "We allow sports betting across state borders using wire communication facilities."

    # Specify the market type and jurisdiction to filter the laws
    market_type = "sportsbetting"  # Assuming the law relates to sports betting
    state_or_federal = "federal"  # The law is federal, so we use "Federal"

    # Query the FAISS index
    results = query_faiss_index(query, market_type=market_type, state_or_federal=state_or_federal, top_k=3)

    # Print out the results
    if results:
        for text, score in results:
            print(f"Matched Law: {text['law_name']} (Category: {text['category']})")
            print(f"Law Text: {text['law_text'][:300]}... (Score: {score})")
    else:
        print("No matching laws found.")

if __name__ == "__main__":
    test_query_wire_act()