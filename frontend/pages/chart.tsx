// pages/chart.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ReactECharts from "echarts-for-react";
import { Segmented, Typography } from "antd";
import AMM_ABI from "../abi/AMM.json";
import PriceBanner from "../components/PriceBanner";
import theme from "../components/theme";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const TOKEN_A = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const TOKEN_B = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;
const GROUP_SIZE = 5;

type ChartType = "KLine" | "Reserve" | "Volume" | "Liquidity" | "PriceA" | "PriceB";

type EventPoint = {
  block: number;
  type: "Swap" | "AddLiquidity" | "RemoveLiquidity" | "Buy";
  tokenIn?: string;
  amountIn: bigint;
  amountOut: bigint;
  reserveA: bigint;
  reserveB: bigint;
};

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>("KLine");
  const [points, setPoints] = useState<EventPoint[]>([]);
  const [lpSupplyMap, setLpSupplyMap] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    if (window.ethereum) loadData();
  }, []);

  const loadData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const swaps = await contract.queryFilter(contract.getEvent("Swap"), 0, "latest");
    const adds = await contract.queryFilter(contract.getEvent("AddLiquidity"), 0, "latest");
    const removes = await contract.queryFilter(contract.getEvent("RemoveLiquidity"), 0, "latest");
    const buys = await contract.queryFilter(contract.getEvent("BuyWithETH"), 0, "latest");

    const all: EventPoint[] = [];

    for (const log of swaps) {
      const [_, tokenIn, , amountIn, amountOut] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "Swap", tokenIn, amountIn, amountOut, reserveA, reserveB });
    }

    for (const log of buys) {
      const [_, tokenOut, ethIn, amountOut] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      const isBuyA = tokenOut.toLowerCase() === TOKEN_A.toLowerCase();
      const tokenIn = isBuyA ? TOKEN_B : TOKEN_A;
      all.push({
        block: log.blockNumber,
        type: "Buy",
        tokenIn,
        amountIn: ethIn,
        amountOut,
        reserveA,
        reserveB,
      });
    }

    for (const log of adds) {
      const [_, amountA, amountB, liquidity] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "AddLiquidity", amountIn: amountA, amountOut: liquidity, reserveA, reserveB });
    }

    for (const log of removes) {
      const [_, amountA, amountB, liquidity] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "RemoveLiquidity", amountIn: amountA, amountOut: liquidity, reserveA, reserveB });
    }

    all.sort((a, b) => a.block - b.block);
    setPoints(all);

    const lpMap = new Map<number, number>();
    for (const point of all) {
      const total = await contract.totalSupply({ blockTag: point.block });
      lpMap.set(point.block, Number(ethers.formatUnits(total, DECIMALS)));
    }
    setLpSupplyMap(lpMap);
  };

  const format = (val: bigint) => Number(ethers.formatUnits(val, DECIMALS));

  const getOption = () => {
    if (chartType === "KLine") {
      const grouped = new Map<number, number[]>();
    
      points.forEach((p) => {
        if (!p.amountIn || !p.amountOut) return;
    
        const group = Math.floor(p.block / GROUP_SIZE) * GROUP_SIZE;
        const price = format(p.amountOut) / format(p.amountIn || 1n);
    
        if (!grouped.has(group)) grouped.set(group, []);
        grouped.get(group)!.push(price);
      });
    
      const ohlcData: { block: number; ohlc: [number, number, number, number] }[] = [];
    
      for (const [block, prices] of grouped.entries()) {
        if (!prices.length) continue;
    
        const open = prices[0];
        const close = prices[prices.length - 1];
        const high = Math.max(...prices, open, close);
        const low = Math.min(...prices, open, close);
    
        ohlcData.push({ block, ohlc: [open, close, low, high] });
      }
    
      return {
        title: { text: "Price candlestick chart" },
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: ohlcData.map((o) => o.block.toString())
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "candlestick",
            data: ohlcData.map((o) => o.ohlc)
          }
        ]
      };
    }

    if (chartType === "Reserve") {
      return {
        title: { text: "Token Reserve Changes" },
        tooltip: { trigger: "axis" },
        legend: { data: ["Reserve A", "Reserve B"] },
        xAxis: { type: "category", data: points.map((p) => p.block) },
        yAxis: { type: "value" },
        series: [
          { name: "Reserve A", type: "line", data: points.map((p) => format(p.reserveA)) },
          { name: "Reserve B", type: "line", data: points.map((p) => format(p.reserveB)) },
        ],
      };
    }

    if (chartType === "Volume") {
      const relevant = points.filter((p) => p.type === "Swap" || p.type === "Buy");
      return {
        title: { text: "Swap / Buy Volume" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: relevant.map((p) => p.block) },
        yAxis: { type: "value" },
        series: [{ name: "Amount In", type: "bar", data: relevant.map((p) => format(p.amountIn)) }],
      };
    }

    if (chartType === "Liquidity") {
      const blocks = Array.from(lpSupplyMap.keys());
      return {
        title: { text: "LP Token Total Supply" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: blocks.map((b) => b.toString()) },
        yAxis: { type: "value" },
        series: [
          {
            type: "line",
            name: "LP Supply",
            data: blocks.map((b) => lpSupplyMap.get(b)!),
          },
        ],
      };
    }

    if (chartType === "PriceA" || chartType === "PriceB") {
      const isA = chartType === "PriceA";
      const prices: { block: number; price: number }[] = [];

      points.forEach((p) => {
        if (!p.tokenIn) return;
        const tokenIn = p.tokenIn.toLowerCase();
        const amountIn = format(p.amountIn);
        const amountOut = format(p.amountOut);
        if (amountIn === 0 || amountOut === 0) return;

        if (tokenIn === TOKEN_A.toLowerCase()) {
          const price = amountOut / amountIn;
          prices.push({ block: p.block, price: isA ? price : 1 / price });
        } else if (tokenIn === TOKEN_B.toLowerCase()) {
          const price = amountIn / amountOut;
          prices.push({ block: p.block, price: isA ? price : 1 / price });
        }
      });

      if (points.length > 0) {
        const latest = points[points.length - 1];
        const reserveA = format(latest.reserveA);
        const reserveB = format(latest.reserveB);
        if (reserveA > 0 && reserveB > 0) {
          const lastBlock = latest.block + 1;
          const price = reserveB / reserveA;
          prices.push({ block: lastBlock, price: isA ? price : 1 / price });
        }
      }

      return {
        title: { text: `Token ${isA ? "A→B" : "B→A"} Price Trends` },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: prices.map((p) => p.block.toString()) },
        yAxis: { type: "value" },
        series: [{ type: "line", name: "price", data: prices.map((p) => p.price) }],
      };
    }

    return {};
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "auto", padding: "2rem", background: theme.background, borderRadius: 20, boxShadow: theme.cardShadow }}>
        <Typography.Title level={3} style={{ color: theme.textColor }}>📊 图表分析</Typography.Title>
        <PriceBanner />
        <Segmented
          options={[
            { label: "K line", value: "KLine" },
            { label: "Reserve", value: "Reserve" },
            { label: "Swap + Buy", value: "Volume" },
            { label: "LP Changes", value: "Liquidity" },
            { label: "Token A price", value: "PriceA" },
            { label: "Token B price", value: "PriceB" },
          ]}
          value={chartType}
          onChange={(val) => setChartType(val as ChartType)}
          style={{ marginBottom: 24 }}
        />
        <ReactECharts option={getOption()} style={{ height: 500 }} />
      </div>
    </Layout>
  );
}