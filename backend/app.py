from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_model import perform_rag  # Import your RAG function
from title_generator import generate_title_from_answer  # Import the title generator
import logging
import os

# Set up basic configuration for logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://ai-customer-support-three-phi.vercel.app"}})  # Allow only requests from your Vercel domain

@app.route('/api/rag', methods=['POST'])
def rag_endpoint():
    data = request.json
    query = data.get('query', '')
    generate_title = data.get('generate_title')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        result = perform_rag(query)
        if generate_title:
            title = generate_title_from_answer(result['answer'])
            result['title'] = title
            print(result['title'])

        
        print(f"Returning result: {result}")  # For debugging
        return jsonify(result)
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # For debugging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use the PORT environment variable or default to 5000
    app.run(host='0.0.0.0', port=port)
