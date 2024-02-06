import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  logInSubmission,
  logoutSubmission,
  socialLogIn,
} from "../connection/requests";
import useGeoLocation from "../hooks/useGeoLocation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const navigate = useNavigate();
  const { geoLocation } = useGeoLocation();
  const location = useLocation();
  const from = location.state?.from || false;

  const loginGoogle = (socialCredentials) => {
    toast.promise(socialLogIn(socialCredentials), {
      loading: "Logging In...",
      success: (response) => {
        const accessToken = response.data?.accessToken;
        const authentication = {
          accessToken: accessToken,
          refreshToken: response.data?.refreshToken,
          role: response.data?.role,
          userId: response.data?.userId,
        };
        console.log(authentication);
        setAuth(authentication);
        if (from) navigate(from, { replace: true });

        return <b>Successfuly logged in!</b>;
      },
      error: (error) => {
        return (
          <span>
            The next error happened while making loggin :{" "}
            {error?.response?.data?.errors}
          </span>
        );
      },
    });
  };

  const logInAuth = async (email, pwd) => {
    toast.promise(logInSubmission({ username: email, password: pwd }), {
      loading: "Logging in...",
      success: (response) => {
        const accessToken = response.data?.accessToken;
        const authentication = {
          accessToken: accessToken,
          refreshToken: response.data?.refreshToken,
          role: response.data?.role,
          userId: response.data?.userId,
        };
        console.log(authentication);
        setAuth(authentication);

        if (from) navigate(from, { replace: true });

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
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        logInAuth,
        logOutAuth,
        loginGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
