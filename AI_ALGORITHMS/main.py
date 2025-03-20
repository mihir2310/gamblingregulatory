import os
from dotenv import load_dotenv
from query_faiss import GETRELEVANTLAWS
from status_checker import detect_violation
import json

with open("/Users/mihirsavkar/Desktop/gamblingregulatory/AI_ALGORITHMS/query_results.json", "r") as file:
    res = json.load(file)

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    query = "Everything contained in this section shall create immunity from criminal prosecution under any laws of any State"
    market_type = "sportsbooks"
    state_or_federal = "federal"

    # Relevant embeddings retrieved -> res
    # res = GETRELEVANTLAWS(query, market_type, state_or_federal)

    # Returns the JSON object containing the model's interpretation of the violation status of the query
    results = detect_violation(query, res)

    # Save results to a JSON file
    output_path = "./violation_query_results/violation_report_test.json"
    with open(output_path, "w") as output_file:
        json.dump(results, output_file, indent=4)

    print(f"Violation report successfully saved to '{output_path}'")
