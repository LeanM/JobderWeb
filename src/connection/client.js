import axios from "axios";

const server_path = process.env.REACT_APP_SERVER_HOST;

export default axios.create({
  baseURL: server_path,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuth = (accessToken) =>
  axios.create({
    baseURL: server_path,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

export const axiosPrivate = axios.create({
  baseURL: server_path,
  headers: { "Content-Type": "application/json" },
  //withCredentials: true,
});
