import { useState } from "react"
import './ChatBotApp.css';

const OpenAI = require("openai");

export default function ChatbotApp(props) {

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textHistoryObj = props.textHistoryObj;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Prompt: ", prompt);

    textHistoryObj.startPrompt();
    textHistoryObj.append(prompt);
    textHistoryObj.endPrompt();

    try {
      // New
      textHistoryObj.startResponse();
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt}],
        stream: true,
      });
      for await (const part of stream) {
        console.log(part.choices[0].delta);

        if (part.choices[0].delta.content) {
          textHistoryObj.append(part.choices[0].delta.content);
        }
      }
      textHistoryObj.endResponse();

      // const result = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{"role": "user", "content": "Hello!"}],
      // });
      // console.log(result.choices[0].message);
      //console.log("response", result.data.choices[0].text);
    } catch (e) {
      //console.log(e);
      textHistoryObj.appendResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };


  return (
    <>
      <div className="text-history">
        <div dangerouslySetInnerHTML={{__html: textHistoryObj.text()}}></div>
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
