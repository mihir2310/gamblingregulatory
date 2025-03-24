import mammoth
import os
from bs4 import BeautifulSoup
from pdf2docx import Converter

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
    convert to HTML, and extract terms, excluding non-relevant content.
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
    print(soup.prettify())
    paragraphs = soup.find_all("p")

    # Extract and return text chunks separated by newlines (or whitespace lines), excluding non-legal content
    terms = []


    for para in paragraphs:
        text = para.get_text().strip()

        # Skip non-legal content (titles, intro sections, etc.)
        if not text or "terms and conditions" in text.lower():  # Filter out the title
            terms.append({
                "content": text,
                "type": "nonlegal"
            })

        # Optional: Expand the list of filtering keywords based on legal patterns
        legal_keywords = ["must", "shall", "agree", "comply", "restricted", "prohibited", "limited", "jurisdiction", "obligation"]
        legal_phrases = ["users in the", "subject to", "limited to", "restricted to", "must comply with"]

        # Check for specific legal language patterns
        if any(phrase in text.lower() for phrase in legal_keywords) or any(phrase in text.lower() for phrase in legal_phrases):
            terms.append({
                "content": text,
                "type": "legal"
            })

    return terms


if __name__ == "__main__":
    file_path = "test_t&c_s/sample_terms_conditions.docx"

    if os.path.exists(file_path):
        terms = process_uploaded_file(file_path)
        print('-----------------------------------')
        for term in terms:
            print(term)
            print()
        print("Number of terms: ",len(terms))
    else:
        print(f"Error: The file {file_path} does not exist.")
