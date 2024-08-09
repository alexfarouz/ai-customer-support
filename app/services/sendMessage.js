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

  // Send the user's message to the OpenAI API
  const response = await fetch('/api/chat', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedMessages),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let assistantMessage = { role: "assistant", content: "" };
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value || new Int8Array(), { stream: true });
    assistantMessage.content += text;

    // Update the assistant message as it streams
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      
      if (lastMessage.role === "assistant") {
        lastMessage.content = assistantMessage.content;
        return [...prevMessages];
      } else {
        return [...prevMessages, assistantMessage];
      }
    });
  }

  // After streaming is complete, save or update the conversation
  const finalMessages = [...updatedMessages, assistantMessage];
  if (selectedConversation) {
    await updateConversation(selectedConversation.id, finalMessages); // Update the existing conversation
  } else {
    const docRef = await saveConversation(finalMessages); // Save a new conversation
    setSelectedConversation({ id: docRef.id, messages: finalMessages });
  }
}
