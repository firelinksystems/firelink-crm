import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { LocalFireDepartment, Security } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <LocalFireDepartment sx={{ fontSize: 48, color: '#d32f2f', mr: 2 }} />
          <Box>
            <Typography component="h1" variant="h3" fontWeight="bold">
              FireLink
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Systems CRM
            </Typography>
          </Box>
        </Box>
        
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Technician Portal
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="FireLink Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
                height: '48px'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In to FireLink'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@firelinksystem.com<br />
              Password: admin123
            </Typography>
          </Box>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          © 2024 FireLink Systems. Fire & Security Management Platform.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
