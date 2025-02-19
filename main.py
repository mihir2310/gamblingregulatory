from openai import OpenAI
from APIRequests import question_request
import PyPDF2
import fitz

def extract_page_text(file_path, page_number):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        total_pages = len(reader.pages)

        # Check if the requested page exists
        if page_number < 1 or page_number > total_pages:
            return f"Error: Page number {page_number} is out of range. The document has {total_pages} pages."

        # Extract text from the specified page (0-indexed internally)
        page = reader.pages[page_number - 1]
        return page.extract_text()


if __name__ == "__main__":
    compliance_text = extract_page_text("gambling_laws/sportsbettingregulations.pdf", 353)

    #virginia_text = compliance_text
    # response = question_request("What is the capital of France?")
    # print(response)

    print(compliance_text)


