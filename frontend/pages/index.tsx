import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Typography } from "antd";
import theme from '../components/theme';
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const { Title } = Typography;

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ 
        maxWidth: 420, 
        margin: "auto", 
        padding: "1.5rem",
        background: theme.background,
        borderRadius: 20,
        boxShadow: theme.cardShadow,
        marginTop: 16
      }}>
        <Title level={2} style={{ color: theme.textColor }}>Welcome to AMM DEX</Title>
        {!account ? (
          <Button 
            type="primary" 
            onClick={connectWallet}
            style={{
              width: "100%",
              background: theme.buttonGradient,
              border: "none",
              borderRadius: 12,
              height: 48,
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Connect your wallet
          </Button>
        ) : (
          <Title level={4} style={{ color: theme.textColor }}>Connected: {account}</Title>
        )}
      </div>
    </Layout>
  );
}