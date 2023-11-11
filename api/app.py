from flask import Flask, jsonify, request
from flask_cors import CORS
from haircut import agent, transcribe

app = Flask(__name__)
CORS(app)
oai_agent = agent.Agent()
oai_transcriber =  transcribe.Transcriber()

@app.route('/api/data')
def get_data():
    return {"a": 5}

@app.route('/api/patient/text_payload')
def text_payload():
    data = request.get_json()
    patient_id = data['patient_id']
    text = data['text']
    ag_res = ag.process_text_payload(patient_id, text)
    return jsonify(ag_res)

@app.route('/api/patient/audio_payload', methods=['POST'])
def audio_payload():
    # Transcribe audio and pass as text payload.
    if 'audio' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    audio_file = request.files['audio']
    transcript = oai_transcriber.transcribe(audio_file)
    return text_payload(transcript)

    
    

if __name__ == '__main__':
    app.run(debug=True)

