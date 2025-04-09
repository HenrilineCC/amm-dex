// pages/liquidity.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Typography, Divider, message } from "antd";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import theme from "../components/theme";
import AMM_ABI from "../abi/AMM.json";
import ERC20_ABI from "../abi/ERC20.json";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const tokenA = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const tokenB = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function LiquidityPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lpAmount, setLpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLP, setUserLP] = useState("0");
  const [isLPUser, setIsLPUser] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);
    const isLP = await contract.isLP(accounts[0]);

    setAccount(accounts[0]);
    setIsLPUser(isLP);
    fetchUserLP(accounts[0]);
  };

  const fetchUserLP = async (address: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);
    const balance = await contract.balanceOf(address);
    setUserLP(ethers.formatUnits(balance, DECIMALS));
  };

  const addLiquidity = async () => {
    if (!account || !amountA || !amountB) return;
    if (!isLPUser) {
      message.warning("你没有 LP 权限，无法添加流动性");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

      const parsedA = ethers.parseUnits(amountA, DECIMALS);
      const parsedB = ethers.parseUnits(amountB, DECIMALS);

      const allowanceA = await tokenAContract.allowance(account, AMM_ADDRESS);
      if (allowanceA < parsedA) {
        const tx = await tokenAContract.approve(AMM_ADDRESS, parsedA);
        await tx.wait();
      }

      const allowanceB = await tokenBContract.allowance(account, AMM_ADDRESS);
      if (allowanceB < parsedB) {
        const tx = await tokenBContract.approve(AMM_ADDRESS, parsedB);
        await tx.wait();
      }

      const tx = await amm.addLiquidity(parsedA, parsedB);
      await tx.wait();

      message.success("添加流动性成功 ✅");
      setAmountA("");
      setAmountB("");
      fetchUserLP(account);
      window.dispatchEvent(new Event("priceRefresh"));
    } catch (err) {
      console.error("添加流动性失败", err);
      message.error("添加失败 ❌");
    } finally {
      setLoading(false);
    }
  };

  const removeLiquidity = async () => {
    if (!account || !lpAmount) return;
    if (!isLPUser) {
      message.warning("你没有 LP 权限，无法移除流动性");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);
      const parsedLP = ethers.parseUnits(lpAmount, DECIMALS);

      const tx = await amm.removeLiquidity(parsedLP);
      await tx.wait();

      message.success("移除流动性成功 ✅");
      setLpAmount("");
      fetchUserLP(account);
      window.dispatchEvent(new Event("priceRefresh"));
    } catch (err) {
      console.error("移除流动性失败", err);
      message.error("移除失败 ❌");
    } finally {
      setLoading(false);
    }
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
        marginTop: 16,
      }}>
        <Typography.Title level={3} style={{ color: theme.textColor }}>
          💦 流动性管理
        </Typography.Title>

        {!isLPUser && (
          <Typography.Text type="danger">
            ⚠️ 你不是 LP 用户，不能添加/移除流动性。
          </Typography.Text>
        )}

        <Divider orientation="left">添加流动性</Divider>

        <Input
          placeholder="输入 Token A 数量"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          style={{
            marginBottom: 16,
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
          }}
        />

        <Input
          placeholder="输入 Token B 数量"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          style={{
            marginBottom: 16,
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
          }}
        />

        <Button
          type="primary"
          onClick={addLiquidity}
          style={{ background: theme.buttonGradient, border: "none" }}
          loading={loading}
          disabled={!account}
        >
          添加流动性
        </Button>

        <Divider orientation="left">移除流动性</Divider>

        <Input
          placeholder="输入要移除的 LP Token 数量"
          value={lpAmount}
          onChange={(e) => setLpAmount(e.target.value)}
          style={{
            marginBottom: 16,
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
          }}
        />

        <Button
          danger
          onClick={removeLiquidity}
          loading={loading}
          disabled={!account}
        >
          移除流动性
        </Button>

        <Divider />
        <Typography.Text>你的 LP Token 数量：{userLP}</Typography.Text>
      </div>
    </Layout>
  );
}