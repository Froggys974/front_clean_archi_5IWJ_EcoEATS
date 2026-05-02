"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export function useApi() {
  const { token } = useAuth();

  const get = useCallback(
    <T>(endpoint: string): Promise<T> =>
      apiRequest<T>(endpoint, "GET", undefined, token),
    [token]
  );

  const post = useCallback(
    <T>(endpoint: string, body?: unknown): Promise<T> =>
      apiRequest<T>(endpoint, "POST", body, token),
    [token]
  );

  const patch = useCallback(
    <T>(endpoint: string, body?: unknown): Promise<T> =>
      apiRequest<T>(endpoint, "PATCH", body, token),
    [token]
  );

  const del = useCallback(
    <T>(endpoint: string): Promise<T> =>
      apiRequest<T>(endpoint, "DELETE", undefined, token),
    [token]
  );

  return { get, post, patch, del };
}
