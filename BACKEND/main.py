import os
from flask import Flask, request, jsonify
import openai
from openai import OpenAI
from PDFScraping import extract_page_text
from dotenv import load_dotenv
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import sklearn

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Load OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Get the embedding of this text
def get_embedding(text, model="text-embedding-ada-002"):
    client = OpenAI()
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

# Route to process document and get compliance feedback
@app.route('/api/process_document', methods=['POST'])
def process_document():
    try:
        # Get file path and page range from the request
        file_path = request.json.get('file_path')
        start_page = request.json.get('start_page', 1)
        end_page = request.json.get('end_page', 1)

        # Extract text from the specified pages
        text = extract_page_text(file_path, start_page, end_page)
        
        if text.startswith("Error"):
            return jsonify({"error": text}), 400

        # Query OpenAI for compliance checking
        compliance_feedback = check_compliance_with_openai(text)

        # Return the compliance feedback
        return jsonify({"compliance_feedback": compliance_feedback}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to send text to OpenAI for compliance analysis
def check_compliance_with_openai(text):
    try:
        # OpenAI API Request for compliance checking
        prompt = f"Please review the following text and identify any compliance issues with federal/state gambling regulations:\n\n{text}"
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=1500,
            temperature=0.5,
        )

        # Parse OpenAI's response
        compliance_feedback = response.choices[0].text.strip()
        return compliance_feedback

    except Exception as e:
        return f"Error: {str(e)}"


# Function to calculate cosine similarity between two texts
def calculate_cosine_similarity(text1, text2, model="text-embedding-ada-002"):
    # Get embeddings for both texts
    embedding1 = np.array(get_embedding(text1)).reshape(1, -1)
    embedding2 = np.array(get_embedding(text2)).reshape(1, -1)

    # Calculate cosine similarity between the embeddings
    similarity = cosine_similarity(embedding1, embedding2)
    return similarity[0][0]


if __name__ == "__main__":
    # Example usage with two sample texts
    text1 = "This is a sample text for embedding"
    text2 = "This is a different but somewhat related text."

    # Calculate and print cosine similarity
    similarity = calculate_cosine_similarity(text1, text2)
    print(f"Cosine similarity between the texts: {similarity}")

    # Example: Embedding and printing an individual text
    embedding = get_embedding(text1)
    print(f"Embedding for text1: {embedding}")
