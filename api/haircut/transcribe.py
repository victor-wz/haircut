from openai import OpenAI
import os

class Transcriber:
    
	def __init__(self):
		api_key = os.environ.get("REACT_APP_OPENAI_API_KEY")
		self._client = OpenAI(api_key=api_key)
	
	def transcribe(self, audio_file):
		# Save the audio file to a temporary location
		temp_path = 'temp.wav'
		audio_file.save(temp_path)
		file = open(temp_path, "rb")
		transcript = self._client.audio.transcriptions.create(
			model="whisper-1", 
			file=file
		)
		return transcript.text