# RetailInsight Agent

面向电商数仓场景的智能问数 Agent。用户可以用自然语言提出经营分析问题，系统会召回相关表、字段、指标和值域信息，生成可执行 SQL，并通过流式接口返回查询过程与结果。

这个仓库用于个人作品集和面试展示，重点展示一条完整的 AI 数据应用链路：元数据知识库构建、混合检索、LangGraph 工作流编排、SQL 生成校验闭环、FastAPI SSE 接口和 React 前端展示。

![RetailInsight Agent home](docs/images/retail-insight-home.jpg)

## 在线演示

本项目支持静态 Demo 模式。部署到 GitHub Pages 后，访问者无需启动后端、数据库或 Docker，也可以在网页上体验聊天式问数界面、LangGraph 执行流程和查询结果展示。

> 静态 Demo 使用内置样例数据模拟 Agent 事件流，用于作品集展示。完整后端链路仍需按“本地运行”章节启动 FastAPI、MySQL、Qdrant、Elasticsearch 和 Embedding 服务。

GitHub Pages 部署方式：

1. 将仓库推送到 GitHub，并确保默认分支为 `main`。
2. 进入 GitHub 仓库的 `Settings -> Pages`。
3. 在 `Build and deployment` 中选择 `GitHub Actions`。
4. 推送代码后等待 `Deploy frontend demo to GitHub Pages` workflow 完成。
5. 在 README 顶部补充你的在线演示链接，例如 `https://<your-name>.github.io/retail-insight-agent/`。

## 项目定位

在真实业务问数场景中，业务同学往往只知道“想看什么”，但不知道数据表、字段名、指标口径和字段取值。直接让大模型从自然语言生成 SQL，容易出现表选错、字段选错、条件值不匹配和指标口径漂移。

RetailInsight Agent 的核心思路是先检索、再生成：

- 从 Meta MySQL 中维护表、字段、指标和字段关系。
- 用 Qdrant 召回字段和指标语义信息。
- 用 Elasticsearch 召回真实字段取值。
- 用 LangGraph 编排多阶段问数流程。
- 用 MySQL `EXPLAIN` 校验 SQL，再执行真实查询。
- 用 FastAPI + SSE 把节点进度和结果流式返回前端。

## 系统架构

![RetailInsight Agent architecture](docs/images/retail-insight-system-architecture.svg)

| 层次 | 技术 | 作用 |
| --- | --- | --- |
| 数仓层 | MySQL | 保存教学电商数仓表和查询数据 |
| 元数据层 | MySQL / SQLAlchemy | 保存表、字段、指标、字段指标关系 |
| 检索层 | Qdrant / Elasticsearch | 字段指标语义召回、字段取值全文检索 |
| 模型层 | LangChain / LLM / TEI Embedding | 关键词扩展、上下文过滤、SQL 生成与修正 |
| 编排层 | LangGraph | 串联多阶段 Agent 工作流 |
| 接口层 | FastAPI / SSE | 提供自然语言问数流式接口 |
| 前端层 | React / Vite / Tailwind CSS | 聊天式问数界面和执行过程展示 |

## Agent 工作流

```text
用户问题
  -> 关键词抽取
  -> 字段召回 / 指标召回 / 字段取值召回
  -> 召回信息合并
  -> 表字段过滤 / 指标过滤
  -> 日期和数据库上下文补全
  -> SQL 生成
  -> SQL 校验
  -> SQL 修正
  -> SQL 执行
  -> SSE 返回结果
```

核心编排代码在 [app/agent/graph.py](app/agent/graph.py)，每个节点只负责一个清晰阶段，节点之间通过 `DataAgentState` 传递业务状态，通过 `DataAgentContext` 注入外部依赖。

## 代码结构

