import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from dotenv import load_dotenv
import mammoth

# Add the parent directory to the system path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)

# Import from AI_ALGORITHMS after adding the path
from AI_ALGORITHMS.query_faiss import GETRELEVANTLAWS
from AI_ALGORITHMS.status_checker import detect_violation  # Not yet used

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # To allow cross-origin requests from the frontend

# Route to handle document upload and violation checking
@app.route('/scan-doc', methods=['POST'])
def scan_doc():
    try:
        # Get the uploaded file from the request
        file = request.files.get('file')
        if not file or not file.filename.endswith('.docx'):
            return jsonify({"error": "Please upload a .docx file"}), 400

        print("File received:", file.filename)  # Check if file is correctly received

        # Convert DOCX to HTML to extract the content
        doc_content = mammoth.convert_to_html(file)
        
        # Check if doc_content.value is properly parsed
        doc_html = doc_content.value.strip() if isinstance(doc_content.value, str) else ""
        if not doc_html:
            return jsonify({"error": "Failed to extract content from the document"}), 400

        print("Extracted HTML content:", doc_html)  # Debugging line

        # Ensure that the doc_html is properly split into terms and then processed
        terms = [term.strip() for term in doc_html.split('\n') if term.strip()]
        print("Terms extracted:", terms)  # Debugging line

        results = []
        for term in terms:
            market_type = request.form.get('market_type', 'sportsbooks')
            state_or_federal = request.form.get('state_or_federal', 'federal')

            # Get relevant laws from AI algorithms
            relevant_laws = GETRELEVANTLAWS(term, market_type, state_or_federal)
            print(f"Relevant laws for '{term}':", relevant_laws)  # Added Debugging

            # Properly parse the relevant_laws before passing it to detect_violation
            if isinstance(relevant_laws, str):
                relevant_laws = json.loads(relevant_laws)

            # Temporarily skip violation detection
            violation_results = detect_violation(term, relevant_laws)

            results.append({
                "term": term,
                "relevant_laws": relevant_laws,  # Updated to show retrieved laws only
                "violations": violation_results
            })

        return jsonify(results)

    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error in the console
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
