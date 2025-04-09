import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ReactECharts from "echarts-for-react";
import { Segmented, Typography } from "antd";
import AMM_ABI from "../abi/AMM.json";
import PriceBanner from "../components/PriceBanner";
import theme from "../components/theme";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
// ✅ 加入全局价格组件

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const DECIMALS = 18;
const GROUP_SIZE = 5;

type ChartType = "KLine" | "Reserve" | "Volume" | "Liquidity" | "PriceA" | "PriceB";

type EventPoint = {
  block: number;
  type: "Swap" | "AddLiquidity" | "RemoveLiquidity";
  tokenIn?: string;
  amountIn: bigint;
  amountOut: bigint;
  reserveA: bigint;
  reserveB: bigint;
};

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>("KLine");
  const [points, setPoints] = useState<EventPoint[]>([]);

  useEffect(() => {
    if (window.ethereum) loadData();
  }, []);

  const loadData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const swaps = await contract.queryFilter(contract.getEvent("Swap"), 0, "latest");
    const adds = await contract.queryFilter(contract.getEvent("AddLiquidity"), 0, "latest");
    const removes = await contract.queryFilter(contract.getEvent("RemoveLiquidity"), 0, "latest");

    const all: EventPoint[] = [];

    for (const log of swaps) {
      const [sender, tokenIn, tokenOut, amountIn, amountOut] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "Swap", tokenIn, amountIn, amountOut, reserveA, reserveB });
    }

    for (const log of adds) {
      const [sender, amountA, amountB, liquidity] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "AddLiquidity", amountIn: amountA, amountOut: amountB, reserveA, reserveB });
    }

    for (const log of removes) {
      const [sender, amountA, amountB, liquidity] = log.args;
      const reserveA = await contract.reserveA({ blockTag: log.blockNumber });
      const reserveB = await contract.reserveB({ blockTag: log.blockNumber });
      all.push({ block: log.blockNumber, type: "RemoveLiquidity", amountIn: amountA, amountOut: amountB, reserveA, reserveB });
    }

    all.sort((a, b) => a.block - b.block);
    setPoints(all);
  };

  const format = (val: bigint) => Number(ethers.formatUnits(val, DECIMALS));

  const getOption = () => {
    if (chartType === "KLine") {
      const grouped = new Map<number, number[]>();
      points.forEach((p) => {
        const group = Math.floor(p.block / GROUP_SIZE) * GROUP_SIZE;
        const price = format(p.amountOut) / format(p.amountIn || 1n);
        if (!grouped.has(group)) grouped.set(group, []);
        grouped.get(group)!.push(price);
      });

      const ohlc = Array.from(grouped.entries()).map(([block, prices]) => [
        block,
        prices[0],
        Math.max(...prices),
        Math.min(...prices),
        prices[prices.length - 1],
      ]);

      return {
        title: { text: "价格 K 线图" },
        tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
        xAxis: { type: "category", data: ohlc.map((o) => o[0].toString()) },
        yAxis: { type: "value", scale: true },
        series: [
          {
            type: "candlestick",
            data: ohlc.map(([, o, h, l, c]) => [o, h, l, c]),
          },
        ],
      };
    }

    if (chartType === "Reserve") {
      const x = points.map((p) => p.block);
      return {
        title: { text: "Token 储备变化" },
        tooltip: { trigger: "axis" },
        legend: { data: ["Reserve A", "Reserve B"] },
        xAxis: { type: "category", data: x },
        yAxis: { type: "value" },
        series: [
          {
            name: "Reserve A",
            type: "line",
            data: points.map((p) => format(p.reserveA)),
          },
          {
            name: "Reserve B",
            type: "line",
            data: points.map((p) => format(p.reserveB)),
          },
        ],
      };
    }

    if (chartType === "Volume") {
      const swapPoints = points.filter((p) => p.type === "Swap");
      return {
        title: { text: "Swap 成交量" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: swapPoints.map((p) => p.block) },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            name: "Amount In",
            data: swapPoints.map((p) => format(p.amountIn)),
          },
        ],
      };
    }

    if (chartType === "Liquidity") {
      let total = 0;
      const history: number[] = [];
      points.forEach((p) => {
        if (p.type === "AddLiquidity") total += Number(format(p.amountIn));
        if (p.type === "RemoveLiquidity") total -= Number(format(p.amountIn));
        history.push(total);
      });

      return {
        title: { text: "LP 流动性变化" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: points.map((p) => p.block) },
        yAxis: { type: "value" },
        series: [
          {
            type: "line",
            name: "流动性",
            data: history,
          },
        ],
      };
    }

    if (chartType === "PriceA" || chartType === "PriceB") {
      const filtered = points.filter((p) => {
        if (!p.tokenIn) return true;
        return chartType === "PriceA"
          ? p.tokenIn === process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS
          : p.tokenIn === process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS;
      });

      return {
        title: { text: `Token ${chartType === "PriceA" ? "A" : "B"} 价格走势` },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: filtered.map((p) => p.block) },
        yAxis: { type: "value" },
        series: [
          {
            type: "line",
            name: "价格",
            data: filtered.map((p) => format(p.amountOut) / format(p.amountIn || 1n)),
          },
        ],
      };
    }

    return {};
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ 
        maxWidth: 1000,
        margin: "auto",
        padding: "2rem",
        background: theme.background,
        borderRadius: 20,
        boxShadow: theme.cardShadow,
        marginTop: 16
      }}>
      <Typography.Title level={3} style={{ color: theme.textColor }}>📊 图表分析</Typography.Title>
      <PriceBanner /> {/* ✅ 插入实时价格组件 */}

      <Segmented
        options={[
          { label: "K线", value: "KLine" },
          { label: "储备量", value: "Reserve" },
          { label: "Swap Volume", value: "Volume" },
          { label: "LP 变化", value: "Liquidity" },
          { label: "Token A 价格", value: "PriceA" },
          { label: "Token B 价格", value: "PriceB" },
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