from openai import OpenAI
from APIRequests import question_request
from PDFScraping import extract_page_text, count_tokens_per_page
import PyPDF2
import fitz


if __name__ == "__main__":

    # #Sample text-scraping Query
    # compliance_text = extract_page_text("gambling_laws/sportsbettingregulations.pdf", 353, 364)
    # print(compliance_text)

    # # Sample OPENAI API Request
    # req = question_request("What is the capital of China?")
    # print(req)


