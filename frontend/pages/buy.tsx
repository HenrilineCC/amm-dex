// pages/buy.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Input, Select, Typography, Divider, Alert } from "antd";
import AMM_ABI from "../abi/AMM.json";
import ERC20_ABI from "../abi/ERC20.json";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import PriceBanner from "../components/PriceBanner";
import theme from "../components/theme";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function BuyPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [tokenToBuy, setTokenToBuy] = useState<"A" | "B">("A");
  const [tokenAmount, setTokenAmount] = useState("");
  const [ethRequired, setEthRequired] = useState("0");
  const [feeRate, setFeeRate] = useState(0);
  const [feeEth, setFeeEth] = useState("0");
  const [resultMsg, setResultMsg] = useState("");

  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (tokenAmount) {
      calculateRequiredETH(tokenAmount);
    }
  }, [tokenAmount, tokenToBuy]);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const user = accounts[0];
    setAccount(user);
    fetchBalances(user);
  };

  const fetchBalances = async (user: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, ERC20_ABI, provider);
    const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, ERC20_ABI, provider);

    const balanceA = await tokenA.balanceOf(user);
    const balanceB = await tokenB.balanceOf(user);

    setBalanceA(ethers.formatUnits(balanceA, DECIMALS));
    setBalanceB(ethers.formatUnits(balanceB, DECIMALS));
  };

  const calculateRequiredETH = async (value: string) => {
    if (!value || isNaN(Number(value))) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const reserveA = await contract.reserveA();
    const reserveB = await contract.reserveB();

    const tokenOut = ethers.parseUnits(value, DECIMALS);
    const reserveIn = tokenToBuy === "A" ? reserveB : reserveA;
    const reserveOut = tokenToBuy === "A" ? reserveA : reserveB;

    // 反向推导 ETH amountInWithFee
    const amountInWithFee = (tokenOut * reserveIn) / (reserveOut - tokenOut);
    const dynamicFee = await contract.getDynamicFeeRate(amountInWithFee, reserveIn);
    const fee = (amountInWithFee * BigInt(dynamicFee)) / 8000n;
    const totalETH = amountInWithFee + fee;

    setFeeRate(Number(dynamicFee));
    setFeeEth(ethers.formatUnits(fee, "ether"));
    setEthRequired(ethers.formatUnits(totalETH, "ether"));
  };

  const handleBuy = async () => {
    if (!account || !tokenAmount || !ethRequired) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

      const tokenAddress = tokenToBuy === "A" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;

      setResultMsg("⏳ buying...");

      const tx = await amm.buyWithETH(tokenAddress, {
        value: ethers.parseEther(ethRequired),
      });
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setResultMsg(`✅ successfully buy  ${tokenAmount} Token ${tokenToBuy}`);
        setTokenAmount("");
        setEthRequired("0");
        setFeeEth("0");
        fetchBalances(account!);
        window.dispatchEvent(new Event("priceRefresh"));
      } else {
        setResultMsg("❌ Purchase failed, please try again");
      }
    } catch (err) {
      console.error("Purchase failed", err);
      setResultMsg("❌ Transaction failed or user canceled");
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
          marginTop: 16,
        }}
      >
        <Typography.Title level={3} style={{ color: theme.textColor }}>
          🛒 buy Token
        </Typography.Title>
        <PriceBanner />

        {account && (
          <>
            <Typography.Paragraph style={{ color: theme.textColor }}>
              👛 Current Account：<strong>{account}</strong>
            </Typography.Paragraph>
            <Typography.Paragraph style={{ color: theme.textColor }}>
              🎒 Token A balance：<strong>{balanceA}</strong>
              <br />
              🎒 Token B balance：<strong>{balanceB}</strong>
            </Typography.Paragraph>
            <Divider />
          </>
        )}

        <Select
          value={tokenToBuy}
          onChange={(v) => {
            setTokenToBuy(v);
            if (tokenAmount) calculateRequiredETH(tokenAmount);
          }}
          options={[
            { label: "Token A", value: "A" },
            { label: "Token B", value: "B" },
          ]}
          style={{ width: "100%", marginBottom: 16 }}
        />

        <Input
          placeholder="Enter the purchase quantity"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          style={{
            marginBottom: 16,
            background: theme.inputBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor,
            borderRadius: 12,
            padding: "12px 16px",
          }}
        />

        <Typography.Paragraph style={{ marginBottom: 4 }}>
        Current dynamic fee rate：<strong>{(feeRate / 10).toFixed(1)}‰</strong>
        </Typography.Paragraph>
        <Typography.Paragraph style={{ marginBottom: 4 }}>
        Estimated handling fee ≈ <strong>{feeEth}</strong> ETH
        </Typography.Paragraph>
        <Typography.Text type="secondary">
        Current estimated total payment ETH：<strong>{ethRequired}</strong>
        </Typography.Text>

        <Button
          type="primary"
          block
          onClick={handleBuy}
          disabled={!account || !tokenAmount}
          style={{
            marginTop: 16,
            background: theme.buttonGradient,
            border: "none",
            borderRadius: 12,
            height: 48,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          buy Token {tokenToBuy}
        </Button>

        {resultMsg && (
          <Alert
            message={resultMsg}
            type={resultMsg.startsWith("✅") ? "success" : resultMsg.startsWith("⏳") ? "info" : "error"}
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    </Layout>
  );
}