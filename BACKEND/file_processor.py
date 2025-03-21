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
    Process the uploaded .docx file, convert it to HTML, and extract terms, excluding non-relevant content.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    print("File received:", file_path)

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

    # Extract and return text chunks separated by newlines (or whitespace lines), excluding non-legal content
    legal_terms = []

    for para in paragraphs:
        text = para.get_text().strip()

        # Skip non-legal content (titles, intro sections, etc.)
        if not text or "terms and conditions" in text.lower():  # Filter out the title
            continue

        # Optional: Add more filtering based on legal patterns (e.g., "must," "shall," etc.)
        if any(phrase in text.lower() for phrase in ["must", "shall", "agree", "comply", "restricted", "abide", "prohibited", "only"]):  # Extended filtering criteria
            legal_terms.append(text)

    return legal_terms


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
