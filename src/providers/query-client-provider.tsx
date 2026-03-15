/* eslint-disable */
"use client";

import { BaseAPIResponse } from "@/models/api/common";
import { useAnimatedToast } from "@/share/ui/animated-toast";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReactNode, useMemo } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { addToast } = useAnimatedToast();
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error) => {
            const axiosError = error as AxiosError<BaseAPIResponse>;
            const statusCode = axiosError.response?.status;

            if (statusCode === 401) {
              return false;
            }

            return failureCount < 1;
          },
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5, // 5 phút
        },
      },
      queryCache: new QueryCache({
        onError: (error, query) => {
          const axiosError = error as AxiosError<BaseAPIResponse>;
          const statusCode = Number(axiosError.response?.status);

          if (
            query.state.data !== undefined &&
            statusCode &&
            statusCode > 400
          ) {
            addToast({
              message: axiosError.response?.data?.message ?? axiosError.message,
              type: "error",
            });
          }
        },
      }),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
