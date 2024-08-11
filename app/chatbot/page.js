'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, TextField, Button } from '@mui/material';
import { fetchConversations } from '../services/conversation';
import { sendMessage } from '../services/sendMessage';
import { UserButton } from '@clerk/nextjs';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box
      sx={{
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
      }}
    >
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
            pl: '16px',
            pb: '5px',
            borderBottom: '2px solid transparent',
            cursor: 'pointer',
            '@media (max-width: 600px)': {
              fontSize: '20px',
            },
          }}
          onClick={() => router.push('/')} // Navigate back to the landing page when clicked
        >
          AI Assistant
        </Box>
        <Box
          sx={{
            '@media (max-width: 600px)': {
              fontSize: '16px',
            },
          }}
        >
          <UserButton />
        </Box>
      </Box>

      <Box
        height="calc(100vh - 8vh)"
        display="flex"
        flexDirection="row"
        width="100%"
        overflow="hidden"
      >
        <Sidebar
          previousConversations={previousConversations}
          selectConversation={selectConversation}
          setMessages={setMessages}
          setMessage={setMessage}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Only render ChatArea when sidebar is collapsed on mobile */}
        {!isSidebarCollapsed && (
          <ChatArea
            messages={messages}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            messageEndRef={messageEndRef}
          />
        )}
      </Box>
    </Box>
  );
}
