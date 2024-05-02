import AppleSignin from "react-apple-signin-auth";
import { useState } from "react";
import { useApi } from "../shared/hooks/useApi";
import ReactJson from "react-json-view";
import { Divider } from "antd";

/** Apple Signin button */
const MyAppleSigninButton = ({ ...rest }) => {
  const { verifyToken } = useApi();
  const [accessToken, setAccessToken] = useState<any>("");

  return (
    <>
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
      {accessToken ? (
        <>
          <h2>Succesfully decoded and validated google token</h2>
          <Divider />
          <ReactJson src={accessToken} />
        </>
      ) : null}
    </>
  );
};

export default MyAppleSigninButton;
