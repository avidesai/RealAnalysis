import React, { createContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { registerLogoutHandler, refreshToken as refreshTokenAPI } from '../services/api';

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

// Decode JWT payload without a library (base64url → JSON)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // Consider expired if less than 60 seconds remaining
  return decoded.exp * 1000 < Date.now() + 60_000;
};

// Returns ms until the token should be refreshed (refresh at 75% of lifetime)
const msUntilRefresh = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp || !decoded?.iat) return null;
  const lifetime = (decoded.exp - decoded.iat) * 1000;
  const refreshAt = decoded.iat * 1000 + lifetime * 0.75;
  return Math.max(refreshAt - Date.now(), 0);
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const authCallbackRef = useRef(null);
  const refreshTimerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Schedule a silent token refresh
  const scheduleRefresh = useCallback((token) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    const delay = msUntilRefresh(token);
    if (delay === null) return;

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await refreshTokenAPI();
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        scheduleRefresh(newToken);
      } catch {
        // Refresh failed — token likely expired, force logout
        logout();
      }
    }, delay);
  }, [logout]);

  // Register the logout handler so the API interceptor can trigger it
  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  // On mount: validate stored token before restoring session
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token && !isTokenExpired(token)) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: JSON.parse(user) } });
        scheduleRefresh(token);
      } catch {
        logout();
      }
    } else {
      // Token missing or expired — clean up
      if (token) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, [scheduleRefresh, logout]);

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
      scheduleRefresh(token);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Login failed. Please try again.';
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, message };
    }
  }, [scheduleRefresh]);

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
      scheduleRefresh(token);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      return { success: false, message };
    }
  }, [scheduleRefresh]);

  const openAuthModal = useCallback((callback) => {
    authCallbackRef.current = callback || null;
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    authCallbackRef.current = null;
    setShowAuthModal(false);
  }, []);

  const onAuthSuccess = useCallback(() => {
    const cb = authCallbackRef.current;
    authCallbackRef.current = null;
    setShowAuthModal(false);
    if (cb) cb();
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
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        onAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
