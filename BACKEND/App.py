import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from dotenv import load_dotenv
import tempfile

# Add the parent directory to the system path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)

# Import from AI_ALGORITHMS after adding the path
from AI_ALGORITHMS.query_faiss import GETRELEVANTLAWS
from AI_ALGORITHMS.status_checker import detect_violation  

from BACKEND.file_processor import process_uploaded_file


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/scan-doc": {"origins": "http://localhost:5173"}})

# Route to handle document upload and violation checking
@app.route('/scan-doc', methods=['POST', 'OPTIONS'])  # Allow OPTIONS method
def scan_doc():
    if request.method == 'OPTIONS':
        response = app.response_class(
            response='',
            status=200,
            mimetype='application/json'
        )
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    try:
        # Check if the request has the 'file' part
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        # Get the uploaded file from the request
        file = request.files['file']
        if not file or not file.filename.endswith('.docx'):
            return jsonify({"error": "Please upload a .docx file"}), 400

        print("File received:", file.filename)  # Check if file is correctly received

        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        # Process the uploaded file to extract the terms
        terms = process_uploaded_file(temp_file_path)
        if not terms:
            return jsonify({"error": "Failed to extract terms from the document"}), 400

        print("Terms extracted:", terms)  # Debugging line

        # Extract market_type and state_or_federal from the form data
        market_type = request.form.get('market_type', 'sportsbooks')
        state_or_federal = request.form.get('state_or_federal', 'federal')

        results = []
        for term in terms:

            # Get relevant laws from AI algorithms
            relevant_laws = GETRELEVANTLAWS(term, market_type, state_or_federal)

            # Properly parse the relevant_laws before passing it to detect_violation
            if isinstance(relevant_laws, str):
                try:
                    relevant_laws = json.loads(relevant_laws)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON for term: {term}.  Raw value: {relevant_laws}")
                    relevant_laws = []  # Or handle the error appropriately

            # Check for violations
            violation_results = detect_violation(term, relevant_laws)

            results.append({
                "term": term,
                "violations": violation_results
            })

        return jsonify(results)

    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error in the console
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
