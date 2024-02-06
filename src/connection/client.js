import axios from "axios";

const server_path = "http://localhost:8080";

export default axios.create({
  baseURL: server_path,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": true,
    Accept: "application/json",
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
