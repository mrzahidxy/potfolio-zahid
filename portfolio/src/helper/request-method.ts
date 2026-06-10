"use client";

import { useContext, useMemo } from "react";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

// Create a scoped axios instance that picks up auth state without stacking interceptors.
export const useAxiosWithAuth = (): AxiosInstance => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const router = useRouter();

  return useMemo(() => {
    const instance = axios.create({ baseURL: "/api" });
    if (currentUser?.accessToken) {
      instance.defaults.headers.common.Authorization = `Bearer ${currentUser.accessToken}`;
    }

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url ?? "";
        const isAdminAuthFailure =
          requestUrl.startsWith("/admin") ||
          (typeof window !== "undefined" &&
            window.location.pathname.startsWith("/admin"));

        if ((status === 401 || status === 403) && isAdminAuthFailure) {
          dispatch({ type: "LOGOUT" });
          router.replace("/admin/login");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [currentUser?.accessToken, dispatch, router]);
};
