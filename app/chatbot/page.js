'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, TextField, Button, Typography, IconButton, Collapse } from '@mui/material';
import { fetchConversations } from '../services/conversation';
import { sendMessage } from '../services/sendMessage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
  const [openConversations, setOpenConversations] = useState(true);
  const router = useRouter();
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
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{
      backgroundImage: `url('chatbot-page.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      '@media (max-width: 600px)': {
        height: '100%',
      },
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
          '@media (max-width: 600px)': {
            height: '12vh',
            padding: '8px',
          },
        }}
      >
        <Box
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            borderBottom: '2px solid transparent',
            '@media (max-width: 600px)': {
              fontSize: '20px',
            },
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
            '@media (max-width: 600px)': {
              fontSize: '16px',
            },
          }}
          onClick={() => router.push('/')}
        >
          Sign Out
        </Box>
      </Box>

      <Box height="calc(100vh - 8vh)" display="flex" flexDirection="row" flexWrap="wrap">
        {/* Box for displaying previous conversations */}
        <Box
          width={{ xs: '100%', sm: '20vw' }}
          height="calc(100vh - 8vh)"
          p={2}
          className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-md text-white"
          sx={{
            overflowY: 'auto',
            '@media (max-width: 600px)': {
              width: '100%',
              height: '40vh',
            },
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            },
          }}
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
              },
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
          <Box marginBottom={'10px'} display="flex" alignItems="center">
            <Typography variant="h8" color="white" mb={2}>Previous Conversations</Typography>
            <IconButton
              onClick={() => setOpenConversations(!openConversations)}
              sx={{
                color: 'white',
                ml: 1,
              }}
            >
              {openConversations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={openConversations}>
            <Box
              sx={{
                height: 'calc(100% - 80px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                '&::-webkit-scrollbar': {
                  width: '5px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
            </Box>
          </Collapse>
        </Box>

        {/* Main chat box */}
        <Stack
          direction="column"
          height={{ xs: '50vh', sm: '92vh' }}
          width={{ xs: '100%', sm: 'calc(80vw)' }}
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
            sx={{
              '&::-webkit-scrollbar': {
                width: '5px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
                  maxWidth="70%"
                  sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    '&::first-letter': {
                      textTransform: 'capitalize',
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messageEndRef} />
          </Stack>

          {/* Input box */}
          <Box
            component="form"
            display="flex"
            alignItems="center"
            p={1}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{   '& .MuiOutlinedInput-root': {
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
              }, }}
              placeholder="Type your message here..."
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{ ml: 1 }}
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
