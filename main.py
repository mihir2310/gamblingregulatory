from openai import OpenAI
import fitz

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

if __name__ == "__main__":
    compliance_text = extract_text_from_pdf("gambling_laws/sportsbettingregulations.pdf")
    print(compliance_text[:500])

