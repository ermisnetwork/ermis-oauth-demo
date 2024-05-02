import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button, Col, Row, Typography } from "antd";
import { Account } from ".";

export const Connect = () => {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Row>
        {isConnected ? (
          <Col span={24} style={{ marginBottom: 24 }}>
            <Button
              onClick={() => disconnect()}
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
              Disconnect from {connector?.name}
            </Button>
          </Col>
        ) : (
          <>
            {connectors
              // .filter((x) => x.ready && x.id !== connector?.id)
              .map((x) => {
                return (
                  <Col span={24} key={x.id} style={{ marginBottom: 24 }}>
                    <Button
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
                      onClick={() => connect({ connector: x })}
                      // disabled={!x.ready}
                      loading={status === "pending" && x.id === connector?.id}
                    >
                      {x.name}
                      {/* {isLoading && x.id === pendingConnector?.id && ' (connecting)'} */}
                    </Button>
                  </Col>
                );
              })}
          </>
        )}
      </Row>
      <Row>
        <Col span={24}>
          <div className="output">
            <div style={{ marginBottom: 6 }}>
              {" "}
              <Typography.Text strong>Output:</Typography.Text>
            </div>
            <div>
              <Typography.Text>
                {isConnected ? (
                  <Account />
                ) : (
                  "Status: Wallet not connected. Please connect wallet to useMethods"
                )}
              </Typography.Text>
            </div>
          </div>

          {error && (
            <div>
              <Typography.Text type="danger">{error.message}</Typography.Text>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};
