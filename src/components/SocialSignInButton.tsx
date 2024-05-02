import { GoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { useState } from "react";
import { useApi } from "../shared/hooks/useApi";
import ReactJson from "react-json-view";
import { Button, Col, Divider, Row, Typography } from "antd";

const SocialSignInButton = ({...rest}) => {
  const { verifyToken, checkAndGetAccessToken } = useApi();

  const [accessToken, setAccessToken] = useState<any>("");

  return (
    <>
      <Row gutter={[24, 24]}>
        {accessToken ? (
          <>
            <Col span={24} style={{ marginBottom: 24 }}>
              <Button
                onClick={() => setAccessToken('')}
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
                Log out
              </Button>
            </Col>
          </>
        ) : (
          <>
            <Col span={24}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  checkAndGetAccessToken({
                    token: credentialResponse?.credential,
                  }).then((data) => {
                    setAccessToken(data.token)
                    // verifyToken({
                    //   token: data.token,
                    //   nonce: "",
                    // }).then((data) => {
                    //   setAccessToken(data);
                    // });
                  });
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </Col>
            <Col span={24}>
              <AppleSignin
                onSuccess={(token: any) => {
                  verifyToken({
                    token,
                    nonce: "",
                  }).then((data) => {
                    setAccessToken(data);
                  });
                }}
                onError={(err: any) => console.log(err)}
                /** Auth options passed to AppleID.auth.init() */
                authOptions={{
                  clientId: "com.tuyenvx.testloging",
                  scope: "email name",
                  redirectURI: "https://openid.belo.dev",
                  state: "",
                  nonce: "nonce",
                  usePopup: true,
                }}
                /** General props */
                uiType="dark"
                /** className */
                className="apple-auth-btn"
                /** Allows to change the button's children, eg: for changing the button text */
                buttonExtraChildren="Continue with Apple"
                /** Checkout README.md for further customization props. */
                /** Spread rest props if needed */
                {...rest}
              />
            </Col>
          </>
        )}
      </Row>
      <Row>
        <Col span={24}>
          <div className="output" style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 6 }}>
              <Typography.Text strong>Output:</Typography.Text>
            </div>
            <div>
              {accessToken ? (
                <>
                  <Typography.Text type="success">
                    Token for comunicate with backend server
                  </Typography.Text>
                  <Divider />
                  <Typography.Text>{accessToken}</Typography.Text>
                  {/* <ReactJson src={accessToken} /> */}
                </>
              ) : (
                <Typography.Text>Status: Please login social</Typography.Text>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SocialSignInButton;
