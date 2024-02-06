import axios from "../connection/client";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const data = {
      refreshToken: auth?.refreshToken,
    };
    const response = await axios.get("/oauth/refreshToken", {
      withCredentials: true,
      credentials: "cross-origin",
    });

    console.log(response?.request?.headers);

    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data?.accessToken,
        userId: response.data?.userId,
        role: response.data?.role,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
