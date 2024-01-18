import { createContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logInSubmission, logoutSubmission } from "../connection/requests";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const logInAuth = async (email, pwd) => {
    toast.promise(logInSubmission({ email: email, password: pwd }), {
      loading: "Logging in...",
      success: (response) => {
        const accessToken = response.data.access_token;

        setAuth({ email, pwd, accessToken });
        navigate(from, { replace: true });

        return <b>Successfuly logged in!</b>;
      },
      error: (error) => {
        return (
          <span>
            The next error happened while making loggin :{" "}
            {error.response.data.errors}
          </span>
        );
      },
    });
  };

  const logOutAuth = async () => {
    toast.promise(logoutSubmission(auth?.accessToken), {
      loading: "Logging out...",
      success: (response) => {
        setAuth({});
        navigate("/");

        return <b>Logged out successfuly.</b>;
      },
      error: (error) => {
        setAuth({});
        navigate("/");
        return <span>There was a problem while logging out</span>;
      },
    });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logInAuth, logOutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
