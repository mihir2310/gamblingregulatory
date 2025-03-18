import os
from dotenv import load_dotenv
from query_faiss import GETRELEVANTLAWS
import json

# Load environment variables
load_dotenv()


if __name__ == "__main__":
    query = "We are conducting illegal sports betting across multiple states, state prosecution and grants us full immunity, full immunity."    
    market_type="sportsbooks"
    state_or_federal="federal"

    GETRELEVANTLAWS(query, market_type, state_or_federal)