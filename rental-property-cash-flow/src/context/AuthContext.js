import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, isAuthenticated: true, loading: false };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: JSON.parse(user) } });
      } catch {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        { email, password }
      );
      const { token, user } = res.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Login failed. Please try again.';
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        formData
      );
      const { token, user } = res.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
