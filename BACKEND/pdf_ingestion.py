import fitz  # PyMuPDF
import tiktoken
import json
import os
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

# Split text into chunks (Ensuring OpenAI token limits)
def chunk_text(text, max_tokens=750):
    words = text.split()
    chunks = []
    current_chunk = []
    current_tokens = 0

    for word in words:
        word_tokens = count_tokens(word)
        if current_tokens + word_tokens > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_tokens = 0
        current_chunk.append(word)
        current_tokens += word_tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks

# Process PDF and return text chunks
def process_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    return chunk_text(text)

