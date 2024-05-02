import { useAccount, useWalletClient } from "wagmi";
import { Typography, Button, Space, Divider } from "antd";
import { Connect, Login, NetworkSwitcher } from "./components";

import { useWeb3Modal, createWeb3Modal } from "@web3modal/wagmi/react";
import { configWalletConnect } from "./wagmi";
import SocialSignInButton from "./components/SocialSignInButton";

// 3. Create modal
createWeb3Modal({
  wagmiConfig: configWalletConnect,
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

function ConnectButton() {
  // 4. Use modal hook
  const { open } = useWeb3Modal();

  const account = useAccount();
  console.log("account", account);

  return (
    <Space>
      <Button onClick={() => open({ view: "Connect" })}>
        Open Connect Modal
      </Button>
      <Button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </Button>
    </Space>
  );
}

function App() {
  const account = useAccount();
  console.log("account at App", account);
  const result = useWalletClient({ account: account.address });
  console.log("result", result);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "50%" }}>
        <Typography.Title level={2} style={{ color: "#fff" }}>
          Belo OpenId
        </Typography.Title>

        <Typography.Title level={4} style={{ color: "#fff" }}>
          Wallet login:
        </Typography.Title>
        <Connect />

        {/* web3 connect button */}
        {/* <Row>
          <ConnectButton />
        </Row> */}
        {account.isConnected && (
          <>
            <NetworkSwitcher />
            <Login />
          </>
        )}

        <Divider style={{borderColor: '#f2f2f2'}} />

        <Typography.Title level={4} style={{ color: "#fff" }}>
          Social login:
        </Typography.Title>
        <SocialSignInButton />
      </div>
    </div>
  );
}

export default App;
