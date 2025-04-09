// components/Layout.tsx
import { Layout as AntLayout } from "antd";
import PriceBar from "./PriceBanner";
import LimitOrderExecutor from "./LimitOrderExecutor";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AntLayout>
      <PriceBar />
      <LimitOrderExecutor /> {/* ✅ 全局注入 */}
      <AntLayout.Content style={{ padding: "2rem" }}>
        {children}
      </AntLayout.Content>
    </AntLayout>
  );
}