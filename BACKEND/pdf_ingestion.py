import fitz
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

# Extract text from a PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text("text") + "\n"
    return text

# Split text into sections based on section headings (e.g., (a), (b), (1), (A), etc.)
def chunk_text_by_section(text):
    # Regular expression to match section headers like (a), (b), (1), (A)
    section_pattern = r'\([a-zA-Z0-9]+\)[\.\)]*\s+'  # Matches patterns like (a), (b), (A), (1), etc.
    chunks = []
    sections = re.split(section_pattern, text)
    
    # Add the first section as it's before the first header
    chunks.append(sections[0])
    
    # Iterate over remaining sections and add the section header back to the chunk
    section_headers = re.findall(section_pattern, text)  # Get the section headers (e.g., (a), (b), (1))
    for i, section in enumerate(sections[1:], start=1):  # Skip first chunk because it's the pre-header content
        chunk = section_headers[i-1] + section.strip()  # Attach the header to the content
        chunks.append(chunk)
    
    return chunks

# Process PDF and return text chunks
def process_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    chunks = chunk_text_by_section(text)
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i+1}:\n{chunk}\n{'='*50}\n")
    
    return chunks

if __name__ == "__main__":
    pdf_path = "./regulatory_docs/Wire Act of 1961.pdf" 
    process_pdf(pdf_path)
