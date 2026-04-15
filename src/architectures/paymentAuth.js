const CDN = "https://cdn.jsdelivr.net/npm/aws-icons@latest/icons";

export const ICON_MAP = {
  waf:            `${CDN}/architecture-service/AWSWAF.svg`,
  kms:            `${CDN}/architecture-service/AWSKeyManagementService.svg`,
  cloudwatch:     `${CDN}/architecture-service/AmazonCloudWatch.svg`,
  globalaccel:    `${CDN}/architecture-service/AWSGlobalAccelerator.svg`,
  nlb:            `${CDN}/architecture-service/ElasticLoadBalancing.svg`,
  msk:            `${CDN}/architecture-service/AmazonManagedStreamingforApacheKafka.svg`,
  aurora:         `${CDN}/architecture-service/AmazonAurora.svg`,
  elasticache:    `${CDN}/architecture-service/AmazonElastiCache.svg`,
  s3:             `${CDN}/architecture-service/AmazonSimpleStorageService.svg`,
  secretsmanager: `${CDN}/architecture-service/AWSSecretsManager.svg`,
  sagemaker:      `${CDN}/architecture-service/AmazonSageMaker.svg`,
};

export const GROUP_META = {
  external:      { color: "#6B7280", label: "External" },
  edge:          { color: "#378ADD", label: "Edge / Ingress" },
  mesh:          { color: "#1D9E75", label: "Service Mesh" },
  core:          { color: "#7F77DD", label: "Core Services" },
  settlement:    { color: "#D85A30", label: "Settlement" },
  eventing:      { color: "#BA7517", label: "Event Streaming" },
  data:          { color: "#639922", label: "Data Tier" },
  security:      { color: "#D4537E", label: "Security" },
  observability: { color: "#888780", label: "Observability" },
};

