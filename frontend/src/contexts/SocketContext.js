import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('access_token');
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to FireLink WebSocket server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from FireLink WebSocket server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected: socket?.connected || false,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
