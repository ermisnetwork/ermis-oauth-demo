import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { WagmiProvider } from "wagmi";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./wagmi.ts";

import App from "./App.tsx";

import "./index.css";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="189085125783-c038123hbeum42s6tsvd222kqmoite13.apps.googleusercontent.com">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
