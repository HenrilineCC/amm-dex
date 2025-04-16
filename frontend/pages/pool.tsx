import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Typography, Card, Button, message } from "antd";
import AMM_ABI from "../abi/AMM.json";
import theme from "../components/theme";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const DECIMALS = 18;

export default function PoolStatusPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");
  const [lpTotalSupply, setLpTotalSupply] = useState("0");
  const [priceAtoB, setPriceAtoB] = useState("0");
  const [priceBtoA, setPriceBtoA] = useState("0");
  const [feesA, setFeesA] = useState("0");
  const [feesB, setFeesB] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      loadPoolData();
    }
  }, []);

  const loadPoolData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);
    const owner = await contract.owner();
    const isOwnerAddress = address.toLowerCase() === owner.toLowerCase();
    setIsOwner(isOwnerAddress);

    const reserveA_raw = await contract.reserveA();
    const reserveB_raw = await contract.reserveB();
    const totalLP_raw = await contract.totalSupply();

    const formattedA = ethers.formatUnits(reserveA_raw, DECIMALS);
    const formattedB = ethers.formatUnits(reserveB_raw, DECIMALS);
    const formattedLP = ethers.formatUnits(totalLP_raw, DECIMALS);

    setReserveA(formattedA);
    setReserveB(formattedB);
    setLpTotalSupply(formattedLP);

    if (isOwnerAddress) {
      const feesA_raw = await contract.collectedFeesA();
      const feesB_raw = await contract.collectedFeesB();
      setFeesA(ethers.formatUnits(feesA_raw, DECIMALS));
      setFeesB(ethers.formatUnits(feesB_raw, DECIMALS));
    }

    if (+formattedA > 0 && +formattedB > 0) {
      setPriceAtoB((+formattedB / +formattedA).toFixed(6));
      setPriceBtoA((+formattedA / +formattedB).toFixed(6));
    }
  };

  const handleWithdrawFees = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

      const tx = await contract.withdrawFees();
      await tx.wait();
      message.success("The handling fee has been successfully withdrawn ✅");
      loadPoolData();
    } catch (err) {
      console.error(err);
      message.error("Fee withdrawal failed ❌");
    }
  };

  return (
    <Layout>
      <Navbar />
      <div
        style={{
          padding: "2rem",
          maxWidth: 600,
          margin: "auto",
          background: theme.background,
          borderRadius: 20,
          boxShadow: theme.cardShadow,
          marginTop: 16,
        }}
      >
        <Typography.Title level={3} style={{ color: theme.textColor }}>
          📊 AMM Pool Status
        </Typography.Title>

        <Card
          style={{
            marginBottom: "1rem",
            background: theme.background,
            borderRadius: 12,
            boxShadow: theme.cardShadow,
          }}
        >
          Token A：<strong>{reserveA}</strong> <br />
          Token B：<strong>{reserveB}</strong>
        </Card>

        <Card
          style={{
            marginBottom: "1rem",
            background: theme.background,
            borderRadius: 12,
            boxShadow: theme.cardShadow,
          }}
        >
          1 A ≈ <strong>{priceAtoB}</strong> B <br />
          1 B ≈ <strong>{priceBtoA}</strong> A
        </Card>

        <Card
          style={{
            marginBottom: "1rem",
            background: theme.background,
            borderRadius: 12,
            boxShadow: theme.cardShadow,
          }}
        >
          LP Token Total Supply:<strong>{lpTotalSupply}</strong>
        </Card>

        {isOwner && (
          <>
            <Card
              style={{
                marginBottom: "1rem",
                background: theme.background,
                borderRadius: 12,
                boxShadow: theme.cardShadow,
              }}
            >
              <Typography.Text strong>Cumulative handling fee (only visible to administrators)</Typography.Text> <br />
              Token A: <strong>{feesA}</strong> <br />
              Token B: <strong>{feesB}</strong>
            </Card>

            <Button type="primary" block onClick={handleWithdrawFees}>
            Withdraw all fees
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}