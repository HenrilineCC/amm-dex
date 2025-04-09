import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Typography, message, Divider, Select } from "antd";
import AMM_ABI from "../abi/AMM.json";
import ERC20_ABI from "../abi/ERC20.json";
import PriceBanner from "../components/PriceBanner";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const tokenAAddress = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const tokenBAddress = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function SwapPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [minOut, setMinOut] = useState<bigint>(0n);
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
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
    const slippageFactor = BigInt(Math.floor((1000 - slippage * 10))); // e.g. 995 for 0.5%
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
        message.info("授权成功 ✅");
      }

      const tx = await amm.swap(tokenIn, parsedAmount, minOut);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        message.success("Swap 成功 ✅");
        setAmountIn("");
        setAmountOut("0");
        window.dispatchEvent(new Event("priceRefresh")); // 更新全局价格组件
      } else {
        message.error("Swap 失败 ❌");
      }
    } catch (err: any) {
      console.error("Swap 错误：", err);
      if (err?.message?.includes("Slippage too high")) {
        message.error("⚠️ 滑点过高，交易失败");
      } else {
        message.error("Swap 出现错误");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: "2rem" }}>
      <Typography.Title level={3}>🔄 Swap</Typography.Title>
      <PriceBanner />

      <Button
        onClick={() => {
          setDirection(direction === "AtoB" ? "BtoA" : "AtoB");
          setAmountOut("0");
          estimateOutput(amountIn);
        }}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        切换方向：{direction === "AtoB" ? "A → B" : "B → A"}
      </Button>

      <Input
        placeholder={`输入 ${direction === "AtoB" ? "Token A" : "Token B"} 数量`}
        value={amountIn}
        onChange={handleAmountChange}
        style={{ marginBottom: "1rem" }}
      />

      <Typography.Text>
        预估获得 {direction === "AtoB" ? "Token B" : "Token A"}：
        <strong>{amountOut}</strong>
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
        disabled={!account || !amountIn}
      >
        执行 Swap
      </Button>
    </div>
  );
}