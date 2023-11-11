from openai import OpenAI
API_KEY = "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"

class Transcriber:
    
	def __init__(self):
		self._client = OpenAI(api_key=API_KEY)
	
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