// ApiConfig.jsx - Base API Configuration Context
import React, { createContext, useContext, useCallback } from "react";
import axios from "axios";

// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:7000/api",
  WS_BASE_URL: "ws://localhost:7000/api",
  TIMEOUT: 10000,
};

// Create axios instance
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: API_CONFIG.TIMEOUT,
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create context
const ApiConfigContext = createContext(null);

// Provider component
export const ApiConfigProvider = ({ children }) => {
  const apiClient = createApiClient();

  const handleApiError = useCallback(
    (error, defaultMessage = "An error occurred") => {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.data?.fieldErrors) {
        const fieldErrors = error.response.data.fieldErrors;
        return Object.values(fieldErrors).join(", ");
      }
      return error.message || defaultMessage;
    },
    []
  );

  const value = {
    apiClient,
    handleApiError,
    API_CONFIG,
  };

  return (
    <ApiConfigContext.Provider value={value}>
      {children}
    </ApiConfigContext.Provider>
  );
};

// Custom hook
export const useApiConfig = () => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error("useApiConfig must be used within an ApiConfigProvider");
  }
  return context;
};
