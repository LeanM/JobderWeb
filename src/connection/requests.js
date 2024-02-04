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

export const getProfile = async (accessToken) => {
  return axiosAuth(accessToken).get("/profile/user");
};

export const startChat = async (accessToken, otherUserId) => {
  let info = {
    recipientId: otherUserId,
  };

  return axiosAuth(accessToken).post(
    "/chatroom/startChat",
    JSON.stringify(info)
  );
};

export const getMessages = async (accessToken, recipientId) => {
  return axiosAuth(accessToken).get(`/chat/messages/${recipientId}`);
};

export const searchWorkersUnlogged = async (searchInfo) => {
  return axios.post(
    "/search/unlogged/searchWorkers",
    JSON.stringify(searchInfo)
  );
};

export const searchWorkersLogged = async (accessToken, searchInfo) => {
  return axiosAuth(accessToken).post(
    "/search/client/searchWorkers",
    JSON.stringify(searchInfo)
  );
};

export const searchWorkers = async (accessToken, searchInfo) => {
  return axiosAuth(accessToken).post(
    "/search/client/searchWorkers",
    JSON.stringify(searchInfo)
  );
};

export const interactWithWorker = async (accessToken, interactionInfo) => {
  return axiosAuth(accessToken).post(
    "matching/client/interaction",
    JSON.stringify(interactionInfo)
  );
};

export const getLikedOrMatchedWorkers = async (accessToken) => {
  return axiosAuth(accessToken).post("matching/client/likedOrMatchedWorkers");
};
