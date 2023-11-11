class Patient:

    def __init__(self, name, id):
        self._name = name
        self._id = id
        self._notes = []

    def add_note(self, payload):
        self._notes.append(payload)


