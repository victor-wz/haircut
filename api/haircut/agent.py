class Agent:

	def __init__(self) -> None:
		self._patients = {}

	def add_patient(self, patient_id: int) -> None:
		# TODO: Create thread for patient and keep track of it.
		if patient_id in self._patients:
			raise RuntimeError("Patient with this id already exists")
		self._patients[patient_id] = None

	def process_text_payload(self, patient_id: int, text: str) -> str:
		if patient_id not in self._patients:
			self.add_patient(patient_id)
		
		# TODO: Make query to OpenAI API
		return "Payload processed"