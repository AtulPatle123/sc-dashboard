import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
