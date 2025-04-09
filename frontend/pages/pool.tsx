import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Typography, Card } from "antd";
import AMM_ABI from "../abi/AMM.json";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const DECIMALS = 18;

export default function PoolStatusPage() {
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");
  const [lpTotalSupply, setLpTotalSupply] = useState("0");
  const [priceAtoB, setPriceAtoB] = useState("0");
  const [priceBtoA, setPriceBtoA] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      loadPoolData();
    }
  }, []);

  const loadPoolData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const reserveA_raw = await contract.reserveA();
    const reserveB_raw = await contract.reserveB();
    const totalLP_raw = await contract.totalSupply();

    const formattedA = ethers.formatUnits(reserveA_raw, DECIMALS);
    const formattedB = ethers.formatUnits(reserveB_raw, DECIMALS);
    const formattedLP = ethers.formatUnits(totalLP_raw, DECIMALS);

    setReserveA(formattedA);
    setReserveB(formattedB);
    setLpTotalSupply(formattedLP);

    if (+formattedA > 0 && +formattedB > 0) {
      setPriceAtoB((+formattedB / +formattedA).toFixed(6));
      setPriceBtoA((+formattedA / +formattedB).toFixed(6));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <Typography.Title level={3}>📊 AMM 池子状态</Typography.Title>

      <Card style={{ marginBottom: "1rem" }}>
        Token A：<strong>{reserveA}</strong> <br />
        Token B：<strong>{reserveB}</strong>
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        1 A ≈ <strong>{priceAtoB}</strong> B <br />
        1 B ≈ <strong>{priceBtoA}</strong> A
      </Card>

      <Card>
        LP Token 总供应量：<strong>{lpTotalSupply}</strong>
      </Card>
    </div>
  );
}