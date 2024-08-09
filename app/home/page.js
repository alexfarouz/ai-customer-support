'use client'
import Image from "next/image";
import { useState } from "react";
import { Box, Stack, TextField , Typography} from "@mui/material";
import {Typewriter} from  'react-simple-typewriter';

export default function Home() {
  const [messages, setMessages] = useState({
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agernt, how can I assist you today?`
  })

  const [message, sestMessage] = useState('')

  return(
<Box
  sx={{
    backgroundImage: `url('homepage.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%', 
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
        borderBottom: '2px solid transparent', // No underline by default
        '&:hover': {
          borderBottom: '2px solid white', // White underline on hover
        },
      }}
    >
      Sign In
    </Box>
  </Box>
  <Box marginTop = {'100px'} color={'white'} textAlign={'center'}>
    <Typography
        variant="h2"
        sx={{
          marginBottom: '20px',
          fontWeight: 'bold',
          color: '#1E90FF', // Dodger blue color for the brand name
        }}
      >
        Your No. 1 AI Assistant
      </Typography>

      <Typography
        variant="h4"
        sx={{
          marginBottom: '20px',
        }}
      >
        <Typewriter
          words={['Get Instant Support', 'Ask Anything, Anytime']}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </Typography>

      <Typography
        variant="h5"
        sx={{
          marginTop: '50px',
          color: 'white',
        }}
      >
        Powered by cutting-edge AI to assist you with any query.
      </Typography>
  </Box>
</Box>
  )
}
