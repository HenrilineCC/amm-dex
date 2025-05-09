// pages/liquidity.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Typography, Divider } from "antd";
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
  const [feedback, setFeedback] = useState("");

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
      setFeedback("⚠️ You do not have LP permissions and cannot add liquidity");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);

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

      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);
      const tx = await amm.addLiquidity(parsedA, parsedB);
      await tx.wait();

      setFeedback("✅ Liquidity added successfully");
      setAmountA("");
      setAmountB("");
      fetchUserLP(account);
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to add liquidity");
    } finally {
      setLoading(false);
    }
  };

  const removeLiquidity = async () => {
    if (!account || !lpAmount) return;
    if (!isLPUser) {
      setFeedback("⚠️ You do not have LP permissions and cannot remove liquidity");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);
      const parsed = ethers.parseUnits(lpAmount, DECIMALS);

      const tx = await amm.removeLiquidity(parsed);
      await tx.wait();

      setFeedback("✅ Liquidity removal successful");
      setLpAmount("");
      fetchUserLP(account);
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to remove liquidity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div
        style={{
          maxWidth: 480,
          margin: "auto",
          padding: "2rem",
          background: theme.background,
          borderRadius: 20,
          boxShadow: theme.cardShadow,
          marginTop: 24,
        }}
      >
        <Typography.Title level={3} style={{ color: theme.textColor }}>
          💧 Liquidity Management
        </Typography.Title>

        <Typography.Text>Your current LP Token：<strong>{userLP}</strong></Typography.Text>
        <Divider />

        <Typography.Title level={5}>Adding Liquidity</Typography.Title>
        <Input
          placeholder="Token A Quantity"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Token B Quantity"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button type="primary" block onClick={addLiquidity} loading={loading}>
        Adding Liquidity
        </Button>

        <Divider />

        <Typography.Title level={5}>Removing Liquidity</Typography.Title>
        <Input
          placeholder="Enter the number of LP Tokens to be removed"
          value={lpAmount}
          onChange={(e) => setLpAmount(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button danger block onClick={removeLiquidity} loading={loading}>
        Removing Liquidity
        </Button>

        <Divider />
        {feedback && (
          <div style={{ marginTop: 16, color: theme.textColor }}>
            <Typography.Text>{feedback}</Typography.Text>
          </div>
        )}
      </div>
    </Layout>
  );
}