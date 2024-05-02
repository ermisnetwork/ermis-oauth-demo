import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import ReactJson from "react-json-view";
import { useAccount, useSignTypedData } from "wagmi";

import { useApi } from "../shared/hooks/useApi";
import {
  ApiHookAvanguard,
  Claims,
  LoginResponse,
  SignMessageRequest,
  WalletChallenge,
  WalletChallengeRequest,
} from "../shared/types";
import { Button, Col, Divider, Row, Typography } from "antd";

interface HookProps {
  baseURL?: string;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_AVANT_API_BASE_URL,
});

client.defaults.headers.common["Content-Type"] = "application/json";

const useAvanguardApi = (props?: HookProps): ApiHookAvanguard => {
  if (props) {
    const { baseURL } = props;
    if (baseURL && baseURL.length) {
      client.defaults.baseURL = baseURL;
    }
  }
  const getWalletChallenge = async (data: WalletChallengeRequest) => {
    return client
      .post<WalletChallenge>(`auth/start`, data)
      .then((response) => response.data);
  };

  const login = (data: SignMessageRequest) =>
    client.post<LoginResponse>(`auth`, data).then((response) => response.data);

  return {
    getWalletChallenge,
    login,
  };
};
const createNonce = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const Login = () => {
  const { connector, isConnected, address } = useAccount();
  console.log("account", isConnected, address);
  // const { getWalletChallenge, login } = useAvanguardApi({
  //   baseURL: '42.119.181.15:5002',
  // });
  const { getWalletChallenge, login } = useAvanguardApi({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_AVANGUARD_URL : "",
  });
  const { verifyToken } = useApi();
  const { signTypedDataAsync } = useSignTypedData();
  const [claims, setClaims] = useState<Claims>();
  const [, setCookie] = useCookies(["beloopenid"]);
  const [token, setToken] = useState("");

  const handleLogin = async (address: string) => {
    getWalletChallenge({ address })
      .then(async (data) => {
        const challenge = JSON.parse(data.challenge);
        const types = challenge.types;
        const domain = challenge.domain;
        const message = challenge.message;
        const primaryType = challenge.primaryType;
        const nonce = createNonce(20);
        let signature = "";
        await signTypedDataAsync(
          {
            types,
            domain,
            connector,
            primaryType,
            message,
          },
          {
            onSuccess: (s) => {
              signature = s;
            },
          }
        );

        // console.log("signature", signature);
        // const signature = "signature";

        login({ signature, address, nonce }).then((data) => {
          const token = data.token;
          console.log("token", token);
          setToken(data.token);
          // verifyToken({ token, nonce }).then((data) => {
          //   setClaims(data);
          // });
          setCookie("beloopenid", data.token, { httpOnly: true });
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {isConnected && address ? (
        <Row>
          <Col span={24}>
            <Typography.Title level={4} style={{ color: "#fff" }}>
              Sign in
            </Typography.Title>
            <Button
              onClick={() => handleLogin(address)}
              className="btn"
              style={{
                width: " 100%",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                transition: "all .1s",
              }}
              size="large"
            >
              Sign in with {connector?.name}
            </Button>
            <div className="output" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>
                <Typography.Text strong>Output:</Typography.Text>
              </div>
              {token ? (
                <>
                  <Typography.Text type="success">
                    {/* Succesfully decoded and validated {connector?.name} token */}
                    Token for comunicate with backend server
                  </Typography.Text>
                  <Divider />
                  <Typography.Text>{token}</Typography.Text>
                  {/* <ReactJson src={claims} /> */}
                </>
              ) : (
                <Typography.Text>
                  Status: Wallet is connected. Please sign in with{" "}
                  {connector?.name}
                </Typography.Text>
              )}
            </div>
          </Col>
        </Row>
      ) : null}
    </>
  );
};
