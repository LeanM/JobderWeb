import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./components/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import "rsuite/dist/rsuite.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="206771482349-nqtdnm3spfpb7f1itmh0gjefsbmemnje.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
        <Toaster position="bottom-center" reverseOrder={false}></Toaster>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
