import { saveConversation, updateConversation } from './conversation';

export async function sendMessage({
  message,
  messages,
  selectedConversation,
  setMessages,
  setMessage,
  setSelectedConversation,
  userId,
}) {
  const userMessage = { role: "user", content: message };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setMessage('');

  // Simulate sending the message to an AI API
  const response = await fetch('http://localhost:5000/api/rag', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: message }),
  });

  if (!response.ok) {
    console.error("Error from AI API:", await response.json());
    return;
  }

  const data = await response.json();
  const assistantMessage = { role: "assistant", content: data.answer };

  const finalMessages = [...updatedMessages, assistantMessage];
  setMessages(finalMessages);

  // Save or update the conversation in the user's collection
  if (selectedConversation) {
    await updateConversation(selectedConversation.id, finalMessages, userId); // Update the existing conversation
  } else {
    const docRef = await saveConversation(finalMessages, userId); // Save a new conversation with userId
    if (docRef) {
      setSelectedConversation({ id: docRef.id, messages: finalMessages });
    } else {
      console.error("Failed to save conversation: docRef is null or undefined");
    }
  }
}
