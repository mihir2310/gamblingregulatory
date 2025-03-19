import tiktoken
import json
import os
import re
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

# Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Tokenizer for OpenAI
def count_tokens(text, model="gpt-3.5-turbo"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Read text from a .txt file
def extract_text_from_txt(txt_path):
    with open(txt_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

# Extract law name from file name (3rd part)
def extract_law_name_from_filename(txt_path):
    file_name = os.path.basename(txt_path)  
    law_name = file_name.split('_')[2].split('.')[0]
    return law_name  

# Extract sections properly
def chunk_text_by_section(text, law_name):
    section_pattern = r'(SEC\.\s\d+\..*?)(?=\nSEC\.|\Z)'  
    matches = re.findall(section_pattern, text, re.DOTALL)

    if not matches:
        print("⚠️ No sections found! Check the regex or input file formatting.")
        return []

    structured_data = []
    current_date = datetime.now().strftime('%Y-%m-%d')  # Dynamic date format (e.g., 2025-03-18)

    for match in matches:
        lines = match.strip().split("\n", 1)  
        if len(lines) == 2:
            section_header, section_text = lines[0].strip(), lines[1].strip()
        else:
            section_header, section_text = lines[0].strip(), ""

        structured_data.append({
            "law_name": law_name,
            "category": section_header,  
            "law_text": section_text,  
            "updated_on": current_date
        })

    return structured_data

# Process TXT file and return structured text chunks
def process_txt(txt_path):
    text = extract_text_from_txt(txt_path)
    law_name = extract_law_name_from_filename(txt_path)
    structured_laws = chunk_text_by_section(text, law_name)

    market = txt_path.split('/')[-1].split('_')[0]
    jurisdiction = txt_path.split('/')[-1].split('_')[1]
    output_json = {market: {jurisdiction: structured_laws}}
    print(json.dumps(output_json, indent=2))

    return structured_laws

if __name__ == "__main__":
    txt_path = "./regulatory_docs/dfs_federal_UIGEA.txt"
    process_txt(txt_path)