```text
retail-insight-agent/
├── app/
│   ├── agent/            # LangGraph 状态、上下文、图编排和节点
│   ├── api/              # FastAPI 路由、依赖注入和生命周期
│   ├── clients/          # MySQL、Qdrant、ES、Embedding 客户端管理
│   ├── conf/             # 配置 dataclass
│   ├── core/             # 日志和 request_id 上下文
│   ├── entities/         # 业务实体
│   ├── models/           # SQLAlchemy ORM 模型
│   ├── repositories/     # MySQL / Qdrant / ES 仓储层
│   ├── scripts/          # 元数据知识库构建脚本
│   └── services/         # 查询服务和元数据构建服务
├── conf/                 # 运行配置与元数据配置
├── docker/               # MySQL、ES、Qdrant、Embedding 本地服务
├── frontend/             # React 前端
├── prompts/              # SQL 生成、修正、过滤等 Prompt
├── main.py               # FastAPI 应用入口
└── pyproject.toml        # Python 依赖配置
```

## 本地运行

### 1. 准备环境

- Python `>= 3.14`
- `uv`
- Docker 与 Docker Compose
- Node.js 与 `pnpm`

### 2. 安装后端依赖

```bash
uv sync
```

### 3. 配置大模型密钥

```bash
cp .env.example .env
```

然后在 `.env` 中配置：

```bash
LLM_API_KEY=your_real_api_key
```

默认模型配置在 [conf/app_config.yaml](conf/app_config.yaml)。

### 4. 准备 Embedding 模型

项目默认使用 `BAAI/bge-large-zh-v1.5`，需要放到 Docker 挂载目录：

```bash
uv run hf download BAAI/bge-large-zh-v1.5 --local-dir docker/embedding/bge-large-zh-v1.5
```

`docker/embedding/` 已加入 `.gitignore`，不会上传大模型文件。

### 5. 启动基础服务

```bash
docker compose -f docker/docker-compose.yaml up -d
```

默认端口：

| 服务 | 端口 |
| --- | --- |
| MySQL | `3306` |
| Elasticsearch | `9200` |
| Kibana | `5601` |
| Qdrant | `6333` |
| Embedding | `8081` |

### 6. 构建元数据知识库

```bash
uv run python -m app.scripts.build_meta_knowledge -c conf/meta_config.yaml
```

这一步会把表字段元数据写入 Meta MySQL，把字段和指标向量写入 Qdrant，并把可同步字段的真实取值写入 Elasticsearch。

### 7. 启动后端

```bash
uv run fastapi dev main.py
```

接口地址：

```text
POST http://127.0.0.1:8000/api/query
```

请求示例：

```json
{
  "query": "统计 2025 年第一季度各大区的 GMV，并按 GMV 从高到低排序"
}
```

### 8. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

前端默认通过 Vite 代理访问后端 `/api`。

如果只想本地预览静态 Demo：

```bash
cd frontend
pnpm install
$env:VITE_DEMO_MODE="true"
pnpm dev
```

## 数据与指标

教学数仓初始化脚本在 [docker/mysql/dw.sql](docker/mysql/dw.sql)，包含：

- `fact_order`：订单事实表
- `dim_region`：地区维度表
- `dim_customer`：客户维度表
- `dim_product`：商品维度表
- `dim_date`：日期维度表

元数据配置在 [conf/meta_config.yaml](conf/meta_config.yaml)，当前维护了字段描述、别名、同步开关，以及 `GMV`、`AOV` 等指标定义。

## 面试讲解要点

- 为什么不能让大模型直接生成 SQL，而要先做元数据召回。
- Qdrant 和 Elasticsearch 在问数场景中的分工。
- LangGraph 的 `State` 和 `Context` 如何隔离业务状态与外部依赖。
- 为什么 SQL 生成前要做表字段过滤和指标过滤。
- 为什么用真实数据库 `EXPLAIN` 做 SQL 校验。
- FastAPI 如何把 LangGraph 节点进度包装成 SSE 流式响应。
- 前端如何消费 SSE，并展示执行步骤和查询结果。

## 后续改造计划

- 增加 SQL 安全白名单和只读查询限制。
- 增加多轮追问和上下文改写能力。
- 增加结果图表自动推荐。
- 增加离线评测集，记录 SQL 生成准确率。
- 增加 Docker Compose 一键启动说明和健康检查脚本。

## 开源许可与来源说明

本仓库基于 MIT License 项目进行学习、整理和二次包装，保留原始许可证文件。原始项目为 `shopkeeper-agent`，来自 didilili 的 AI Agent 教程体系。

当前仓库的定位是个人学习与作品集展示版本。后续提交会继续补充个人改造记录、运行截图、评测样例和工程化增强内容。
