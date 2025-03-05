# extract_text_and_tokens.py
import PyPDF2
import docx
import tiktoken

# Function to extract text from a PDF file
def extract_page_text(pdf_file_path):
    text = []
    with open(pdf_file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text.append(page.extract_text())
    return '\n'.join(text)

# Function to extract text from a DOCX file
def extract_docx_text(docx_file_path):
    doc = docx.Document(docx_file_path)
    return '\n'.join([para.text for para in doc.paragraphs])

# Function to count tokens using OpenAI's tokenization (adjust tokenization method if needed)
def count_tokens_per_page(text, model="text-embedding-ada-002"):
    enc = tiktoken.get_encoding(model)
    return len(enc.encode(text))
