# file_processor.py
import mammoth

def process_uploaded_file(file):
    """
    Process the uploaded .docx file, convert it to HTML, and extract terms.
    """
    if not file or not file.filename.endswith('.docx'):
        raise ValueError("Please upload a .docx file")

    print("File received:", file.filename)

    # Convert DOCX to HTML to extract the content
    doc_content = mammoth.convert_to_html(file)
    
    # Ensure that doc_content.value is properly parsed
    doc_html = doc_content.value.strip() if isinstance(doc_content.value, str) else ""
    if not doc_html:
        raise ValueError("Failed to extract content from the document")

    print("Extracted HTML content:", doc_html)

    # Split the content into terms
    terms = [term.strip() for term in doc_html.split('\n') if term.strip()]
    print("Terms extracted:", terms)

    return terms

if __name__ == "main":
    process_uploaded_file(file)