export const ARCHITECTURE = {
  title: "Payment Authorization Platform — AWS EKS Architecture",
  description: "PCI-DSS Level 1 · EKS + Istio mTLS · sub-50ms p99 · Mastercard issuer-side processor · MSK event streaming",

  boundaries: [
    // outermost
    { id: "aws",          label: "AWS Cloud",               color: "#232F3E", x: 5,   y: 5,   w: 1440, h: 800, style: "solid" },
    // left: external + edge
    { id: "ext-zone",     label: "External Zone",           color: "#888780", x: 12,  y: 15,  w: 215,  h: 315, style: "solid" },
    { id: "edge-zone",    label: "AWS Edge / Ingress",      color: "#378ADD", x: 12,  y: 340, w: 215,  h: 280, style: "solid" },
    // center: EKS cluster
    { id: "eks",          label: "EKS Cluster (3 AZs — Karpenter)", color: "#534AB7", x: 237, y: 15,  w: 715,  h: 775, style: "dashed" },
    { id: "istio",        label: "Istio Service Mesh (mTLS)",color: "#1D9E75", x: 247, y: 25,  w: 350,  h: 115, style: "dashed" },
    { id: "core-svc",     label: "Core Microservices",      color: "#7F77DD", x: 247, y: 150, w: 695,  h: 255, style: "solid" },
    { id: "settle-layer", label: "Settlement & Tokenization",color: "#D85A30", x: 247, y: 415, w: 695,  h: 195, style: "solid" },
    { id: "streaming",    label: "Event Streaming Bus",     color: "#BA7517", x: 247, y: 620, w: 695,  h: 115, style: "solid" },
    // right: managed services
    { id: "data-tier",    label: "Data Tier",               color: "#639922", x: 962, y: 15,  w: 473,  h: 395, style: "solid" },
    { id: "sec-layer",    label: "Security & Compliance",   color: "#D4537E", x: 962, y: 420, w: 473,  h: 240, style: "solid" },
    { id: "obs-layer",    label: "Observability & GitOps",  color: "#888780", x: 962, y: 670, w: 473,  h: 125, style: "dashed" },
  ],

  nodes: [
    // ── External ──────────────────────────────────────────────────────────────
    {
      id: "merchants", label: "Merchants / POS", iconType: "custom", customIcon: "🏪",
      x: 20, y: 60, group: "external",
      detail: "Point-of-sale terminals, e-commerce checkouts, and mobile payment SDKs. Initiate card-present and card-not-present authorization requests via ISO 8583 or REST APIs.",
    },
    {
      id: "acquirer", label: "Acquirer Bank", iconType: "custom", customIcon: "🏦",
      x: 125, y: 60, group: "external",
      detail: "The acquiring bank routing authorization requests from merchants to the card network for settlement and issuer approval.",
    },
    {
      id: "cardnetwork", label: "Card Network", iconType: "custom", customIcon: "💳",
      x: 72, y: 195, group: "external",
      detail: "Mastercard network routing transactions between acquirers and issuers. Our system is the issuer-side processor receiving these inbound authorization requests.",
    },

    // ── Edge / Ingress ─────────────────────────────────────────────────────────
    {
      id: "globalaccel", label: "Global Accelerator", iconType: "aws", awsIcon: "globalaccel",
      x: 20, y: 375, group: "edge",
      detail: "Anycast IPs route merchant traffic to the nearest AWS edge PoP, then over the AWS backbone to EKS. Reduces first-byte latency 40-60% vs public internet. Static IPs for allowlisting.",
    },
    {
      id: "nlb", label: "Network LB (NLB)", iconType: "aws", awsIcon: "nlb",
      x: 20, y: 480, group: "edge",
      detail: "Layer 4 TCP/TLS load balancer. Chosen over ALB because ISO 8583 is a binary protocol requiring raw TCP pass-through. TLS termination with ACM certificates. Distributes across 3 AZs.",
    },
    {
      id: "waf", label: "AWS WAF", iconType: "aws", awsIcon: "waf",
      x: 125, y: 480, group: "edge",
      detail: "Custom rule groups for payment attack vectors: malformed ISO 8583 injection, credential stuffing, geo-blocking for sanctioned regions, per-merchant rate limiting (2000 req/5min).",
    },

    // ── Istio Mesh ─────────────────────────────────────────────────────────────
    {
      id: "istio-gw", label: "Istio Ingress GW", iconType: "custom", customIcon: "🔀",
      x: 262, y: 50, group: "mesh",
      detail: "Single entry point into the service mesh. mTLS termination, VirtualService routing for canary deployments, AuthorizationPolicy enforcement. Every pod-to-pod hop encrypted via automatic sidecar injection.",
    },

    // ── Core Microservices ────────────────────────────────────────────────────
    {
      id: "api-gw", label: "API Gateway", iconType: "custom", customIcon: "🚪",
      x: 262, y: 195, group: "core",
      detail: "Custom Go service. Merchant authentication (API key + HMAC), token-bucket rate limiting via Redis, ISO 8583 → Protobuf normalization, OpenAPI validation, Datadog trace-id injection. 12 replicas, HPA on CPU target 60%.",
    },
    {
      id: "tx-auth", label: "Tx Authorizer", iconType: "custom", customIcon: "⚡",
      x: 462, y: 195, group: "core",
      detail: "Heart of the platform. Go, p99 < 30ms, stateless, 200+ pods at peak. Flow: parse → parallel fan-out (fraud + Redis balance + velocity) → business rules → approve/decline → publish AuthorizationEvent. gRPC internal comms. PDB minAvailable=80%.",
    },
    {
      id: "fraud-engine", label: "Fraud Engine", iconType: "custom", customIcon: "🔍",
      x: 662, y: 195, group: "core",
      detail: "Hybrid ML + rules engine. Hard rules: velocity checks (>5 txs/60s = review), geo-fencing, BIN risk scoring. SageMaker XGBoost model returns fraud probability in <10ms. Score >0.85 = auto-decline, 0.5-0.85 = manual review.",
    },

    // ── Settlement & Tokenization ─────────────────────────────────────────────
    {
      id: "ledger-svc", label: "Ledger Service", iconType: "custom", customIcon: "📒",
      x: 262, y: 455, group: "settlement",
      detail: "Double-entry accounting engine. Every auth creates PENDING debit/credit entries. Aurora PostgreSQL with SERIALIZABLE isolation. Settlement CronJob every 15 min transitions PENDING → SETTLED. Idempotency keys for retry storms.",
    },
    {
      id: "notification-svc", label: "Notification Svc", iconType: "custom", customIcon: "🔔",
      x: 462, y: 455, group: "settlement",
      detail: "Consumes AuthorizationEvent from Kafka. Delivers webhooks (HTTP POST + HMAC-SHA256), SMS via SNS, push via APNs/FCM. Exponential backoff retry with dead-letter queue. 95% webhooks delivered within 2 seconds.",
    },
    {
      id: "token-vault", label: "Token Vault", iconType: "custom", customIcon: "🔐",
      x: 662, y: 455, group: "settlement",
      detail: "PCI-DSS Level 1 PAN tokenization. Format-preserving encryption (FF1 algorithm). AWS CloudHSM (FIPS 140-2 Level 3) manages keys. Tokenization at API Gateway on ingress; detokenization restricted to Ledger Service via IAM roles.",
    },

    // ── Event Streaming ───────────────────────────────────────────────────────
    {
      id: "msk-kafka", label: "Amazon MSK", iconType: "aws", awsIcon: "msk",
      x: 262, y: 655, group: "eventing",
      detail: "6 brokers across 3 AZs. Topics: authorization-events, settlement-events, fraud-alerts, audit-log. 7-day hot retention → tiered to S3 via MSK Connect for 7-year compliance. Avro schema registry with backward compatibility.",
    },

    // ── Data Tier (right column) ──────────────────────────────────────────────
    {
      id: "aurora", label: "Aurora PostgreSQL", iconType: "aws", awsIcon: "aurora",
      x: 975, y: 55, group: "data",
      detail: "Multi-AZ (1 writer + 2 read replicas). Stores ledger entries (partitioned by month), account balances (row-level locking), merchant configs. pgBouncer pooling (500 connections/instance). KMS encryption. 35-day PITR.",
    },
    {
      id: "elasticache", label: "ElastiCache Redis", iconType: "aws", awsIcon: "elasticache",
      x: 1105, y: 55, group: "data",
      detail: "Cluster mode, 6 shards (3 primary + 3 replica). BIN table cache (daily refresh), velocity counters (24h TTL sliding windows), session tokens, account balance cache (write-through invalidation). Sub-ms p99 reads.",
    },
    {
      id: "s3-athena", label: "S3 + Athena", iconType: "aws", awsIcon: "s3",
      x: 1240, y: 55, group: "data",
      detail: "Data lake. MSK Connect sinks all topics to S3 as Parquet (partitioned by date + merchant). Athena for compliance audits (7-year history), analytics, fraud model training. Lifecycle: Standard (90d) → Intelligent-Tiering (1y) → Glacier (7y).",
    },
    {
      id: "sagemaker", label: "SageMaker", iconType: "aws", awsIcon: "sagemaker",
      x: 975, y: 200, group: "data",
      detail: "Hosts the XGBoost fraud scoring model. Real-time inference endpoint returns fraud probability in <10ms. Nightly transformer model re-scores all transactions. Training pipeline uses S3 Parquet data. Endpoint autoscaling via Application Auto Scaling.",
    },

    // ── Security (right column) ───────────────────────────────────────────────
    {
      id: "kms-vault", label: "KMS + Vault", iconType: "aws", awsIcon: "kms",
      x: 975, y: 460, group: "security",
      detail: "KMS for envelope encryption of all data at rest. HashiCorp Vault on EKS for dynamic secrets (DB creds rotate every 24h, API keys with TTL). Vault Agent sidecar injects secrets via tmpfs — never env vars. CloudHSM backs Token Vault operations.",
    },
    {
      id: "secrets-mgr", label: "Secrets Manager", iconType: "aws", awsIcon: "secretsmanager",
      x: 1105, y: 460, group: "security",
      detail: "Stores/rotates DB master creds (30-day rotation), Kafka SASL/SCRAM creds, third-party API keys. Integrated via Secrets Store CSI Driver — mounted as files, auto-refreshed without pod restarts.",
    },
    {
      id: "opa", label: "OPA Gatekeeper", iconType: "custom", customIcon: "🛡️",
      x: 1240, y: 460, group: "security",
      detail: "Admission policies: no privileged containers, no hostPath, mandatory resource limits, required labels (team, cost-center, pci-scope), allowed registries (private ECR only), no :latest tag (SHA256 digests required). Calico network policies restrict Token Vault to Ledger + API GW only.",
    },

    // ── Observability & GitOps (right column) ─────────────────────────────────
    {
      id: "datadog", label: "Datadog APM", iconType: "custom", customIcon: "📊",
      x: 975, y: 700, group: "observability",
      detail: "Distributed tracing across all services. Dashboards: auth latency heatmap (p50/p95/p99 by merchant), decline rate anomaly detection, Kafka consumer lag, ML model drift. SLOs: auth p99 <50ms (99.9%), availability >99.99%. PagerDuty escalation.",
    },
    {
      id: "argocd", label: "ArgoCD + Helm", iconType: "custom", customIcon: "🔄",
      x: 1105, y: 700, group: "observability",
      detail: "GitOps monorepo: /charts/{service}/values-{env}.yaml. Argo Rollouts canary: 5% traffic for 10 min, auto-promote if error rate <0.1% and p99 <50ms, auto-rollback otherwise. Charts include HPA, PDB, NetworkPolicy, VirtualService, PrometheusRule.",
    },
    {
      id: "karpenter", label: "Karpenter", iconType: "custom", customIcon: "📦",
      x: 1240, y: 700, group: "observability",
      detail: "NodePools: 'critical' = on-demand Graviton3 c7g.2xlarge (Tx Authorizer, Token Vault), 'standard' = spot m7g.xlarge (notifications, fraud batch), 'gpu' = spot g5.xlarge (SageMaker inference fallback). Consolidation enabled, respects PDBs.",
    },
  ],

  flows: [
    // ── Transaction lifecycle (numbered steps) ─────────────────────────────────
    { from: "merchants",      to: "acquirer",        label: "ISO 8583",           step: 1 },
    { from: "acquirer",       to: "cardnetwork",     label: "Network routing",    step: 2 },
    { from: "cardnetwork",    to: "globalaccel",     label: "TLS 1.3",            step: 3 },
    { from: "globalaccel",    to: "nlb",             label: "AWS backbone",       step: 4 },
    { from: "nlb",            to: "waf",             label: "Inspect",            step: 5,  style: "dashed" },
    { from: "nlb",            to: "istio-gw",        label: "TCP pass-through",   step: 6 },
    { from: "istio-gw",       to: "api-gw",          label: "mTLS",               step: 7 },
    { from: "api-gw",         to: "token-vault",     label: "Tokenize PAN",       step: 0,  style: "dashed" },
    { from: "api-gw",         to: "tx-auth",         label: "gRPC / Protobuf",    step: 8 },
    { from: "tx-auth",        to: "fraud-engine",    label: "Parallel fan-out",   step: 9 },
    { from: "tx-auth",        to: "elasticache",     label: "Balance + velocity", step: 0,  style: "dashed" },
    { from: "fraud-engine",   to: "tx-auth",         label: "Score response",     step: 10 },
    { from: "fraud-engine",   to: "sagemaker",       label: "ML inference",       step: 0,  style: "dashed" },
    { from: "tx-auth",        to: "msk-kafka",       label: "AuthorizationEvent", step: 11 },
    { from: "msk-kafka",      to: "ledger-svc",      label: "Consume events",     step: 12 },
    { from: "msk-kafka",      to: "notification-svc",label: "Consume events",     step: 0 },
    { from: "msk-kafka",      to: "s3-athena",       label: "MSK Connect sink",   step: 13 },
    { from: "ledger-svc",     to: "aurora",          label: "SERIALIZABLE txn",   step: 14 },
    { from: "ledger-svc",     to: "token-vault",     label: "Detokenize",         step: 0,  style: "dashed" },
    { from: "notification-svc", to: "merchants",     label: "Webhook callback",   step: 0,  style: "dashed" },

    // ── Cross-cutting (async / security) ───────────────────────────────────────
    { from: "kms-vault",      to: "token-vault",     label: "HSM-backed keys",      step: 0,  style: "dashed" },
    { from: "secrets-mgr",    to: "aurora",          label: "Rotated creds",        step: 0,  style: "dashed" },
    { from: "datadog",        to: "tx-auth",         label: "APM traces",           step: 0,  style: "dashed" },
    { from: "argocd",         to: "istio-gw",        label: "GitOps sync",          step: 0,  style: "dashed" },
  ],
};
