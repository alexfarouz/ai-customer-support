'use client'
import { useEffect, useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { fetchConversations } from "./services/conversation";
import { sendMessage } from "./services/sendMessage";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`
  }]);
  const [message, setMessage] = useState('');
  const [previousConversations, setPreviousConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      const conversations = await fetchConversations();
      setPreviousConversations(conversations);
    };
    loadConversations();
  }, []);

  const handleSendMessage = async () => {
    await sendMessage({
      message,
      messages,
      selectedConversation,
      setMessages,
      setMessage,
      setSelectedConversation
    });
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  return (
    <div className="fixed h-full w-full">
      <div className="relative h-full w-full bg-black">
        <div className="absolute bottom-0 left-0 right-0 top-0 
        bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>

        <Box height="80vh" display="flex" justifyContent="center" className="pt-16">
          {/* Box for displaying previous conversations */}
          <Box width="20vw" height="80vh" border="2px solid white" p={2} className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-md text-white">
            <h3>Previous Conversations</h3>
            <ul>
              {previousConversations.map((conv, index) => (
                <li key={index} onClick={() => selectConversation(conv)} style={{ cursor: 'pointer' }}>
                  Conversation {index + 1} - {new Date(conv.timestamp.seconds * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          </Box>

          {/* Main chat box */}
          <Stack direction="column" height="80vh" border="2px solid white" p={2} spacing={3} className="flex bg-blue-300 bg-opacity-20 backdrop-blur-lg rounded-md text-white">
            <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
              {messages.map((message, index) => (
                <Box key={index} display="flex" justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}>
                  <Box bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"} color="white" borderRadius="16" p={3}>
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} InputProps={{ style: { color: 'white' } }} />
              <Button variant="contained" onClick={handleSendMessage}>Send</Button>
            </Stack>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
