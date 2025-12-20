"use client";

import { useContext, useMemo } from "react";
import axios, { AxiosInstance } from "axios";
import { AuthContext } from "@/context/AuthContext";

// Create a scoped axios instance that picks up auth state without stacking interceptors.
export const useAxiosWithAuth = (): AxiosInstance => {
  const { currentUser } = useContext(AuthContext);

  return useMemo(() => {
    const instance = axios.create({ baseURL: "/api" });
    if (currentUser?.accessToken) {
      instance.defaults.headers.common.Authorization = `Bearer ${currentUser.accessToken}`;
    }
    return instance;
  }, [currentUser?.accessToken]);
};
