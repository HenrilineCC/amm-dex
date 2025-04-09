// components/PriceBanner.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AMM_ABI from "../abi/AMM.json";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const DECIMALS = 18;

export default function PriceBanner() {
  const [priceAtoB, setPriceAtoB] = useState("...");
  const [priceBtoA, setPriceBtoA] = useState("...");

  const fetchPrice = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

      const reserveA = await amm.reserveA();
      const reserveB = await amm.reserveB();

      const a = Number(ethers.formatUnits(reserveA, DECIMALS));
      const b = Number(ethers.formatUnits(reserveB, DECIMALS));

      setPriceAtoB((b / a).toFixed(6));
      setPriceBtoA((a / b).toFixed(6));
    } catch (err) {
      console.error("获取价格失败", err);
    }
  };

  useEffect(() => {
    fetchPrice();

    // ✅ 监听自定义刷新事件
    const handler = () => fetchPrice();
    window.addEventListener("priceRefresh", handler);
    return () => window.removeEventListener("priceRefresh", handler);
  }, []);

  return (
    <div
      style={{
        background: "#f0f2f5",
        padding: "8px 16px",
        marginBottom: 16,
        borderRadius: 6,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      当前价格：Token A → B = {priceAtoB}，Token B → A = {priceBtoA}
    </div>
  );
}