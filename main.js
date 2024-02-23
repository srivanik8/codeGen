import './style.css'
import 'D:/langchain/gen/generate.css'

import { process } from './env'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});


const chatOutput = document.getElementById("chat-output");
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener("click", () => {
  const userMessage = chatInput.value;
  if (userMessage) {
    // Clear the input field
    chatInput.value = "";
    // Add user message to the chat output
    chatOutput.insertAdjacentHTML('beforeend',`<li class="user-message">${userMessage}</li>`);

    chatInput.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    fetchBotReply(userMessage)
  }
})

async function fetchBotReply(output) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "user",
        "content": `generate code for "${output}" based on the given prompt`
      },
    ],
    temperature: 0.9,
    max_tokens: 700,
  });
  const botResponse = response.choices[0].message.content;
  console.log(botResponse);
  chatOutput.insertAdjacentHTML('beforeend', `<li class="bot-message"></li>`);
  document.querySelector('.bot-message').innerText = botResponse;
}