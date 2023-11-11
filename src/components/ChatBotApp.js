import { useState } from "react"
import './ChatBotApp.css';

const OpenAI = require("openai");

const ChatbotApp = () => {

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [prompt, setPrompt] = useState("");
  const [textHistory, setTextHistory] = useState("");
  const [loading, setLoading] = useState(false);

  function appendResponse(text) {
    setTextHistory(textHistory + "<p><strong>Model: </strong>" + text + "</p>");
  }

  function appendPrompt(text) {
    setTextHistory(textHistory + "<p><strong>You: </strong>" + text + "</p>");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Prompt: ", prompt);
    appendPrompt(prompt);

    var response = "";

    try {
      // New
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt}],
        stream: true,
      });
      for await (const part of stream) {
        console.log(part.choices[0].delta);

        if (part.choices[0].delta.content) {
          response += part.choices[0].delta.content;
          appendResponse(response);
        }
      }
      // const result = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{"role": "user", "content": "Hello!"}],
      // });
      // console.log(result.choices[0].message);
      //console.log("response", result.data.choices[0].text);
    } catch (e) {
      //console.log(e);
      appendResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };


  return (
    <>
      <div className="text-history">
        <div dangerouslySetInnerHTML={{__html: textHistory}}></div>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={prompt}
            placeholder="Please ask to openai"
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            disabled={loading || prompt.length === 0}
            type="submit"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>
      
    </>
  );
};


export default ChatbotApp;