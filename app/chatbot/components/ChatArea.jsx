import { Box, Stack, TextField, Button } from '@mui/material';
import { useRef, useEffect } from 'react';

export default function ChatArea({
  messages,
  setMessages,
  handleSendMessage,
  message,
  setMessage,
  isSidebarCollapsed,
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
          <Box
            key={index}
            display="flex"
            justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
          >
            <Box
              bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'black',
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
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
        >
          Send
        </Button>
      </Box>
    </Stack>
  );
}
