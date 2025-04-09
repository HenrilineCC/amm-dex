import { useEffect, useState } from "react";
import { Typography, Button } from "antd";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    if (window.ethereum && !account) {
      connect();
    }
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography.Title>💱 AMM DEX</Typography.Title>
      {account ? (
        <Typography.Text type="secondary">已连接钱包：{account}</Typography.Text>
      ) : (
        <Button type="primary" onClick={connect}>连接钱包</Button>
      )}
    </div>
  );
}