'use client'; // Ensure this file is treated as a client-side component
 // Home page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13 and newer
import { Box, Typography } from '@mui/material';
import { Typewriter } from 'react-simple-typewriter';

export default function Home() {
  const router = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Update cursor position when the mouse moves
  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    // Add event listener to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      // Remove event listener on cleanup
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url('homepage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden', // Ensure the hover effect doesn't go outside the container
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
            borderBottom: '2px solid transparent',
          }}
          onClick={() => router.push('/')} // Redirect to homepage on click
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
          onClick={() => router.push('/signin')} // Navigate to the sign-in page
        >
          Sign In
        </Box>
      </Box>

      {/* Hover Effect Box */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 255, 255, 0.2), transparent 10%)`,
          pointerEvents: 'none', // Prevents the hover box from interfering with other elements
          transition: 'background 0.1s ease', // Smooth transition for the hover effect
        }}
      />

      <Box marginTop={'100px'} color={'white'} textAlign={'center'}>
        <Typography
          variant="h2"
          sx={{
            marginBottom: '20px',
            fontWeight: 'bold',
            color: '#1E90FF',
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
  );
}