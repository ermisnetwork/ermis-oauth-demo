import axios from "axios";
import { ApiHook, ValidateTokenRequest, Claims } from "../types";

const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface HookProps {
  baseURL?: string;
}

const client = axios.create({
  baseURL: envBaseUrl && String(envBaseUrl).length > 0 ? envBaseUrl : "/api/v1",
});

const client1 = axios.create({
  baseURL: "http://42.119.181.15:5002",
});

client.defaults.headers.common["Content-Type"] = "application/json";

export const useApi = (props?: HookProps): ApiHook => {
  if (props) {
    const { baseURL } = props;
    if (baseURL && baseURL.length) {
      client.defaults.baseURL = baseURL;
    }
  }
  const verifyToken = (data: ValidateTokenRequest) =>
    client.post<Claims>(`/verify`, data).then((res) => res.data);

  const checkAndGetAccessToken = (data: any) =>
    client1.post(`/auth/google`, data).then((res) => res.data);
  return {
    verifyToken,
    checkAndGetAccessToken,
  };
};
