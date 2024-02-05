import axios from "../connection/client";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const data = {
      refreshToken: auth?.refreshToken,
    };
    const response = await axios.post(
      "/oauth/refreshToken",
      JSON.stringify(data)
    );

    setAuth((prev) => {
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
