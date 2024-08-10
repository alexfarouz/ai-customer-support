'use client'; // Ensure this file is treated as a client-side component
// Sign-in page
import { Box, TextField, Typography, Button } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13 and newer

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/chatbot'); // Redirect to the home page after sign-in
  };

  const handleLogoClick = () => {
    router.push('/'); // Redirect to the home page when the logo is clicked
  };

  return (
    <Box sx={{ backgroundImage: `url('homepage.jpg')`, display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Navbar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          padding: '16px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent black background
          color: 'white',
          zIndex: 1000,
        }}
      >
        <Typography
          variant="h5"
          sx={{ cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          AI
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>


        {/* Right Side - Image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url('sign-in2.png')`,
            backgroundSize: 'cover', 
            height: '70vh', 
            marginTop: '20vh', 
            backgroundPosition: 'center',
          }}
        />

                {/* Left Side - Sign In Form */}
                <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            Sign In
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: '10px',
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'black', // Set background color to black
                '& fieldset': {
                  borderColor: 'white', // Set border color to white
                },
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
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: '20px',
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'black', // Set background color to black
                '& fieldset': {
                  borderColor: 'white', // Set border color to white
                },
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: '10px' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Box
          onClick = {handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start', // Align items to the start (left) within the Box
              gap: '20px', // Space between the icon and text
              cursor: 'pointer',
              color: 'white',
              border: '1px solid white',
              backgroundColor: 'red',
              padding: '8px 16px', // Optional: Add padding for better appearance
            }}
          >
            <FaGoogle style={{ fontSize: '20px' }} />
            <Typography
              sx={{
                flexGrow: 1, // Allow the text to take up remaining space
                textAlign: 'center', // Center the text horizontally within its space
            
              }}
              
            >
              Sign In with Google
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
