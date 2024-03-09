import './style.css'
import '/workspaces/codeGen/generate.css'

import { process } from './env'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});




const chatOutput = document.getElementById("chat-output");
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const container = document.querySelector('.chat-input-container')

sendButton.addEventListener("click", () => {
  container.classList.toggle("hidden");
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
        "content": `generate code for "${output}" based on the given prompt if and only if there is coding language specified else 
        tell that it is an irrelevant question
        ###
        output: Implement a Bidirectional Long Short-Term Memory (BiLSTM) model in Python for sentiment analysis 
        of movie reviews, considering both positive and negative sentiment with an F1-score of over 0.85.
        message: import tensorflow as tf
        from tensorflow.keras.preprocessing.text import Tokenizer
        from tensorflow.keras.preprocessing.sequence import pad_sequences
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Embedding, LSTM, Bidirectional, Dense
        
        # Load and preprocess data
        data = ...  # Load movie reviews and labels
        tokenizer = Tokenizer(num_words=5000)
        tokenizer.fit_on_texts(data)
        sequences = tokenizer.texts_to_sequences(data)
        padded = pad_sequences(sequences, maxlen=200)
        
        labels = ...  # Convert labels to binary (positive/negative)
        
        # Build and train BiLSTM model
        model = Sequential([
            Embedding(5000, 128, input_length=200),
            Bidirectional(LSTM(64, return_sequences=True)),
            Bidirectional(LSTM(32)),
            Dense(1, activation='sigmoid')
        ])
        
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy', 'f1'])
        model.fit(padded, labels, epochs=10)
        
        # Evaluate model performance
        test_loss, test_acc, test_f1 = model.evaluate(padded_test, labels_test)
        print('Test F1-score:', test_f1)  # Should be above 0.85
        ###
        
        


        `
      },
    ],
    temperature: 0.9,
    max_tokens: 800,
  });
  const botResponse = response.choices[0].message.content;
  console.log(botResponse);
  chatOutput.insertAdjacentHTML('beforeend', `<li class="bot-message"></li><button id="copy-button">Copy</button>`);
  document.querySelector('.bot-message').innerText = botResponse;

  //////////////

  const copyButton = document.getElementById("copy-button");

copyButton.addEventListener("click", function() {
  const botResponse = response.choices[0].message.content;
  console.log(botResponse);
  navigator.clipboard.writeText(botResponse)
  .then(() => {
    alert("Text copied successfully!");
  })
});

}



