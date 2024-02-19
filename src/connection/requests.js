import axios from "./client";
import { axiosAuth } from "./client";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const logInSubmission = async (userData) => {
  return axios.post("/oauth/login/credentials", JSON.stringify(userData));
};

export const registerSubmission = async (userData) => {
  return axios.post("/oauth/register/credentials", JSON.stringify(userData));
};

export const logoutSubmission = async (accessToken) => {
  return axiosAuth(accessToken).get("/profile/logout");
};

export const socialLogIn = async (socialCredentials) => {
  return axios.post(
    "/oauth/check/code/google",
    JSON.stringify(socialCredentials)
  );
};

export const getProfile = async (accessToken) => {
  return axiosAuth(accessToken).get("/profile/user");
};

export const fetchWorkersUnlogged = async (searchInfo) => {
  return axios.post(
    "/search/unlogged/searchWorkers",
    JSON.stringify(searchInfo)
  );
};
