import os
import json
import re
import PyPDF2
import fitz
import tiktoken
from extract_text_and_tokens import extract_page_text, count_tokens_per_page

# Placeholder function to determine market type, jurisdiction, and law from document text
def parse_legal_document(text):
    # Custom logic to parse the document (market type, jurisdiction, law, etc.)
    market_type = "Sports Gambling"
    jurisdiction = "United States"
    law_name = "UIGEA"
    
    # Placeholder logic for extracting law texts (you can refine this)
    law_texts = re.findall(r"(?<=\d\.\s)[\w\W]+?(?=\n\d\.)", text)
    
    return {
        "market_type": market_type,
        "jurisdiction": jurisdiction,
        "law": law_name,
        "text": law_texts
    }

# Function to build the legal data JSON from PDFs
def build_legal_data_from_pdfs(pdf_directory):
    legal_data = {}

    for pdf_file in os.listdir(pdf_directory):
        if pdf_file.endswith(".pdf"):
            pdf_path = os.path.join(pdf_directory, pdf_file)
            
            # Example: Extracting text from the first 3 pages (or modify as needed)
            text = extract_page_text(pdf_path, 1, 3)
            
            # Count tokens to check for document size
            count_tokens_per_page(pdf_path, 1, 3)
            
            # Parse the extracted text and organize it into the legal data structure
            parsed_data = parse_legal_document(text)
            market_type = parsed_data["market_type"]
            jurisdiction = parsed_data["jurisdiction"]
            law = parsed_data["law"]
            law_texts = parsed_data["text"]
            
            # Build the JSON structure
            if market_type not in legal_data:
                legal_data[market_type] = {}
            
            if jurisdiction not in legal_data[market_type]:
                legal_data[market_type][jurisdiction] = {}
            
            if law not in legal_data[market_type][jurisdiction]:
                legal_data[market_type][jurisdiction][law] = []

            legal_data[market_type][jurisdiction][law].extend(law_texts)
    
    # Save the final legal data as a JSON file
    with open("legal_data.json", "w") as json_file:
        json.dump(legal_data, json_file, indent=4)

    print("Legal data JSON file has been generated.")

# Example usage
pdf_directory = "./legal_documents"  # Directory where your PDFs are stored
build_legal_data_from_pdfs(pdf_directory)
