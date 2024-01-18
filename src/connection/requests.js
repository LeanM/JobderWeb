import axios from "./client";
import { axiosAuth } from "./client";

export const logInSubmission = async (userData) => {
  return axios.post("/auth/login", JSON.stringify(userData));
};

export const registerSubmission = async (userData) => {
  return axios.post("/auth/register", JSON.stringify(userData));
};

export const logoutSubmission = async (accessToken) => {
  return axiosAuth(accessToken).post("/auth/logout");
};

export const socialLogIn = async (socialCredentials) => {
  return axios.post(
    "/oauth/check/code/google",
    JSON.stringify(socialCredentials)
  );
};
