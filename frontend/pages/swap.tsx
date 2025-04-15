import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Typography, Divider, Select, Alert } from "antd";
import AMM_ABI from "../abi/AMM.json";
import ERC20_ABI from "../abi/ERC20.json";
import PriceBanner from "../components/PriceBanner";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import theme from "../components/theme";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const tokenAAddress = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const tokenBAddress = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function SwapPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [minOut, setMinOut] = useState<bigint>(0n);
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const [message, setMessage] = useState<{ type: "success" | "error"; content: string } | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    loadBalances(accounts[0]);
  };

  const loadBalances = async (user: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenA = new ethers.Contract(tokenAAddress, ERC20_ABI, provider);
    const tokenB = new ethers.Contract(tokenBAddress, ERC20_ABI, provider);

    const balanceARaw = await tokenA.balanceOf(user);
    const balanceBRaw = await tokenB.balanceOf(user);

    setBalanceA(ethers.formatUnits(balanceARaw, DECIMALS));
    setBalanceB(ethers.formatUnits(balanceBRaw, DECIMALS));
  };

  const estimateOutput = async (value: string) => {
    if (!value || isNaN(Number(value))) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const reserveA = await contract.reserveA();
    const reserveB = await contract.reserveB();

    const amountInWithFee = (BigInt(ethers.parseUnits(value, DECIMALS)) * 997n) / 1000n;
    const reserveIn = direction === "AtoB" ? reserveA : reserveB;
    const reserveOut = direction === "AtoB" ? reserveB : reserveA;

    const rawOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    const slippageFactor = BigInt(Math.floor((1000 - slippage * 10)));
    const minAcceptable = (rawOut * slippageFactor) / 1000n;

    setAmountOut(ethers.formatUnits(rawOut, DECIMALS));
    setMinOut(minAcceptable);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountIn(e.target.value);
    estimateOutput(e.target.value);
  };

  const handleSwap = async () => {
    if (!window.ethereum || !account || !amountIn) return;

    try {
      setLoading(true);
      setMessage(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

      const tokenIn = direction === "AtoB" ? tokenAAddress : tokenBAddress;
      const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);
      const parsedAmount = ethers.parseUnits(amountIn, DECIMALS);

      const allowance = await tokenContract.allowance(account, AMM_ADDRESS);
      if (allowance < parsedAmount) {
        const approveTx = await tokenContract.approve(AMM_ADDRESS, parsedAmount);
        await approveTx.wait();
      }

      const tx = await amm.swap(tokenIn, parsedAmount, minOut);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setMessage({ type: "success", content: "Swap 成功 ✅" });
        setAmountIn("");
        setAmountOut("0");
        loadBalances(account);
        window.dispatchEvent(new Event("priceRefresh"));
      } else {
        setMessage({ type: "error", content: "Swap 失败 ❌" });
      }
    } catch (err: any) {
      console.error("Swap 错误：", err);
      if (err?.message?.includes("Slippage too high")) {
        setMessage({ type: "error", content: "⚠️ 滑点过高，交易失败" });
      } else {
        setMessage({ type: "error", content: "Swap 出现错误" });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentBalance = direction === "AtoB" ? parseFloat(balanceA) : parseFloat(balanceB);
  const inputExceedsBalance = parseFloat(amountIn || "0") > currentBalance;

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
        <Typography.Title level={3} style={{ color: theme.textColor }}>🔄 Swap</Typography.Title>
        <PriceBanner />

        <div style={{ marginBottom: 12 }}>
          <Typography.Text>💰 余额 A: {balanceA}</Typography.Text><br />
          <Typography.Text>💰 余额 B: {balanceB}</Typography.Text>
        </div>

        <Button
          onClick={() => {
            setDirection(direction === "AtoB" ? "BtoA" : "AtoB");
            setAmountOut("0");
            estimateOutput(amountIn);
          }}
          style={{
            marginBottom: 16,
            width: "100%",
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12
          }}
        >
          切换方向：{direction === "AtoB" ? "A → B" : "B → A"}
        </Button>

        <Input
          placeholder={`输入 ${direction === "AtoB" ? "Token A" : "Token B"} 数量`}
          value={amountIn}
          onChange={handleAmountChange}
          style={{
            marginBottom: "1rem",
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
            padding: "12px 16px"
          }}
        />

        {inputExceedsBalance && (
          <Alert message="⚠️ 当前余额不足，无法进行 Swap" type="error" showIcon style={{ marginBottom: 12 }} />
        )}

        <Typography.Text>
          预估获得 {direction === "AtoB" ? "Token B" : "Token A"}：<strong>{amountOut}</strong>
        </Typography.Text>
        <br />
        <Typography.Text type="secondary">
          最少可接受（滑点 {slippage}%）：{ethers.formatUnits(minOut, DECIMALS)}
        </Typography.Text>

        <div style={{ marginTop: "1rem" }}>
          <Typography.Text>滑点容忍度：</Typography.Text>
          <Select
            value={slippage}
            onChange={(v) => {
              setSlippage(v);
              estimateOutput(amountIn);
            }}
            style={{ width: 120, marginLeft: 8 }}
            options={[
              { label: "0.1%", value: 0.1 },
              { label: "0.5%", value: 0.5 },
              { label: "1%", value: 1 },
              { label: "2%", value: 2 },
            ]}
          />
        </div>

        <Divider />

        <Button
          type="primary"
          onClick={handleSwap}
          loading={loading}
          disabled={!account || !amountIn || inputExceedsBalance}
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
          执行 Swap
        </Button>

        {message && (
          <Alert
            type={message.type}
            message={message.content}
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    </Layout>
  );
}