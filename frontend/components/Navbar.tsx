import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import theme from '../components/theme';
import { SwapOutlined, PlusOutlined, LineChartOutlined, HistoryOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default function Navbar() {
  const router = useRouter();
  
  const items = [
    { label: <Link href="/swap">Swap</Link>, key: "swap", icon: <SwapOutlined /> },
    { label: <Link href="/liquidity">Liquidity</Link>, key: "liquidity", icon: <PlusOutlined /> },
    { label: <Link href="/pool">Pool</Link>, key: "pool", icon: <UnorderedListOutlined /> },
    { label: <Link href="/chart">Chart</Link>, key: "chart", icon: <LineChartOutlined /> },
    { label: <Link href="/history">History</Link>, key: "history", icon: <HistoryOutlined /> },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[router.pathname.split('/')[1] || 'swap']}
      items={items}
      style={{
        background: theme.background,
        color: theme.textColor,
        borderBottom: `1px solid ${theme.borderColor}`,
        padding: "0 1rem",
      }}
    />
  );
}