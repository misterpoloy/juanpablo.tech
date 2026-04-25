// ─── CDN base for official AWS Architecture Icons ───
const CDN = "https://cdn.jsdelivr.net/npm/aws-icons@latest/icons";

export const ICON_MAP = {
  cognito:     `${CDN}/architecture-service/AmazonCognito.svg`,
  apigw:       `${CDN}/architecture-service/AmazonAPIGateway.svg`,
  waf:         `${CDN}/architecture-service/AWSWAF.svg`,
  vpclink:     `${CDN}/resource/AmazonVPCVPNGateway.svg`,
  alb:         `${CDN}/architecture-service/ElasticLoadBalancing.svg`,
  ecs:         `${CDN}/architecture-service/AmazonElasticContainerService.svg`,
  fargate:     `${CDN}/architecture-service/AWSFargate.svg`,
  dynamodb:    `${CDN}/architecture-service/AmazonDynamoDB.svg`,
  paramstore:  `${CDN}/architecture-service/AWSSystemsManager.svg`,
  kms:         `${CDN}/architecture-service/AWSKeyManagementService.svg`,
  cloudwatch:  `${CDN}/architecture-service/AmazonCloudWatch.svg`,
  eventbridge: `${CDN}/architecture-service/AmazonEventBridge.svg`,
  lambda:      `${CDN}/architecture-service/AWSLambda.svg`,
  cloudmap:    `${CDN}/architecture-service/AWSCloudMap.svg`,
  vpc:         `${CDN}/architecture-service/AmazonVirtualPrivateCloud.svg`,
  endpoint:    `${CDN}/resource/AmazonVPCEndpoints.svg`,
};

