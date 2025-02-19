from openai import OpenAI
import PyPDF2
import tiktoken
from dotenv import load_dotenv
import os

# Set up dot_env (need to get openai api key) and set up client
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

# General Question Request
def question_request(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# Ingest information
def ingest_information():
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "You need to completely make full sense of the information on this page and"}]
    )
    return response.choices[0].message.content.strip()
    