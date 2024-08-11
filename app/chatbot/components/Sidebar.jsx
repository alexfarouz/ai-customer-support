import { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Sidebar({ previousConversations, selectConversation, setMessages, setMessage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isCollapsed ? '50px' : { xs: '100%', sm: '20vw' },
        transition: 'width 0.3s ease-in-out',
        height: 'calc(100vh - 8vh)',
        p: isCollapsed ? '0' : 2,
        className: "bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-md text-white",
        overflowY: isCollapsed ? 'hidden' : 'auto',
        '@media (max-width: 600px)': {
          width: isCollapsed ? '50px' : '100%',
          height: isCollapsed ? '50px' : '40vh',
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {!isCollapsed && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'transparent',
              border: '2px solid transparent',
              color: 'white',
              fontWeight: 'bold',
              width: '100%',
              maxWidth: '200px',
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
        )}
        <IconButton
          onClick={toggleCollapse}
          sx={{ color: 'white', alignSelf: 'flex-end' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {!isCollapsed && (
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
      )}
    </Box>
  );
}
