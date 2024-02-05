import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Layout from "./pagewrappers/Layout";
import Missing from "./Missing";
import RequireAuth from "./auth/RequireAuth";
import ClientLanding from "./home/clientpages/ClientLanding";
import Profile from "./profile/Profile";
import LogIn from "./auth/Login";
import Register from "./auth/Register";
import ChatScreen from "./chat-components/ChatScreen";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

function App() {
  const { setAuth } = useAuth();

  useEffect(() => {
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)auth\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const decodedAuthJSON = decodeURIComponent(cookieValue);
    if (decodedAuthJSON) {
      const decodedAuth = JSON.parse(decodedAuthJSON);
      console.log(decodedAuth);
      setAuth(decodedAuth);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/clientLanding" element={<ClientLanding />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Want to protect these routes */}
        <Route element={<RequireAuth />}></Route>

        {/* Catch all (pages that doesnt exists) */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
