// components/Layout.tsx
import { useEffect, useState } from "react";
import { Layout as AntLayout, Menu, Typography } from "antd";
import { ethers } from "ethers";
import AMM_ABI from "../abi/AMM.json";
import PriceBar from "./PriceBanner";
import LimitOrderExecutor from "./LimitOrderExecutor";

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
    <AntLayout>
      <PriceBar />
      <LimitOrderExecutor /> {/* ✅ 自动执行器注入 */}

      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          🦄 AMM DEX 前端
        </Typography.Title>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="swap"><a href="/swap">Swap</a></Menu.Item>
          <Menu.Item key="liquidity"><a href="/liquidity">流动性</a></Menu.Item>
          <Menu.Item key="chart"><a href="/chart">图表</a></Menu.Item>
          <Menu.Item key="limit"><a href="/limit">限价交易</a></Menu.Item>
          <Menu.Item key="history"><a href="/history">历史记录</a></Menu.Item>
          {isOwner && <Menu.Item key="admin"><a href="/admin">管理功能</a></Menu.Item>}
        </Menu>
      </Header>

      <Content style={{ padding: "2rem" }}>
        {isOwner && <Typography.Text type="success">🛡️ 你是合约管理员</Typography.Text>}
        {!isLP && <Typography.Text type="warning">⚠️ 当前地址不是 LP 用户，无法添加流动性</Typography.Text>}
        {children}
      </Content>
    </AntLayout>
  );
}