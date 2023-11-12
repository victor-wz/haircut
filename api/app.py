from flask import Flask, jsonify, request
from flask_cors import CORS
import time
from flask_socketio import SocketIO
from haircut.agent import Agent
from haircut.transcribe import Transcriber
import os

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")
oai_agent = Agent()
oai_transcriber = Transcriber()
allowed_extensions=['.txt', '.csv']

@socketio.on('connect')
def handle_connect():
    print('Client connected')

def mock_streaming(text):
    # Beause openai are gimps.
    for word in text.split(" "):
        socketio.emit('update_output', {'partial_result': word})
        time.sleep(0.05)

@app.route('/api/patient/text_payload', methods=['POST'])
def text_payload():
    data = request.get_json()
    patient_id = data['patient_id']
    text = data['text']
    dir = 'examples/patient-'+ str(patient_id) # get folder associated to patient
    if os.path.isdir(dir):
        patient_data = [os.path.join(dir,file) for file in os.listdir(dir) if file.endswith(tuple(allowed_extensions))]
    else:
        patient_data = None
    ag_res = oai_agent.process_text_payload(int(patient_id), text,patient_data)
    mock_streaming(ag_res)
    return jsonify(ag_res)


@app.route('/api/patient/audio_payload', methods=['POST'])
def audio_payload():
    if 'audio' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    audio_file = request.files['audio']
    patient_id = request.form.get('patient_id')
    transcript = oai_transcriber.transcribe(audio_file)
    #print(transcript)
    mock_streaming("</p><p><strong>You:</strong> " + transcript)
    ag_res = oai_agent.process_text_payload(int(patient_id), transcript)
    mock_streaming("</p><p><strong>Sephora:</strong> " + ag_res)
    return jsonify({"response":ag_res,"transcript":transcript})

@app.route('/api/patient/summary', methods=['POST'])
def summary():
    data = request.get_json()
    patient_id = data['patient_id']
    values = data['values']
    summary_prompt = "Summarize the patient data in a html list with the fields " + values 
    ag_res = oai_agent.process_text_payload(patient_id, summary_prompt)
    return {"summary":ag_res}

if __name__ == '__main__':
    socketio.run(debug=True)

