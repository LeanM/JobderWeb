import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Layout from "./pagewrappers/Layout";
import Missing from "./Missing";
import RequireAuth from "./auth/RequireAuth";
import ClientLanding from "./home/ClientLanding";
import DetailedWorkerView from "./home/DetailedWorkerView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/clientLanding" element={<ClientLanding />} />
        <Route path="/detailedWorker" element={<DetailedWorkerView />} />

        {/* Want to protect these routes */}
        <Route element={<RequireAuth />}></Route>

        {/* Catch all (pages that doesnt exists) */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
