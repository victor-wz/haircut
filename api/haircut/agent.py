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
		description="You log medical notes and answer questions about them",
		instructions="When I give you a statement about medical notes of a patient, you remember them and reply with one word: Noted."
		 +"Otherwise if I ask you a question, you answer the question."
		 +"When I ask for you to summarise the patient notes you succintly summarise the information contained in all of the files you have been given.",
		model="gpt-4-1106-preview",
		tools=[{"type": "retrieval"}],
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

	def add_message(self,thread_id,message,patient_history=None):
		# add new message, message is just text
		# thread_id is id corresponding to patient

		new_message = self.client.beta.threads.messages.create(thread_id=thread_id,
													role="user",
													content=message,
													#file_ids=[file.id],

)
		return None
	
	def run(self,thread_id):

		run = self.client.beta.threads.runs.create(
			thread_id=thread_id,
			assistant_id=self.assistant.id,
			instructions="When I give you a statement about medical notes of a patient, you remember them and reply with one word: Noted."
			 +"Otherwise if I ask you a question, you answer the question."
			  +"If I ask you to request a medical procedure, such as an xray, mri etc. then add `Requesting <procedure> !!!<procedure>!!!` to your response. You should infer details of the procedure (e.g. body part) from context where possible, and ask for confirmation before adding the procedure to your response. \n"
			  +"If I ask you to request a medicine or order a prescription for a drug, you should suggest a suitable "
			  +"drug to prescribe (taking into account any patient allergies) if I do not specify, and ask me for confirmation. "
			  + "if I confirm, you should add `Requesting ???<drug>???` to your response."

			#    +"Your response will at most be 30 words long so be concise."
			)
		
		completed = False

		# bad code to make sure that we don't try to print messages until code has fully run
		while not completed:
			status = self.client.beta.threads.runs.retrieve(
			  thread_id=thread_id,
			  run_id=run.id,
			  ).status
			if status == 'completed':
				completed = True

		messages = self.client.beta.threads.messages.list(
			thread_id=thread_id
			)
		
		return messages.data[0].content[0].text.value


	def process_text_payload(self, patient_id: int, text: str, patient_history=None) -> str:
		# patient history is list of paths to files
		if patient_id not in self._patients:
			# create thread and add first message if new patient
			# can i just print "loading dataset for patient x here"
			self.add_patient(patient_id, first_message=text,patient_history=patient_history)
		else:
			# add information to thread
			self.add_message(self._patients[patient_id],message=text,patient_history=patient_history)

		return self.run(self._patients[patient_id])