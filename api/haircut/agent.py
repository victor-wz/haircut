from openai import OpenAI
import os


class Agent:

	def __init__(self) -> None:
		self._patients = {}

		self.API_KEY = os.environ.get("REACT_APP_OPENAI_API_KEY")
		self.client = OpenAI(api_key=self.API_KEY)

		# initialise assistant
		self.assistant = self.client.beta.assistants.create(
		name="Medical assistant",
		description='You are great at logging medical notes for each patient each time I give you a message.' +
   		'When the most recent message is a statement, only repeat what the message was.' +
  		"When asked a question about the patient's medical history, you respond by answering the question.",
		model="gpt-4-1106-preview",
		tools=[{"type": "code_interpreter"}],
)

	def add_patient(self, patient_id: int,first_message,patient_history=None) -> None:
		if patient_id in self._patients:
			raise RuntimeError("Patient with this id already exists")
		self._patients[patient_id] = None
		self._patients[patient_id] = self.create_thread(first_message,patient_history) # add thread id to dictionary
	
	def create_thread(self, first_message, patient_history=None):
		# patient history is list of files that you want
		# returns id of thread created  
		
		messages=[
			{
				"role": "user",
				"content": first_message,
			}
			]
				
		if patient_history:
			files = [self.client.files.create(
				file=open(file_name, "rb"),
				purpose='assistants') for file_name in patient_history] 
			file_ids = [file.id for file in files]
			messages[0]["file_ids"]=file_ids

		thread = self.client.beta.threads.create(messages=messages)

		return thread.id

	def add_message(self,thread_id,message):
		# add new message, message is just text
		# thread_id is id corresponding to patient
		new_message = self.client.beta.threads.messages.create(thread_id=thread_id,
													role="user",
													content=message
)
		return None
	
	def run(self,thread_id):

		run = self.client.beta.threads.runs.create(
			thread_id=thread_id,
			assistant_id=self.assistant.id
			)
		
		completed = False

		# bad code to make sure that we don't try to print messages until code has fully run
		while not completed:
			status = self.client.beta.threads.runs.retrieve(
			  thread_id=thread_id,
			  run_id=run.id
			  ).status
			if status == 'completed':
				completed = True

		messages = self.client.beta.threads.messages.list(
			thread_id=thread_id
			)
		
		return messages.data[0].content[0].text.value


	def process_text_payload(self, patient_id: int, text: str, patient_history=None) -> str:
		if patient_id not in self._patients:
			# create thread and add first message if new patient
			self.add_patient(patient_id, first_message=text,patient_history=patient_history)
		else:
			# add information to thread
			self.add_message(self._patients[patient_id],message=text)

		return self.run(self._patients[patient_id])