import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  logInSubmission,
  logoutSubmission,
  socialLogIn,
} from "../connection/requests";
import { CookiesProvider, useCookies } from "react-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookie, setCookie] = useCookies(["refresh_token"]);
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || false;

  const loginGoogle = (socialCredentials, geoLocation) => {
    let completeCredentials = {
      value: socialCredentials?.value,
      accountRole: socialCredentials?.accountRole,
      searchParameters: socialCredentials?.searchParameters,
      latitude: geoLocation?.latitude,
      longitude: geoLocation?.longitude,
    };

    toast.promise(socialLogIn(completeCredentials), {
      loading: "Logging In...",
      success: (response) => {
        const accessToken = response.data?.accessToken;
        localStorage.setItem("refresh_token", response?.data?.refreshToken);

        const authentication = {
          accessToken: accessToken,
          role: response.data?.role,
          userId: response.data?.userId,
        };

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
        localStorage.setItem("refresh_token", response.data?.refreshToken);
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

  const logOutAuth = async () => {
    toast.promise(logoutSubmission(auth?.accessToken), {
      loading: "Logging out...",
      success: (response) => {
        setAuth({});

        navigate("/", { refresh: true });

        localStorage.setItem("refresh_token", "");
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
