export default class TextHistory {
    constructor(textHistory, setTextHistory) {
        this.textHistory = textHistory;
        this.setTextHistory = setTextHistory;
    }
    
    append(text) {
        // Use functional form to ensure batched updates don't overwrite each other
        // this.setTextHistory(this.textHistory + text); // WRONG
        this.setTextHistory(textHistory => textHistory + text);
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
        return this.textHistory;
    }
  }
