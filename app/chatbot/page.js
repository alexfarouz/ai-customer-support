'use client';
// Chatbot page
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook
import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import { fetchConversations } from '../services/conversation';
import { sendMessage } from '../services/sendMessage';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [previousConversations, setPreviousConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const router = useRouter(); // Initialize the router
  const messageEndRef = useRef(null);

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
      setSelectedConversation,
    });
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  return (
   
    <Box sx = {{
      backgroundImage: `url('chatbot-page.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          width: '100%',
          boxShadow: 'none',
          height: '8vh',
        }}
      >
        <Box
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            borderBottom: '2px solid transparent'
          }}
      
        >
          AI
        </Box>
        <Box
          sx={{
            fontSize: '18px',
            fontWeight: 'medium',
            color: 'white',
            cursor: 'pointer',
            borderBottom: '2px solid transparent',
            '&:hover': {
              borderBottom: '2px solid white',
            },
          }}
          onClick={() => router.push('/')} // Use router.push for navigation
        >
          Sign Out
        </Box>
      </Box>

      <Box height="100vh" display="flex">
        {/* Box for displaying previous conversations */}
        <Box
          width="20vw"
          height="100vh"
          p={2}
          className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-md text-white"
        >
          <Button
          variant="contained"
          color="primary"
          sx={{
            marginBottom: '16px',
            backgroundColor: 'transparent',
            border: '2px solid transparent',
          
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              border: '2px solid white',
              backgroundColor: 'transparent',
            }
          }}
          onClick={() => {
            setMessages([
              {
                role: 'assistant',
                content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
              },
            ]);
            setMessage('');
          }}
        >
          + New Chat
        </Button>
        <Box marginBottom={'10px'}>
        <Typography variant="h8" color="white" mb={2}>Previous Conversations</Typography>
        </Box>
        <Box
          sx={{
            height: 'calc(100vh - 80px)', // Adjust height to fit within the container
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              width: '5px', // Width of the scrollbar
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent', // Track background color
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // Scrollbar thumb color
              borderRadius: '4px', // Rounded corners for the scrollbar thumb
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Scrollbar thumb color on hover
            },
            
          }}
        >
        
        <ul style={{ padding: 0, margin: 0 }}>
            {previousConversations.map((conv, index) => (
              <li
                key={index}
                onClick={() => selectConversation(conv)}
                style={{
                  cursor: 'pointer',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                Conversation {index + 1} -{' '}
                {new Date(conv.timestamp.seconds * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
          <br /> <br/> <br />
          </Box>
        </Box>

        {/* Main chat box */}
        <Stack
          direction="column"
          height="92vh"
          width="calc(90vw - 32px)"
          p={1}
          spacing={3}
          className="flex bg-blue-300 bg-opacity-20 backdrop-blur-lg rounded-md text-white"
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            sx = {{
              '&::-webkit-scrollbar': {
                width: '5px', // Width of the scrollbar
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent', // Track background color
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // Scrollbar thumb color
                borderRadius: '4px', // Rounded corners for the scrollbar thumb
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Scrollbar thumb color on hover
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius="12px"
                p={1.5}
                
              >
                  {message.content}
                </Box>
              </Box>
            ))}

          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{ style: { color: 'white' } }}
              sx = {{
                '& .MuiOutlinedInput-root': {
              backgroundColor: 'black', // Set background color to black
              '&:hover fieldset': {
                borderColor: 'white', // Set border color to white on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // Set border color to white when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white', // Set label color to white
            },
            '& .MuiInputBase-input': {
              color: 'white', // Set input text color to black
            },
          }}
            />
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
