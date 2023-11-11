from flask import Flask, jsonify, request
from flask_cors import CORS
from haircut.agent import Agent
from haircut.transcribe import Transcriber

app = Flask(__name__)
CORS(app)
oai_agent = Agent()
oai_transcriber = Transcriber()

@app.route('/api/patient/text_payload')
def text_payload():
    data = request.get_json()
    patient_id = data['patient_id']
    text = data['text']
    ag_res = oai_agent.process_text_payload(patient_id, text)
    return jsonify(ag_res)

@app.route('/api/patient/audio_payload', methods=['POST'])
def audio_payload():
    if 'audio' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    audio_file = request.files['audio']
    transcript = oai_transcriber.transcribe(audio_file)
    # TODO: patient id.
    ag_res = oai_agent.process_text_payload(0, transcript)
    return jsonify(ag_res)

if __name__ == '__main__':
    app.run(debug=True)

