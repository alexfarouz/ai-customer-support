from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_model import perform_rag  # Import your RAG function

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for development

@app.route('/api/rag', methods=['POST'])
def rag_endpoint():
    data = request.json
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        answer = perform_rag(query)  # Call your RAG function here
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
