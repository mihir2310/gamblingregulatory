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

# Configure CORS with more specific settings
CORS(app, 
     resources={
         r"/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }
     })

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


STORAGE_FILE = 'storage.json'


def load_data():
    try:
        with open(STORAGE_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_data(data):
    with open(STORAGE_FILE, 'w') as f:
        json.dump(data, f)


@app.route('/documents', methods=['POST'])
def save_document():
    doc = request.json
    all_docs = load_data()
    all_docs.append(doc)
    save_data(all_docs)
    return jsonify({'message': 'saved successfully'}), 201


@app.route('/save', methods=['POST'])
def save_docs():
    content = request.json
    data = load_data()
    data['documents'] = content
    save_data(data)
    return 'Saved'


@app.route('/load', methods=['GET'])
def load():
    print('loading')
    data = load_data()
    return data


# Route to handle document upload and violation checking
@app.route('/scan-doc', methods=['POST', 'OPTIONS'])
def scan_doc():
    if request.method == 'OPTIONS':
        response = app.response_class(
            response='',
            status=200,
            mimetype='application/json'
        )
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

        # Process the uploaded file to extract the terms and document structure
        document_result = process_uploaded_file(temp_file_path)
        
        # Extract market_type and state_or_federal from the form data
        market_type = request.form.get('market_type', 'sportsbooks')
        state_or_federal = request.form.get('state_or_federal', 'federal')

        results = []
        # Only scan legal terms
        for term_entry in document_result['legal_terms']:
            term = term_entry['text']
            # Get relevant laws from AI algorithms
            relevant_laws = GETRELEVANTLAWS(term, market_type, state_or_federal)

            # Properly parse the relevant_laws before passing it to detect_violation
            if isinstance(relevant_laws, str):
                try:
                    relevant_laws = json.loads(relevant_laws)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON for term: {term}. Raw value: {relevant_laws}")
                    relevant_laws = []  # Or handle the error appropriately

            # Check for violations
            violation_results = detect_violation(term, relevant_laws)

            results.append({
                "term": term,
                "violations": violation_results,
                "document_structure": document_result['document_structure']
            })

        return jsonify(results)

    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error in the console
        return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # For now, using hardcoded credentials
        # In production, you should use proper authentication
        if username == 'admin' and password == 'admin':
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'username': username,
                    'role': 'admin'
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
