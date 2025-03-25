import os
from bs4 import BeautifulSoup
from pdf2docx import Converter
import mammoth
import re

def convert_pdf_to_docx(pdf_path):
    """
    Convert a PDF file to DOCX format using pdf2docx.
    """
    docx_path = pdf_path.replace(".pdf", ".docx")
    cv = Converter(pdf_path)
    cv.convert(docx_path, start=0, end=None)
    cv.close()
    return docx_path

def process_uploaded_file(file_path):
    """
    Process the uploaded file (DOCX or PDF), convert to DOCX if it's a PDF, 
    convert to HTML, and extract terms, preserving document structure.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    print("File received:", file_path)

    # Check if file is PDF or DOCX
    if file_path.lower().endswith(".pdf"):
        print("File is PDF, converting to DOCX...")
        file_path = convert_pdf_to_docx(file_path)
        print(f"PDF converted to DOCX: {file_path}")

    # Open file in binary mode
    with open(file_path, "rb") as file:
        doc_content = mammoth.convert_to_html(file)

    # Ensure that doc_content.value is properly parsed
    doc_html = doc_content.value.strip() if isinstance(doc_content.value, str) else ""
    if not doc_html:
        raise ValueError("Failed to extract content from the document")

    print("Extracted HTML content:", doc_html)

    # Use BeautifulSoup to parse the HTML and extract paragraphs
    soup = BeautifulSoup(doc_html, "html.parser")
    paragraphs = soup.find_all("p")

    # Legal keywords and phrases for identifying potential legal terms
    legal_keywords = ["must", "shall", "agree", "comply", "restricted", "prohibited", "limited", "jurisdiction", "obligation"]
    legal_phrases = ["users in the", "subject to", "limited to", "restricted to", "must comply with"]

    # Prepare result arrays
    legal_terms = []
    document_structure = []

    for para in paragraphs:
        text = para.get_text().strip()

        # Skip completely empty paragraphs
        if not text:
            continue

        # Determine if the paragraph is a legal term
        is_legal_term = (
            any(phrase in text.lower() for phrase in legal_keywords) or 
            any(phrase in text.lower() for phrase in legal_phrases)
        )

        # Prepare the paragraph entry
        para_entry = {
            "text": text,
            "is_legal_term": is_legal_term
        }

        # If it's a legal term, add to legal terms
        if is_legal_term:
            legal_terms.append(para_entry)

        # Add to document structure
        document_structure.append(para_entry)

    return {
        "legal_terms": legal_terms,
        "document_structure": document_structure
    }


if __name__ == "__main__":
    file_path = "test_t&c_s/sample_terms_conditions.docx"

    if os.path.exists(file_path):
        result = process_uploaded_file(file_path)
        
        print("Legal Terms:")
        for term in result['legal_terms']:
            print(term['text'])
            print()
        
        print("\nFull Document Structure:")
        for para in result['document_structure']:
            print(f"{'[LEGAL]' if para['is_legal_term'] else '[REGULAR]'} {para['text']}")
        
        print("\nNumber of legal terms: ", len(result['legal_terms']))
    else:
        print(f"Error: The file {file_path} does not exist.")
