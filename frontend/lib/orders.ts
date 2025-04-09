// lib/orders.ts

export type LimitOrder = {
  id: string;
  owner: string;
  direction: "AtoB" | "BtoA";
  amountIn: string;
  targetPrice: number;
  placedAt: string;
  status: "pending" | "executed" | "cancelled";
  txHash?: string;
};

const STORAGE_KEY = "limit_orders";

export const loadOrders = (): LimitOrder[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveOrder = (order: LimitOrder) => {
  const orders = loadOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...orders, order]));
  console.log("📦 限价单已保存", order);
};

export const updateOrderStatus = (
  id: string,
  status: LimitOrder["status"],
  txHash?: string
) => {
  const orders = loadOrders();
  const updated = orders.map((o) =>
    o.id === id
      ? {
          ...o,
          status,
          txHash: txHash ?? o.txHash,
        }
      : o
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  console.log(`✅ 订单 ${id} 状态已更新为 ${status}`, txHash ? `Tx: ${txHash}` : "");
};

export const removeOrder = (id: string) => {
  const orders = loadOrders().map((o) =>
    o.id === id ? { ...o, status: "cancelled" } : o
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  console.log(`🚫 订单 ${id} 已取消`);
};