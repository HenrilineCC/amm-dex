// pages/swap.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Typography, Divider, Select, Alert, Card } from "antd";
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
  const [feeRate, setFeeRate] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<string>("0");
  const [swapResult, setSwapResult] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  useEffect(() => {
    if (account) loadBalances();
  }, [account, direction]);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    loadBalances(accounts[0]);
  };

  const loadBalances = async (addr?: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const user = addr || account;
    if (!user) return;

    const tokenA = new ethers.Contract(tokenAAddress, ERC20_ABI, signer);
    const tokenB = new ethers.Contract(tokenBAddress, ERC20_ABI, signer);
    const balA = await tokenA.balanceOf(user);
    const balB = await tokenB.balanceOf(user);

    setBalanceA(ethers.formatUnits(balA, DECIMALS));
    setBalanceB(ethers.formatUnits(balB, DECIMALS));
  };

  const estimateOutput = async (value: string) => {
    if (!value || isNaN(Number(value))) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);
    const parsed = ethers.parseUnits(value, DECIMALS);

    const tokenAOnChain = await contract.tokenA();
    const tokenBOnChain = await contract.tokenB();
    const tokenIn = direction === "AtoB" ? tokenAOnChain : tokenBOnChain;

    const feeRate = await contract.getExpectedFeeRate(tokenIn, parsed);
    setFeeRate(Number(feeRate));

    const fee = (parsed * BigInt(feeRate)) / 1000n;
    setFeeAmount(ethers.formatUnits(fee, DECIMALS));

    const reserveA = await contract.reserveA();
    const reserveB = await contract.reserveB();
    const reserveIn = direction === "AtoB" ? reserveA : reserveB;
    const reserveOut = direction === "AtoB" ? reserveB : reserveA;

    const amountInWithFee = parsed - fee;
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

    const parsedAmount = ethers.parseUnits(amountIn, DECIMALS);
    const balance = direction === "AtoB"
      ? ethers.parseUnits(balanceA, DECIMALS)
      : ethers.parseUnits(balanceB, DECIMALS);

    if (parsedAmount > balance) {
      setSwapResult("❌ Insufficient token balance, unable to trade");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

      const tokenIn = direction === "AtoB" ? tokenAAddress : tokenBAddress;
      const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);

      const allowance = await tokenContract.allowance(account, AMM_ADDRESS);
      if (allowance < parsedAmount) {
        const approveTx = await tokenContract.approve(AMM_ADDRESS, parsedAmount);
        await approveTx.wait();
      }

      const tx = await amm.swap(tokenIn, parsedAmount, minOut);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setSwapResult("✅ Swap successfully");
        setAmountIn("");
        setAmountOut("0");
        loadBalances();
        window.dispatchEvent(new Event("priceRefresh"));
      } else {
        setSwapResult("❌ fail to swap");
      }
    } catch (err: any) {
      console.error("Swap error：", err);
      if (err?.message?.includes("Slippage")) {
        setSwapResult("⚠️ Slippage is too high and the transaction fails");
      } else {
        setSwapResult("❌ Swap error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div style={{
        maxWidth: 480,
        margin: "auto",
        padding: "2rem",
        background: theme.background,
        borderRadius: 20,
        boxShadow: theme.cardShadow,
        marginTop: 16
      }}>
        <Typography.Title level={3} style={{ color: theme.textColor }}>🔄 Token Swap</Typography.Title>
        <PriceBanner />

        <Card style={{ marginBottom: 16, background: theme.inputBackground }}>
          <Typography.Text style={{ color: theme.textColor }}>
            🎒 My Balance：
          </Typography.Text>
          <br />
          Token A: <strong>{balanceA}</strong>
          <br />
          Token B: <strong>{balanceB}</strong>
        </Card>

        <Alert
          message={`Current Fee Rate：${(feeRate / 10).toFixed(1)}‰， ${feeAmount} Token`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

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
          Switch Direction：{direction === "AtoB" ? "A → B" : "B → A"}
        </Button>

        <Input
          placeholder={`input ${direction === "AtoB" ? "Token A" : "Token B"} quantity`}
          value={amountIn}
          onChange={handleAmountChange}
          style={{
            marginBottom: 12,
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
            padding: "12px 16px"
          }}
        />

        <Typography.Text>
        Estimated gain {direction === "AtoB" ? "Token B" : "Token A"}：
          <strong>{amountOut}</strong>
        </Typography.Text>
        <br />
        <Typography.Text type="secondary">
        Minimum acceptable (slippage {slippage}%）：{ethers.formatUnits(minOut, DECIMALS)}
        </Typography.Text>

        <div style={{ marginTop: "1rem" }}>
          <Typography.Text>Slippage tolerance：</Typography.Text>
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
          disabled={!account || !amountIn}
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
          Execute Swap
        </Button>

        {swapResult && (
          <Alert
            message={swapResult}
            type={swapResult.startsWith("✅") ? "success" : "error"}
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    </Layout>
  );
}