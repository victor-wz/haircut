export default class TextHistory {
    constructor(textHistory, setTextHistory) {
        this.textHistory = textHistory;
        this.setTextHistory = setTextHistory;
        this.patientId = undefined;
    }

    setPatientId(patientId) {
        this.patientId = patientId;
        // TODO: check element exists
    }
    
    append(text) {
        console.assert(this.patientId !== undefined) 
        // Use functional form to ensure batched updates don't overwrite each other
        const patientId = this.patientId;

        this.setTextHistory((prevTextHistory) => {
            const updatedTextHistory = [...prevTextHistory];
            if (updatedTextHistory[patientId] === undefined) {
                updatedTextHistory[patientId] = "";
            }
            updatedTextHistory[patientId] += text;
            return updatedTextHistory;
        }); 
    }

    startResponse() {
        this.append("<p><strong>Model: </strong>");
    }

    endResponse() {
        this.append("</p>");
    }

    startPrompt() {
        this.append("<p><strong>You: </strong>");
    }

    endPrompt() {
        this.append("</p>");
    }

    text() {
        return this.textHistory[this.patientId];
    }
  }
