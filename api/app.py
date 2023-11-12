from flask import Flask, jsonify, request
from flask_cors import CORS
import time
from flask_socketio import SocketIO
from haircut.agent import Agent
from haircut.transcribe import Transcriber

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")
oai_agent = Agent()
oai_transcriber = Transcriber()

@socketio.on('connect')
def handle_connect():
    print('Client connected')

def mock_streaming(text):
    # Beause openai are gimps.
    for word in text.split(" "):
        socketio.emit('update_output', {'partial_result': word})
        time.sleep(0.3)

@app.route('/api/patient/text_payload', methods=['POST'])
def text_payload():
    data = request.get_json()
    patient_id = data['patient_id']
    text = data['text']
    ag_res = oai_agent.process_text_payload(int(patient_id), text)
    mock_streaming(ag_res)
    return jsonify(ag_res)

@app.route('/api/patient/audio_payload', methods=['POST'])
def audio_payload():
    if 'audio' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    audio_file = request.files['audio']
    patient_id = request.form.get('patient_id')
    transcript = oai_transcriber.transcribe(audio_file)
    ag_res = oai_agent.process_text_payload(int(patient_id), transcript)
    mock_streaming(ag_res)
    return jsonify(ag_res)

if __name__ == '__main__':
    socketio.run(debug=True)

