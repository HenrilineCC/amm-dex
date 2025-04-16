// components/Layout.tsx
import { useEffect, useState } from "react";
import { Layout as AntLayout, Menu, Typography } from "antd";
import { ethers } from "ethers";
import AMM_ABI from "../abi/AMM.json";
import PriceBar from "./PriceBanner";
import LimitOrderExecutor from "./LimitOrderExecutor";
import DynamicBackground from "./DynamicBackground";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const { Header, Content } = AntLayout;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLP, setIsLP] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);
      const owner = await contract.owner();
      const lpStatus = await contract.isLP(address);

      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      setIsLP(lpStatus);
    };

    init();
  }, []);

  return (
    <AntLayout style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <DynamicBackground style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
          <PriceBar />
          <LimitOrderExecutor /> {/* ✅  */}

          <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          AMM DEX
        </Typography.Title>
        <Menu theme="dark" mode="horizontal">
          
        </Menu>
          </Header>

          <Content style={{ padding: "2rem" }}>
        {isOwner && <Typography.Text type="success">🛡️ You are the Contract Administrator</Typography.Text>}
        {!isLP && <Typography.Text type="warning">⚠️ The current address is not an LP user and cannot add liquidity</Typography.Text>}
        {children}
          </Content>
        </div>
      </AntLayout>
  );
}