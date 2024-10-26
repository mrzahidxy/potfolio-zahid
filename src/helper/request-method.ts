' use client';

import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext } from "react";

// Create an axios instance with base URL from environment variables
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Hook to attach the token from context to the axios instance
export const useAxiosWithAuth = () => {
  const { currentUser } = useContext(AuthContext);

  // Set up an interceptor to attach the Authorization header with the token
  api.interceptors.request.use(
    (config) => {
      if (currentUser) {
        config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};
