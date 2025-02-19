import PyPDF2
import fitz
import tiktoken

# Get text across a certain page range
def extract_page_text(file_path, start_page_number, stop_page_number):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        total_pages = len(reader.pages)

        # Check if the requested page range is valid
        if start_page_number < 1 or stop_page_number > total_pages or start_page_number > stop_page_number:
            return f"Error: Invalid page range. The document has {total_pages} pages."

        # Extract text from the specified page range (0-indexed internally)
        extracted_text = ""
        for page_num in range(start_page_number - 1, stop_page_number):
            page = reader.pages[page_num]
            extracted_text += page.extract_text() + "\n"  # Adding newline after each page's text
        
        return extracted_text
    
# Count tokens in range.
def count_tokens_per_page(pdf_path, startPage, stopPage, model="gpt-3.5-turbo"):
    # Initialize tokenizer for the specified model
    encoding = tiktoken.encoding_for_model(model)
    count = 0
    # Read PDF
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)

        for page_number in range(startPage, stopPage+1):
            page = reader.pages[page_number]
            text = page.extract_text() or ""
            tokens = encoding.encode(text)
            count+=len(tokens)
    
    print(f"total token count in range {startPage} - {stopPage}: {count}")
    