import { Box, Stack, TextField, Button, CircularProgress } from '@mui/material';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function ChatArea({
  messages,
  setMessages,
  handleSendMessage,
  message,
  setMessage,
  isSidebarCollapsed,
  loading, // Receive loading state
}) {
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Stack
      direction="column"
      height="100%"
      width={isSidebarCollapsed ? '0%' : 'calc(100% - 50px)'}
      p={isSidebarCollapsed ? 0 : 1}
      spacing={3}
      className="flex bg-blue-300 bg-opacity-20 backdrop-blur-lg rounded-md text-white"
      sx={{
        display: isSidebarCollapsed ? 'none' : 'flex', // Hide chat area on mobile if sidebar is open
        '@media (max-width: 600px)': {
          width: isSidebarCollapsed ? '0%' : '100%',
        },
      }}
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
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={message.role === 'assistant' ? 'rgba(3, 37, 65, 0.8)' : 'rgba(0, 0, 0, 0.6)'}
                color="white"
                borderRadius="12px"
                p={1.5}
                maxWidth="70%"
                sx={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '16px',  // Increase text size
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  '&::first-letter': {
                    textTransform: 'capitalize',
                  },
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          </motion.div>
        ))}
        {loading && (
          <Box display="flex" justifyContent="flex-start" alignItems="center" mt={2}>
            <CircularProgress color="inherit" />
          </Box>
        )}
        <div ref={messageEndRef} />
      </Stack>

      <Box
        component="form"
        display="flex"
        alignItems="center"
        p={1}
        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        className="rounded-lg"
      >
        <TextField
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'black',
              borderRadius: '8px',
              boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)', // Add shadow for smooth effect
              transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)', // Lighter border on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)', // Keep the border subtle on focus
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
          placeholder="Type your message here..."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ ml: 1 }}
          disabled={loading} // Disable send button while loading
        >
          Send
        </Button>
      </Box>
    </Stack>
  );
}
