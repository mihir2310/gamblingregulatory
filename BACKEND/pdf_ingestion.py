import tiktoken
import json
import os
import re
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
    with open(txt_path, 'r') as file:
        text = file.read()
    return text

# Split text into sections and subsections based on SEC. xxx. and SEC. xxx(a), SEC. xxx(b) patterns
def chunk_text_by_section_and_subsection(text):
    # Regex pattern for sections like SEC. 101., SEC. 102., etc. and subsections like SEC. 101(a), SEC. 101(b)
    section_pattern = r'(SEC\.\s+\d+(\([\w\+\-]+\))?\.)'
    chunks = []
    
    # Split text based on the section pattern
    sections = re.split(section_pattern, text)
    
    # Check if sections list has odd length (because re.split includes empty elements)
    if len(sections) % 2 == 0:
        sections.append('')  # Add an empty string to maintain pairing
    
    # Iterate over the sections and group them into chunks
    for i in range(1, len(sections), 2):  # Start from index 1 because section headers are at odd indexes
        section_header = sections[i] if sections[i] else ""  # Section header like "SEC. 101."
        section_body = sections[i + 1] if (i + 1 < len(sections) and sections[i + 1]) else ""  # Prevent None

        # Check if section_header or section_body is None or empty, and skip it if so
        if section_header:
            section_header = section_header.strip()  # Clean section header
        
        if section_body:
            section_body = section_body.strip()  # Clean section body
        
        # Only proceed if there's actual content in the section
        if section_header and section_body:
            chunk = section_header + "\n" + section_body
            chunks.append(chunk)

    return chunks

# Process TXT file and return text chunks
def process_txt(txt_path):
    text = extract_text_from_txt(txt_path)
    chunks = chunk_text_by_section_and_subsection(text)
    
    # Print all chunks to the console
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i+1}:\n{chunk}\n{'='*50}\n")
    
    print(f"Total Chunks Processed: {len(chunks)}")  # Show the number of chunks
    
    return chunks

if __name__ == "__main__":
    txt_path = "./regulatory_docs/prediction-markets_federal_UIGEA.txt"  # Path to the UIGEA TXT file
    process_txt(txt_path)