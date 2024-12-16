// /src/context/AuthContext.js

import React, { createContext, useReducer, useEffect } from 'react';
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
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (loggedInUser && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: JSON.parse(loggedInUser) },
      });
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user },
      });
      return true;
    } catch (error) {
      console.error('Login failed', error);
      dispatch({ type: 'AUTH_ERROR' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
