import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { login, logout } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && !user) {
        try {
          const response = await authAPI.getMe();
          dispatch(login({ 
            user: response.user, 
            token 
          }));
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      
      setAuthChecked(true);
    };

    checkAuth();
  }, [dispatch, user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await dispatch(login({ email, password }) as any);
      return { success: true, data: response.payload };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signOut = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    authChecked,
    signIn,
    signOut
  };
};
