import { Outlet } from "react-router-dom";
import PageWrapper from "./PageWrapper";

const Layout = () => {
  return (
    <main className="App">
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </main>
  );
};

export default Layout;
