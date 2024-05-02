import { useAccount, useSwitchChain } from "wagmi";
import { config } from "../wagmi";
import { Button, Col, Row, Typography } from "antd";

export function NetworkSwitcher() {
  const { chain } = useAccount();
  const { chains, error, switchChain, isPending } = useSwitchChain({
    config,
  });

  if (!chain) return null;

  return (
    <Row style={{ marginTop: 16, marginBottom: 16 }}>
      <Col span={24}>
        <Typography.Text style={{ color: "#fff" }}>
          Connected to {chain?.name ?? chain?.id}
        </Typography.Text>

        {switchChain && (
          <div>
            {chains.map((x) =>
              x.id === chain?.id ? null : (
                <Button
                  key={x.id}
                  onClick={() => switchChain(config, { chainId: x.id })}
                >
                  {x.name}
                  {/* {isPending && x.id === pendingChainId && " (switching)"} */}
                  {isPending && " (switching)"}
                </Button>
              )
            )}
          </div>
        )}

        <Typography.Text type="danger">
          {error && error.message}
        </Typography.Text>
      </Col>
    </Row>
  );
}