export const ARCHITECTURE = {
  title: "Multi-Tenant Config Service: AWS Architecture",
  description: "ECS Fargate microservices · gRPC inter-service comms · DynamoDB/SSM strategy pattern · EventBridge-driven refresh",
  boundaries: [
    { id: "aws", label: "AWS Cloud", color: "#232F3E", x: 50, y: 15, w: 1360, h: 780, style: "solid" },
    { id: "region", label: "Region (us-east-1)", color: "#147EBA", x: 70, y: 45, w: 1320, h: 740, style: "solid" },
    { id: "vpc", label: "VPC (10.0.0.0/16)", color: "#8C4FFF", x: 130, y: 85, w: 1080, h: 620, style: "solid", group: "networking", iconType: "aws", awsIcon: "vpc",
      detail: "This VPC is the private network boundary for the workload. It isolates the order and config services from the public internet, provides controlled east-west communication, and is where private connectivity to DynamoDB, Systems Manager, CloudWatch, and Cloud Map is anchored. In this design, the VPC is the trust zone that lets API Gateway reach the internal ALB through VPC Link while keeping the application plane off public addresses." },
    { id: "private-subnets", label: "Private Subnets", color: "#248814", x: 155, y: 120, w: 1035, h: 450, style: "dashed", group: "networking", customIcon: "🧱",
      detail: "The private subnets host the compute plane for both services. Fargate tasks run here without direct inbound internet exposure, which reduces attack surface and forces traffic through managed ingress points such as API Gateway, VPC Link, and the internal load balancer. This layer is also where endpoint-based private access to AWS control-plane and data services becomes important, avoiding a NAT-heavy design." },
    { id: "ecs-cluster", label: "ECS Fargate Cluster", color: "#ED7100", x: 175, y: 155, w: 995, h: 395, style: "dashed", group: "networking", iconType: "aws", awsIcon: "ecs",
      detail: "This is the shared ECS control plane where the Order Service and Config Service are scheduled as independent services. Fargate removes host management, so the team focuses on task definitions, service discovery, autoscaling, deployment strategy, and runtime policies rather than EC2 fleet operations. Architecturally, the cluster is the execution boundary that standardizes networking, deployment, and observability for both microservices." },
    { id: "order-svc", label: "Order Service (ECS Service)", color: "#3B82F6", x: 195, y: 195, w: 330, h: 330, style: "solid", group: "order", iconType: "aws", awsIcon: "ecs",
      detail: "The Order Service is the externally facing application tier behind the internal ALB. As an ECS service, it is responsible for maintaining the desired number of healthy tasks, participating in rolling deployments, and registering task targets for load balancing. In business terms, this is the API surface that receives order traffic and orchestrates tenant-aware behavior through the downstream Config Service." },
    { id: "order-task", label: "Order Task (Fargate)", color: "#60A5FA", x: 205, y: 225, w: 310, h: 280, style: "dashed", group: "order", iconType: "aws", awsIcon: "fargate",
      detail: "A single Order Task is one running Fargate workload instance for the Order Service. It contains the REST controller and gRPC client behavior shown elsewhere in the diagram, and it scales horizontally as traffic grows. This level is useful because it explains where application code, retry policies, health checks, and per-task telemetry actually live at runtime." },
    { id: "config-svc", label: "Config Service (ECS Service)", color: "#D97706", x: 560, y: 195, w: 420, h: 330, style: "solid", group: "config", iconType: "aws", awsIcon: "ecs",
      detail: "The Config Service is the internal configuration domain exposed over gRPC. At the service level, ECS guarantees availability by keeping the desired count of config-serving tasks healthy and discoverable. This is the logical unit that encapsulates the strategy pattern for reading tenant configuration from DynamoDB or Parameter Store and hides those storage details from calling services." },
    { id: "config-task", label: "Config Task (Fargate), Registered with Cloud Map", color: "#FBBF24", x: 570, y: 225, w: 400, h: 280, style: "dashed", group: "config", iconType: "aws", awsIcon: "fargate",
      detail: "A Config Task is one concrete runtime instance of the Config Service. Each task exposes the gRPC server, is registered in Cloud Map for DNS-based discovery, and can be refreshed directly when EventBridge-driven config changes occur. This boundary matters because it is where request handling, cache refresh, service discovery registration, and per-task resiliency behavior come together." },
  ],
  nodes: [
    // ── External ────────────────────────────────────────────────────
    { id: "client", label: "Client / Apps", iconType: "custom", customIcon: "👤", x: 20, y: 345, group: "external",
      detail: "End-user applications consuming the Order Service REST API. Authenticate via JWT tokens from Amazon Cognito. Could be web apps, mobile apps, or backend services." },

    // ── Auth / Edge ─────────────────────────────────────────────────
    { id: "cognito", label: "Amazon Cognito", iconType: "aws", awsIcon: "cognito", x: 90, y: 180, group: "auth",
      detail: "User pool handling authentication. Issues JWT tokens (ID + Access) via OAuth 2.0 / OIDC. API Gateway uses a Cognito Authorizer to validate tokens on every request. Supports MFA, social IdPs, and SAML federation." },
    { id: "apigw", label: "AWS API Gateway", iconType: "aws", awsIcon: "apigw", x: 90, y: 380, group: "auth",
      detail: "Public REST API (regional endpoint). Cognito authorizer validates JWTs. Private integration via VPC Link V2 sends traffic to the internal ALB. Throttling, usage plans, and request/response mapping configured." },
    { id: "waf", label: "AWS WAF", iconType: "aws", awsIcon: "waf", x: 90, y: 530, group: "security",
      detail: "Web Application Firewall attached to API Gateway. Rules: OWASP Top 10 managed rule group, rate-based rule (2000 req/5min), geo-match blocking, SQL injection/XSS protection, bot control." },

    // ── Networking (VPC) ────────────────────────────────────────────
    { id: "vpclink", label: "VPC Link V2", iconType: "aws", awsIcon: "vpclink", x: 280, y: 95, group: "networking",
      detail: "VPC Link V2 (HTTP API type) enables private integration between API Gateway and the internal ALB. No public IP exposed. Supports TLS passthrough." },
    { id: "alb", label: "Application Load Balancer", iconType: "aws", awsIcon: "alb", x: 470, y: 95, group: "networking",
      detail: "Internal Application Load Balancer. Path-based routing: /api/orders/* → Order Service target group. Health checks on /actuator/health. TLS termination with ACM certificate." },

    // ── Order Service ───────────────────────────────────────────────
    { id: "rest-ctrl", label: "REST API Controller", iconType: "custom", customIcon: "🔴", x: 240, y: 300, group: "order",
      detail: "Spring Boot REST controller. Endpoints: POST /orders, GET /orders/{id}, PUT /orders/{id}/status. Uses @RestController with OpenAPI docs. Injects ConfigServiceClient for tenant config lookups." },
    { id: "grpc-client", label: "Config Svc gRPC Client", iconType: "custom", customIcon: "📡", x: 370, y: 380, group: "order",
      detail: "Auto-generated gRPC stub from config-service.proto. Channel target: dns:///config-service.local:5000 (resolved by Cloud Map). Features: deadline propagation, retry policy (3 attempts), round-robin LB." },

    // ── Config Service ──────────────────────────────────────────────
    { id: "grpc-ctrl", label: "gRPC Controller", iconType: "custom", customIcon: "📡", x: 620, y: 260, group: "config",
      detail: "gRPC server on port 5000. RPCs: GetTenantConfig(tenant_id, key), RefreshConfig(key_prefix). Registered with Cloud Map via ECS service connect. Interceptors for logging, metrics, and auth propagation." },
    { id: "strategy-factory", label: "Config Strategy Factory", iconType: "custom", customIcon: "🏭", x: 620, y: 390, group: "config",
      detail: "Strategy pattern (GoF). Routes config requests by key prefix: tenant_config_* → DynamoDBStrategy, param_config_* → SSMStrategy. New backends added without modifying existing code (OCP)." },
    { id: "dynamo-strategy", label: "DynamoDB Strategy", iconType: "custom", customIcon: "📊", x: 810, y: 280, group: "config",
      detail: "Implements ConfigStrategy interface. Reads from DynamoDB via Gateway Endpoint. PK: tenant_id, SK: config_key. DynamoDbEnhancedClient with @DynamoDbBean mapping. Local cache with 60s TTL." },
    { id: "ssm-strategy", label: "SSM Strategy", iconType: "custom", customIcon: "⚙️", x: 810, y: 420, group: "config",
      detail: "Implements ConfigStrategy interface. Reads from SSM Parameter Store via Interface Endpoint. Supports SecureString types. getParametersByPath for batch retrieval. Local cache with 300s TTL." },

    // ── VPC Endpoints ───────────────────────────────────────────────
    { id: "ep-cw", label: "Interface Endpoint (CW)", iconType: "aws", awsIcon: "endpoint", x: 870, y: 95, group: "networking",
      detail: "VPC Interface Endpoint for CloudWatch Logs & Metrics. ENI in each private subnet. Keeps observability traffic off the internet." },
    { id: "ep-dynamo", label: "Gateway Endpoint (DDB)", iconType: "aws", awsIcon: "endpoint", x: 1000, y: 220, group: "networking",
      detail: "VPC Gateway Endpoint for DynamoDB. Free of charge. Route table entry directs DynamoDB traffic through the endpoint." },
    { id: "ep-ssm", label: "Interface Endpoint (SSM)", iconType: "aws", awsIcon: "endpoint", x: 1000, y: 400, group: "networking",
      detail: "VPC Interface Endpoint for SSM. ENI-based. Required for Parameter Store access without NAT Gateway. Private DNS enabled." },

    // ── Data stores ─────────────────────────────────────────────────
    { id: "dynamodb", label: "Amazon DynamoDB", iconType: "aws", awsIcon: "dynamodb", x: 1150, y: 200, group: "data",
      detail: "NoSQL table: TenantConfig. PK=tenant_id (S), SK=config_key (S). On-demand capacity. Encryption at rest with KMS CMK. Point-in-time recovery enabled. DynamoDB Streams for CDC." },
    { id: "param-store", label: "Parameter Store", iconType: "aws", awsIcon: "paramstore", x: 1150, y: 400, group: "data",
      detail: "SSM Parameter Store (Advanced tier). Hierarchical paths: /config/{env}/{service}/{key}. SecureString encrypted with KMS. Change notifications via EventBridge." },

    // ── Security ────────────────────────────────────────────────────
    { id: "kms", label: "AWS KMS", iconType: "aws", awsIcon: "kms", x: 1300, y: 280, group: "security",
      detail: "Customer-managed CMK (alias: config-service-key). Encrypts DynamoDB at rest and SSM SecureString parameters. Auto annual rotation. CloudTrail logging for all key usage." },

    // ── Observability ───────────────────────────────────────────────
    { id: "cloudwatch", label: "Amazon CloudWatch", iconType: "aws", awsIcon: "cloudwatch", x: 1150, y: 80, group: "observability",
      detail: "Log groups: /ecs/order-service, /ecs/config-service. Embedded Metric Format for custom metrics. Dashboards for p50/p99 latency. Alarms: 5xx > 1%, latency p99 > 500ms." },

    // ── Eventing ────────────────────────────────────────────────────
    { id: "eventbridge", label: "Amazon EventBridge", iconType: "aws", awsIcon: "eventbridge", x: 1150, y: 560, group: "eventing",
      detail: "Default event bus. Rule: source=aws.ssm, detail-type=Parameter Store Change. Target: Lambda function with DLQ on SQS. Retry: 3 attempts, exponential backoff." },
    { id: "lambda", label: "AWS Lambda", iconType: "aws", awsIcon: "lambda", x: 800, y: 630, group: "eventing",
      detail: "Runtime: Java 21 (SnapStart). Triggered by EventBridge. Steps: parse changed parameter, DiscoverInstances via Cloud Map, gRPC refresh() each Config Service task. Timeout: 30s. VPC-attached." },

    // ── Service Discovery ───────────────────────────────────────────
    { id: "cloudmap", label: "AWS Cloud Map", iconType: "aws", awsIcon: "cloudmap", x: 520, y: 630, group: "networking",
      detail: "Namespace: config-service.local (DNS). Service: config-service, port 5000. ECS auto-registers task IPs. Used by gRPC client (DNS) and Lambda (DiscoverInstances API)." },
  ],
  flows: [
    // ── Auth flow (steps 1-4) — clearly separated arrows ────────────
    { from: "client",           to: "cognito",          label: "Authenticate",          step: 1 },
    { from: "cognito",          to: "client",           label: "JWT Token",             step: 2 },
    { from: "client",           to: "waf",              label: "REST + JWT",            step: 3 },
    { from: "waf",              to: "apigw",            label: "",                      step: 0 },
    { from: "apigw",            to: "cognito",          label: "Authenticate",          step: 4 },

    // ── Ingress → Order Service (steps 5-6) ─────────────────────────
    { from: "apigw",            to: "vpclink",          label: "Private Integration",   step: 5 },
    { from: "vpclink",          to: "alb",              label: "REST to Order Svc",     step: 6 },
    { from: "alb",              to: "rest-ctrl",        label: "",                      step: 0 },
    { from: "rest-ctrl",        to: "grpc-client",      label: "",                      step: 0 },

    // ── gRPC resolution + call (steps 7-9) ──────────────────────────
    { from: "grpc-client",      to: "cloudmap",         label: "DNS Lookup",            step: 7,  style: "dashed" },
    { from: "grpc-client",      to: "grpc-ctrl",        label: "gRPC Call",             step: 8 },
    { from: "grpc-ctrl",        to: "strategy-factory", label: "Route",                 step: 9 },

    // ── Strategy pattern fan-out (no step numbers) ──────────────────
    { from: "strategy-factory", to: "dynamo-strategy",  label: "tenant_config_*",       step: 0 },
    { from: "strategy-factory", to: "ssm-strategy",     label: "param_config_*",        step: 0 },
    { from: "dynamo-strategy",  to: "ep-dynamo",        label: "",                      step: 0 },
    { from: "ep-dynamo",        to: "dynamodb",         label: "",                      step: 0 },
    { from: "dynamodb",         to: "kms",              label: "Encrypt",               step: 0 },
    { from: "ssm-strategy",     to: "ep-ssm",           label: "",                      step: 0 },
    { from: "ep-ssm",           to: "param-store",      label: "",                      step: 0 },
    { from: "param-store",      to: "kms",              label: "Encrypt",               step: 0 },

    // ── EventBridge refresh loop (steps 10-13) ──────────────────────
    { from: "param-store",      to: "eventbridge",      label: "Change Event",          step: 10 },
    { from: "eventbridge",      to: "lambda",           label: "Trigger",               step: 11 },
    { from: "lambda",           to: "cloudmap",         label: "DNS Lookup",            step: 12 },
    { from: "lambda",           to: "grpc-ctrl",        label: "gRPC refresh() Direct", step: 13, style: "dashed" },

    // ── Observability (no step numbers) ─────────────────────────────
    { from: "alb",              to: "ep-cw",            label: "Logs & Metrics",        step: 0,  style: "dashed" },
    { from: "ep-cw",            to: "cloudwatch",       label: "",                      step: 0 },
  ],
};
