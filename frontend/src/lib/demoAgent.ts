/**
 * Static demo data source for portfolio deployments.
 * It mimics the backend SSE event stream without requiring FastAPI or Docker.
 */
import type { AgentEvent } from "../types/agent";

type DemoScenario = {
  keywords: string[];
  result: Array<Record<string, string | number>>;
};

const steps = [
  "抽取关键词",
  "召回字段信息",
  "召回指标信息",
  "召回字段取值",
  "合并召回信息",
  "过滤指标信息",
  "过滤表信息",
  "添加额外上下文",
  "生成SQL",
  "校验SQL",
  "执行SQL",
];

const scenarios: DemoScenario[] = [
  {
    keywords: ["各大区", "GMV", "第一季度"],
    result: [
      { region_name: "华东", gmv: 81627, order_count: 28 },
      { region_name: "华南", gmv: 73431, order_count: 25 },
      { region_name: "华北", gmv: 62897, order_count: 22 },
      { region_name: "西南", gmv: 47659, order_count: 20 },
      { region_name: "华中", gmv: 40231, order_count: 18 },
    ],
  },
  {
    keywords: ["商品品类", "销量", "销售额"],
    result: [
      { category: "手机数码", sales_quantity: 21, sales_amount: 115284 },
      { category: "家用电器", sales_quantity: 18, sales_amount: 58192 },
      { category: "食品饮料", sales_quantity: 162, sales_amount: 3740 },
      { category: "休闲零食", sales_quantity: 216, sales_amount: 947 },
      { category: "鞋靴", sales_quantity: 13, sales_amount: 15387 },
    ],
  },
  {
    keywords: ["华东", "销售额最高", "商品"],
    result: [
      { product_name: "Galaxy S24 Ultra", category: "手机数码", sales_amount: 28497 },
      { product_name: "iPhone 15 Pro", category: "手机数码", sales_amount: 26997 },
      { product_name: "Mate 60 Pro", category: "手机数码", sales_amount: 20997 },
      { product_name: "戴森 V15 吸尘器", category: "家用电器", sales_amount: 10998 },
      { product_name: "美的空调 KFR-35GW", category: "家用电器", sales_amount: 6400 },
    ],
  },
  {
    keywords: ["会员等级", "订单数", "销售额"],
    result: [
      { member_level: "黄金", order_count: 31, sales_amount: 126832 },
      { member_level: "铂金", order_count: 24, sales_amount: 98743 },
      { member_level: "白银", order_count: 27, sales_amount: 63418 },
      { member_level: "青铜", order_count: 21, sales_amount: 45961 },
    ],
  },
];

function pickScenario(query: string) {
  const normalized = query.toLowerCase();
  return (
    scenarios.find((scenario) =>
      scenario.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
    ) ?? scenarios[0]
  );
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export async function streamDemoQuery(
  query: string,
  options: {
    signal?: AbortSignal;
    onEvent: (event: AgentEvent) => void;
  },
) {
  const scenario = pickScenario(query);

  for (const step of steps) {
    options.onEvent({ type: "progress", step, status: "running" });
    await wait(180, options.signal);
    options.onEvent({ type: "progress", step, status: "success" });
    await wait(70, options.signal);
  }

  options.onEvent({ type: "result", data: scenario.result });
}
