import { updateConversation, saveConversation } from './conversation';

export async function sendMessage({
  message,
  messages,
  selectedConversation,
  setMessages,
  setMessage,
  setSelectedConversation
}) {
  const userMessage = { role: "user", content: message };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setMessage('');

  // Send the user's message to the Flask API
  const response = await fetch('http://localhost:5000/api/rag', { // Adjust the URL to your Flask server location
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: message }),
  });

  if (!response.ok) {
    console.error("Error from Flask API:", await response.json());
    return;
  }

  const data = await response.json();
  const assistantMessage = { role: "assistant", content: data.answer };

  // Update the assistant message
  const finalMessages = [...updatedMessages, assistantMessage];
  setMessages(finalMessages);

  // Save or update the conversation
  if (selectedConversation) {
    await updateConversation(selectedConversation.id, finalMessages); // Update the existing conversation
  } else {
    const docRef = await saveConversation(finalMessages); // Save a new conversation
    setSelectedConversation({ id: docRef.id, messages: finalMessages });
  }
}
