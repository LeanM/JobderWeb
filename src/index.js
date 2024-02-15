import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./components/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { GeoLocationProvider } from "./context/GeoLocationProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import "rsuite/dist/rsuite.min.css";
import { ChatIndexDBProvider } from "./context/ChatIndexDBProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <Toaster position="bottom-center" reverseOrder={false}></Toaster>
        <AuthProvider>
          <GeoLocationProvider>
            <ChatIndexDBProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </ChatIndexDBProvider>
          </GeoLocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
