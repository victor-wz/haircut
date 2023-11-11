from openai import OpenAI
API_KEY = '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'

class Transcriber:
    
	def __init__(self):
		self._client = OpenAI(API_KEY)
	
	def transcribe(self, audio_file):
		transcript = self._client.audio.transcriptions.create(
			model="whisper-1", 
			file=audio_file
		)
		return transcript