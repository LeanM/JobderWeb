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
import PersistLogin from "./PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/clientLanding" element={<ClientLanding />} />

        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        {/* Want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all (pages that doesnt exists) */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
