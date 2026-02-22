import { useState } from "react";

// ─── WISIBLES BRAND COLORS ────────────────────────────────────────────────────
// Extracted from wisibles.com
// Primary:   Deep Purple  #6B21A8  /  #7C3AED  /  #4B0082
// Secondary: Bright Orange #F97316  /  #FB923C  /  #EA580C
// Dark bg:   #1E0A3C  (dark purple hero)
// Light bg:  #FAF5FF  (lavender tint)
// White:     #FFFFFF
// Text dark: #1E0A3C  /  #2D1B69
// Accent:    #A855F7  (lighter purple for highlights)

const W = {
  // Core brand
  purple:      "#6B21A8",
  purpleDark:  "#4B0082",
  purpleDeep:  "#1E0A3C",
  purpleMid:   "#7C3AED",
  purpleLight: "#A855F7",
  purplePale:  "#FAF5FF",
  purpleTint:  "#F3E8FF",
  purpleBorder:"#C084FC",

  // Accent
  orange:      "#F97316",
  orangeDark:  "#EA580C",
  orangeLight: "#FB923C",
  orangePale:  "#FFF7ED",
  orangeTint:  "#FFEDD5",
  orangeBorder:"#FDBA74",

  // Neutrals
  white:       "#FFFFFF",
  offWhite:    "#FAFAFA",
  gray50:      "#F8FAFC",
  gray100:     "#F1F5F9",
  gray200:     "#E2E8F0",
  gray400:     "#94A3B8",
  gray500:     "#64748B",
  gray700:     "#334155",
  gray900:     "#0F172A",

  // Semantic (still on-brand)
  green:       "#059669",
  greenPale:   "#ECFDF5",
  greenBorder: "#6EE7B7",
  blue:        "#1D4ED8",
  bluePale:    "#EFF6FF",
  blueBorder:  "#93C5FD",
  pink:        "#DB2777",
  pinkPale:    "#FDF2F8",
  pinkBorder:  "#F9A8D4",
  teal:        "#0891B2",
  tealPale:    "#ECFEFF",
  tealBorder:  "#67E8F9",
};

// ─── AWS LAYER DATA ───────────────────────────────────────────────────────────
const layers = [
  {
    id: "dns", label: "DNS & DOMAIN",
    color: W.purple, bg: W.purpleTint, border: W.purpleBorder, headerBg: W.purple,
    nodes: [
      { id: "route53", label: "Route 53", sub: "*.wisibles.com Wildcard DNS", icon: "🌐" },
      { id: "acm",     label: "ACM Certificate", sub: "*.wisibles.com Wildcard SSL — Free", icon: "🔒" },
    ],
  },
  {
    id: "cdn", label: "CDN & SECURITY",
    color: W.orangeDark, bg: W.orangePale, border: W.orangeBorder, headerBg: W.orange,
    nodes: [
      { id: "cloudfront", label: "CloudFront CDN",    sub: "Edge Caching + Brotli Compression", icon: "⚡" },
      { id: "waf",        label: "AWS WAF",            sub: "OWASP Rules + Rate Limiting + Bot Control", icon: "🛡️" },
      { id: "s3fe",       label: "S3 Frontend Bucket", sub: "Shell / Admin / Teacher / Parent / Student MFEs", icon: "📦" },
    ],
  },
  {
    id: "lb", label: "LOAD BALANCING",
    color: W.green, bg: W.greenPale, border: W.greenBorder, headerBg: W.green,
    nodes: [
      { id: "alb",   label: "Application Load Balancer", sub: "HTTPS 443 + HTTP → HTTPS Redirect", icon: "⚖️" },
      { id: "natgw", label: "NAT Gateway",               sub: "Single AZ — External API Traffic Only", icon: "🔀" },
    ],
  },
  {
    id: "eks", label: "EKS KUBERNETES CLUSTER",
    color: W.blue, bg: W.bluePale, border: W.blueBorder, headerBg: W.blue,
    nodes: [
      { id: "nginx",  label: "NGINX Ingress Controller",    sub: "Subdomain Extraction → X-School-Code Header", icon: "🔧" },
      { id: "nodejs", label: "Node.js Pool (8 services)",   sub: "Auth · Student · Attendance · Notification · Tenant · WebSocket · Document · Reporting", icon: "🟩" },
      { id: "spring", label: "Spring Boot Pool (5 services)", sub: "Fee · Payroll · Exam · Timetable · Ledger", icon: "🍃" },
      { id: "ai",     label: "AI / MCP Pool",               sub: "AI Chatbot · MCP NL-to-SQL · RAG Pipeline", icon: "🤖" },
      { id: "worker", label: "Worker Pool",                 sub: "BullMQ Workers · Spring Batch CronJobs", icon: "⚙️" },
      { id: "infra",  label: "Platform Pods",               sub: "ArgoCD · Prometheus · Grafana · Jaeger · Fluent Bit · KEDA", icon: "🏗️" },
    ],
  },
  {
    id: "data", label: "DATA LAYER",
    color: W.purpleMid, bg: W.purpleTint, border: W.purpleBorder, headerBg: W.purpleMid,
    nodes: [
      { id: "rds",       label: "RDS Aurora PostgreSQL", sub: "Primary + Read Replica · Multi-AZ · Auto Backup", icon: "🗄️" },
      { id: "redis",     label: "ElastiCache Redis",     sub: "Sessions · Cache · BullMQ Queues · Rate Limits", icon: "⚡" },
      { id: "sqs",       label: "Amazon SQS",            sub: "Event Messaging (→ MSK Kafka at 100+ schools)", icon: "📨" },
      { id: "s3docs",    label: "S3 Documents Bucket",   sub: "Student Docs · Fee Receipts · Reports · Exports", icon: "📄" },
      { id: "pgbouncer", label: "PgBouncer",             sub: "DB Connection Pooler — Sits in front of Aurora", icon: "🔌" },
    ],
  },
  {
    id: "vpc", label: "VPC PRIVATE ENDPOINTS",
    color: W.purpleDark, bg: W.purplePale, border: W.purpleBorder, headerBg: W.purpleDark,
    nodes: [
      { id: "ep_s3",      label: "S3 Gateway Endpoint",      sub: "FREE — All S3 traffic stays private", icon: "🔓" },
      { id: "ep_ecr",     label: "ECR API + Docker Endpoints", sub: "$14/mo — Private Docker image pulls", icon: "🔓" },
      { id: "ep_secrets", label: "Secrets Manager Endpoint", sub: "$7/mo — DB passwords never touch internet", icon: "🔓" },
      { id: "ep_ssm",     label: "SSM Endpoints (×3)",       sub: "$21/mo — No Bastion Host needed", icon: "🔓" },
      { id: "ep_kms",     label: "KMS + STS Endpoints",      sub: "$14/mo — Private encryption & IAM auth", icon: "🔓" },
      { id: "ep_cw",      label: "CloudWatch Endpoints",     sub: "$7/mo — Private metrics & log shipping", icon: "🔓" },
    ],
  },
  {
    id: "supporting", label: "AWS SUPPORTING SERVICES",
    color: W.orange, bg: W.orangeTint, border: W.orangeBorder, headerBg: W.orangeDark,
    nodes: [
      { id: "ses",        label: "AWS SES",         sub: "Email — Fee Receipts · Results · Newsletters", icon: "📧" },
      { id: "sns",        label: "AWS SNS",         sub: "SMS/Push — OTP · Fee Alerts · Attendance Alerts", icon: "📱" },
      { id: "secrets",    label: "Secrets Manager", sub: "DB · Redis · JWT · API Keys — Auto-Rotated", icon: "🔑" },
      { id: "ecr",        label: "AWS ECR",         sub: "Container Registry — All Microservice Images", icon: "🐳" },
      { id: "cloudwatch", label: "CloudWatch",      sub: "Logs · Metrics · Alarms → Slack / PagerDuty", icon: "📊" },
      { id: "anthropic",  label: "Anthropic API",   sub: "Claude Haiku (70%) + Sonnet (30%) — AI Chatbot", icon: "🧠" },
    ],
  },
];

// ─── APP ARCHITECTURE DATA ────────────────────────────────────────────────────
const portals = [
  { name: "Admin Portal",   icon: "👨‍💼", users: "School Admin / Principal", color: W.purple,
    access: ["Student Management", "Fee Management", "Staff & HR", "Reports & Analytics", "School Settings", "AI Assistant"] },
  { name: "Teacher Portal", icon: "👩‍🏫", users: "Teachers / Class Teachers", color: W.blue,
    access: ["Attendance Marking", "Mark Entry", "Timetable View", "Assignments", "AI Assistant"] },
  { name: "Parent Portal",  icon: "👨‍👩‍👧", users: "Parents / Guardians", color: W.orange,
    access: ["Fee Payment", "Attendance Tracking", "Result Viewing", "Notifications", "AI Chatbot"] },
  { name: "Student Portal", icon: "🧑‍🎓", users: "Students", color: W.green,
    access: ["Results & Grades", "Timetable", "Assignments", "Fee Status", "AI Assistant"] },
];

const frontendStack = [
  { category: "Core Framework", color: W.purple, bg: W.purpleTint, border: W.purpleBorder,
    techs: [
      { name: "React 18+",    role: "UI Framework", detail: "Component-based, hooks, concurrent rendering", icon: "⚛️" },
      { name: "TypeScript",   role: "Language",     detail: "Type safety, better DX, fewer runtime errors", icon: "🔷" },
      { name: "Vite",         role: "Build Tool",   detail: "Lightning fast HMR, native ESM, optimized builds", icon: "⚡" },
    ],
  },
  { category: "Micro-Frontend Architecture", color: W.purpleMid, bg: W.purplePale, border: W.purpleBorder,
    techs: [
      { name: "Module Federation", role: "MFE Orchestration", detail: "Vite plugin — Shell loads remote portals at runtime", icon: "🔗" },
      { name: "Turborepo",         role: "Monorepo Tool",      detail: "One repo, 5 apps, shared packages, smart caching", icon: "🚀" },
      { name: "pnpm Workspaces",   role: "Package Manager",   detail: "Efficient shared dependency management", icon: "📦" },
    ],
  },
  { category: "State Management", color: W.green, bg: W.greenPale, border: W.greenBorder,
    techs: [
      { name: "Zustand",        role: "Global State",  detail: "Auth store, tenant config, notifications — lightweight", icon: "🐻" },
      { name: "TanStack Query", role: "Server State",  detail: "API caching, background refetch, pagination", icon: "🔄" },
      { name: "React Router v6",role: "Routing",       detail: "Client-side routing within each micro-frontend", icon: "🗺️" },
    ],
  },
  { category: "UI & Styling", color: W.orange, bg: W.orangeTint, border: W.orangeBorder,
    techs: [
      { name: "Tailwind CSS",      role: "Styling",           detail: "Utility-first CSS — consistent design system", icon: "🎨" },
      { name: "shadcn/ui",         role: "Component Library", detail: "Accessible, unstyled, fully customizable components", icon: "🧩" },
      { name: "TanStack Table",    role: "Data Tables",       detail: "Student lists, fee registers, attendance sheets", icon: "📊" },
      { name: "Recharts / ECharts",role: "Charts",            detail: "Dashboards, analytics, fee collection graphs", icon: "📈" },
    ],
  },
  { category: "Forms & Validation", color: W.orangeDark, bg: W.orangePale, border: W.orangeBorder,
    techs: [
      { name: "React Hook Form", role: "Form Management",   detail: "Performant forms — uncontrolled inputs, minimal re-renders", icon: "📝" },
      { name: "Zod",             role: "Schema Validation", detail: "Runtime type validation — dynamic field schemas from DB", icon: "✅" },
    ],
  },
  { category: "Real-time & AI", color: W.purpleLight, bg: W.purpleTint, border: W.purpleBorder,
    techs: [
      { name: "Socket.io Client", role: "Real-time",  detail: "Live attendance, notifications, chat — WebSocket", icon: "🔌" },
      { name: "Vercel AI SDK",    role: "AI Chat UI", detail: "useChat hook — streaming LLM responses token-by-token", icon: "🤖" },
      { name: "react-pdf",        role: "PDF Preview",detail: "Fee receipt preview in browser before download", icon: "📄" },
    ],
  },
  { category: "Multi-Tenancy (Per-School Branding)", color: W.purpleDark, bg: W.purplePale, border: W.purpleBorder,
    techs: [
      { name: "CSS Variables",   role: "Dynamic Theming", detail: "applyTheme() injects school colors before first render", icon: "🎨" },
      { name: "Tenant Config API", role: "Config Fetch", detail: "GET /api/v1/tenant/config → logo, colors, fields, flags", icon: "⚙️" },
      { name: "Dynamic Forms",   role: "Field Config",   detail: "DynamicForm renders fields from DB config — no code deploy", icon: "📋" },
    ],
  },
];

const backendStack = [
  { category: "Node.js Services (8 Microservices)", color: W.green, bg: W.greenPale, border: W.greenBorder,
    services: ["Auth", "Student", "Attendance", "Notification", "Document", "Reporting", "Tenant Config", "WebSocket"],
    techs: [
      { name: "NestJS",      role: "Framework",   detail: "Modular, decorator-based, Spring-like DI — TypeScript native", icon: "🐈" },
      { name: "Prisma ORM",  role: "CRUD Queries",detail: "Type-safe DB client for student, attendance, tenant queries", icon: "◈" },
      { name: "Kysely",      role: "Complex SQL", detail: "Type-safe SQL builder for dynamic ERP filter screens", icon: "🔍" },
      { name: "BullMQ",      role: "Job Queue",   detail: "Redis-backed queues for PDF, email, SMS workers", icon: "⚙️" },
      { name: "Socket.io",   role: "WebSocket",   detail: "Real-time attendance, notifications, live updates", icon: "🔌" },
      { name: "Passport.js", role: "Auth",        detail: "JWT strategy, refresh tokens, role-based guards", icon: "🛡️" },
    ],
  },
  { category: "Spring Boot Services (5 Microservices)", color: W.blue, bg: W.bluePale, border: W.blueBorder,
    services: ["Fee", "Payroll", "Exam", "Timetable", "Ledger"],
    techs: [
      { name: "Spring Boot 3 + Kotlin", role: "Framework",   detail: "Concise Kotlin syntax, coroutines, enterprise-grade DI", icon: "🍃" },
      { name: "Spring Data JPA",        role: "ORM",         detail: "Hibernate under the hood — complex relational mappings", icon: "🗄️" },
      { name: "Spring Security",        role: "Auth",        detail: "JWT validation, method-level security, RBAC", icon: "🔒" },
      { name: "Spring Batch",           role: "Batch Jobs",  detail: "Monthly payroll runs, bulk fee generation, result computation", icon: "⚙️" },
      { name: "Spring Kafka / SQS",     role: "Messaging",   detail: "Publishes fee.paid, exam.published events to queue", icon: "📨" },
      { name: "HikariCP",               role: "Connection Pool", detail: "Best-in-class JDBC pooling — configured per pod", icon: "🔌" },
    ],
  },
  { category: "AI / MCP Services (2 Microservices)", color: W.purple, bg: W.purpleTint, border: W.purpleBorder,
    services: ["AI Chatbot", "MCP NL-to-SQL"],
    techs: [
      { name: "Anthropic SDK",   role: "LLM",           detail: "Claude Haiku (simple) + Sonnet (complex) — streaming responses", icon: "🧠" },
      { name: "LangChain.js",    role: "AI Orchestration",detail: "RAG pipeline, conversation memory, tool calling chains", icon: "🔗" },
      { name: "pgvector",        role: "Vector Store",  detail: "Embeddings for school policy, FAQ, curriculum RAG", icon: "🧮" },
      { name: "MCP Protocol",    role: "NL-to-SQL",     detail: "Natural language → SQL → Read Replica — role-scoped", icon: "💬" },
      { name: "Semantic Cache",  role: "Cost Saving",   detail: "Redis caches similar AI queries — 35% cost saving", icon: "💾" },
      { name: "Node.js + TypeScript", role: "Runtime",  detail: "I/O-bound AI calls — event loop perfect for LLM streaming", icon: "🟩" },
    ],
  },
  { category: "Shared Backend Infrastructure", color: W.orangeDark, bg: W.orangeTint, border: W.orangeBorder,
    services: [],
    techs: [
      { name: "PgBouncer",          role: "DB Pooling",   detail: "Connection proxy in front of Aurora — manages pod limits", icon: "🔌" },
      { name: "Redis (ElastiCache)", role: "Cache + Queue",detail: "Tenant config (1hr TTL), API cache, BullMQ, rate limits", icon: "⚡" },
      { name: "Amazon SQS",         role: "Event Bus",    detail: "Async events: fee.paid → ledger, notification, analytics", icon: "📨" },
      { name: "OpenTelemetry",       role: "Tracing",      detail: "TraceID propagated across all services — Jaeger UI", icon: "🔭" },
      { name: "Prometheus + Grafana",role: "Metrics",      detail: "prom-client (Node) + Micrometer (Spring) → unified dashboard", icon: "📊" },
      { name: "Fluent Bit",          role: "Log Shipping", detail: "DaemonSet on every node → CloudWatch Logs structured JSON", icon: "📋" },
    ],
  },
];

const cicdStack = [
  { name: "GitHub Actions",   role: "CI Pipeline",    detail: "Lint → Test → Docker Build → Trivy Scan → Push ECR", icon: "⚙️", color: W.gray700 },
  { name: "Turborepo Cache",  role: "Build Cache",    detail: "Only rebuild changed services — 70% faster CI", icon: "🚀", color: W.green },
  { name: "ArgoCD",           role: "GitOps CD",      detail: "Watches Helm repo → Syncs to EKS → Auto-rollback", icon: "🔄", color: W.blue },
  { name: "Helm Charts",      role: "K8s Packaging",  detail: "Parameterized K8s manifests per service + environment", icon: "⛵", color: W.purple },
  { name: "AWS ECR",          role: "Container Registry", detail: "Docker images tagged with Git SHA — immutable deploys", icon: "🐳", color: W.orange },
  { name: "Trivy",            role: "Security Scan",  detail: "Container vulnerability scan on every build — blocks HIGH CVEs", icon: "🔍", color: W.orangeDark },
];

const tenantFlow = [
  { step: "1", label: "school1.wisibles.com",               detail: "User types URL in browser", color: W.purple },
  { step: "2", label: "Route 53 Wildcard DNS",              detail: "*.wisibles.com → CloudFront (zero config per school)", color: W.purpleMid },
  { step: "3", label: "CloudFront + WAF",                   detail: "SSL terminated · Static files cached · WAF filters threats", color: W.orange },
  { step: "4", label: "ALB → NGINX Ingress",                detail: "Reads Host header → Extracts 'school1' → Sets X-School-Code: school1", color: W.green },
  { step: "5", label: "Microservice (Node.js / Spring Boot)",detail: "Reads X-School-Code → Scopes ALL database queries to school1 only", color: W.blue },
  { step: "6", label: "Tenant Config Service (Redis)",       detail: "Returns school1's logo, brand colors, field config, feature flags", color: W.purpleDark },
];

const costData = [
  { label: "EKS Control Plane + EC2 Nodes",     value: 257, color: W.blue,      pct: 42 },
  { label: "RDS Aurora PostgreSQL",              value: 112, color: W.purple,    pct: 18 },
  { label: "VPC Interface Endpoints",            value: 73,  color: W.purpleDark,pct: 12 },
  { label: "NAT Gateway",                        value: 35,  color: W.green,     pct: 6  },
  { label: "ElastiCache Redis",                  value: 25,  color: W.orange,    pct: 4  },
  { label: "CloudFront + WAF",                   value: 21,  color: W.purpleMid, pct: 3  },
  { label: "S3 + SES + SNS + Route53 + Other",   value: 57,  color: W.orangeDark,pct: 9  },
  { label: "Anthropic AI API (External)",         value: 32,  color: W.purpleLight,pct: 5 },
];

const podData = [
  { label: "Node.js Services (8 services)",      normal: 15, peak: 39, color: W.green      },
  { label: "Spring Boot Services (5 services)",  normal: 8,  peak: 20, color: W.blue       },
  { label: "AI / MCP Services (2 services)",     normal: 2,  peak: 6,  color: W.purple     },
  { label: "Worker / Batch Jobs (2 services)",   normal: 1,  peak: 6,  color: W.orange     },
  { label: "Infrastructure Pods (fixed)",        normal: 20, peak: 20, color: W.gray500    },
];

const tabs = [
  { id: "apparch",      label: "💻 App Architecture"  },
  { id: "architecture", label: "🏗️ AWS Infrastructure" },
  { id: "subdomain",    label: "🌐 Subdomain Flow"     },
  { id: "pods",         label: "📦 Pod Count"          },
  { id: "cost",         label: "💰 Cost Breakdown"     },
];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function TechCard({ tech, color, bg, border }) {
  return (
    <div style={{ background: W.white, border: `1px solid ${border}`, borderRadius: 10, padding: "13px 15px", display: "flex", gap: 10, boxShadow: "0 1px 3px rgba(75,0,130,0.07)" }}>
      <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{tech.icon}</span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color }}>{tech.name}</span>
          <span style={{ fontSize: 10, background: bg, color, border: `1px solid ${border}`, padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{tech.role}</span>
        </div>
        <div style={{ fontSize: 11, color: W.gray500, lineHeight: 1.5 }}>{tech.detail}</div>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: W.white, borderRadius: 12, padding: "24px 28px", boxShadow: "0 1px 4px rgba(75,0,130,0.08)", border: `1px solid ${W.gray200}`, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 17, fontWeight: 700, color: W.purpleDeep, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </h2>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ArchDiagram() {
  const [activeTab, setActiveTab]       = useState("apparch");
  const [expandedLayer, setExpandedLayer] = useState("eks");

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: W.purplePale, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: W.purpleDeep, margin: 0, padding: 0 }}>

      {/* ════ HEADER ════ */}
      <div style={{ background: `linear-gradient(135deg, ${W.purpleDeep} 0%, ${W.purple} 55%, ${W.purpleMid} 100%)`, padding: "28px 40px 0", color: W.white, boxShadow: "0 4px 24px rgba(75,0,130,0.4)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div>
            {/* Logo area */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ background: W.orange, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 2px 10px rgba(249,115,22,0.5)" }}>
                🏫
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: W.white }}>
                  wisibles
                  <span style={{ color: W.orange, marginLeft: 6, fontSize: 14, fontWeight: 600, verticalAlign: "middle", background: "rgba(249,115,22,0.2)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(249,115,22,0.4)" }}>
                    Architecture
                  </span>
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>
                  School ERP · AWS · ap-south-1 Mumbai
                </div>
              </div>
            </div>
            <p style={{ opacity: 0.8, fontSize: 13, margin: 0, maxWidth: 560 }}>
              React Micro-Frontend · Node.js + Spring Boot · EKS Kubernetes · 17 Microservices · 10–20 Schools
            </p>
          </div>

          {/* Stat pills — Wisibles orange accent */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "17 Services",    bg: "rgba(249,115,22,0.25)", border: W.orange },
              { label: "46 Normal Pods", bg: "rgba(249,115,22,0.15)", border: W.orangeLight },
              { label: "$612/month",     bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)" },
              { label: "∞ Schools",      bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)" },
            ].map(p => (
              <span key={p.label} style={{ background: p.bg, color: W.white, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: `1px solid ${p.border}` }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "10px 20px", borderRadius: "8px 8px 0 0", border: "none",
              background: activeTab === tab.id ? W.purplePale : "rgba(255,255,255,0.12)",
              color: activeTab === tab.id ? W.purpleDeep : "rgba(255,255,255,0.9)",
              cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 800 : 500,
              transition: "all 0.2s", fontFamily: "inherit", whiteSpace: "nowrap",
              borderBottom: activeTab === tab.id ? `3px solid ${W.orange}` : "none",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════ CONTENT ════ */}
      <div style={{ padding: "24px 40px 40px" }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            APP ARCHITECTURE TAB
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "apparch" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* User Portals */}
            <Card>
              <SectionTitle>👥 User Portals — Who Uses Wisibles</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {portals.map(portal => (
                  <div key={portal.name} style={{ border: `2px solid ${portal.color}30`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ background: portal.color, padding: "14px", color: W.white }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{portal.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{portal.name}</div>
                      <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{portal.users}</div>
                    </div>
                    <div style={{ padding: "10px 14px", background: `${portal.color}06` }}>
                      {portal.access.map((a, i) => (
                        <div key={i} style={{ fontSize: 11, color: W.gray700, padding: "4px 0", borderBottom: i < portal.access.length - 1 ? `1px solid ${portal.color}15` : "none", display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ color: portal.color, fontWeight: 700 }}>›</span> {a}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Frontend */}
            <div style={{ background: W.white, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(75,0,130,0.08)", border: `1px solid ${W.gray200}` }}>
              <div style={{ background: `linear-gradient(135deg, ${W.purpleDeep}, ${W.purple})`, padding: "16px 24px", color: W.white }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>⚛️ Frontend Technology Stack</h2>
                <p style={{ opacity: 0.8, fontSize: 12, margin: "4px 0 0" }}>React Micro-Frontend · 5 Independent Apps (Shell + 4 Portals) · Turborepo Monorepo · S3 + CloudFront</p>
              </div>

              {/* MFE diagram */}
              <div style={{ padding: "18px 24px", background: W.purplePale, borderBottom: `1px solid ${W.gray200}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.gray500, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Monorepo Structure (Turborepo + pnpm Workspaces)</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ background: W.purpleDeep, color: W.white, borderRadius: 8, padding: "10px 14px", minWidth: 120, textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>🐚 Shell App</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Host · Auth · Router</div>
                  </div>
                  <span style={{ color: W.orange, fontWeight: 700, fontSize: 18 }}>→</span>
                  {[
                    { name: "Admin Portal",   color: W.purple },
                    { name: "Teacher Portal", color: W.blue },
                    { name: "Parent Portal",  color: W.orange },
                    { name: "Student Portal", color: W.green },
                  ].map(p => (
                    <div key={p.name} style={{ background: p.color, color: W.white, borderRadius: 8, padding: "10px 14px", minWidth: 110, textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Remote MFE</div>
                    </div>
                  ))}
                  <span style={{ color: W.gray400, fontWeight: 700 }}>+</span>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {["packages/ui", "packages/types", "packages/api-client", "packages/hooks"].map(p => (
                      <div key={p} style={{ background: W.white, border: `1px solid ${W.purpleBorder}`, borderRadius: 5, padding: "5px 9px", fontSize: 11, color: W.purple, fontFamily: "monospace" }}>{p}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {frontendStack.map(section => (
                  <div key={section.category}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: section.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 3, height: 14, background: section.color, borderRadius: 2, display: "inline-block" }} />
                      {section.category}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 8 }}>
                      {section.techs.map(tech => <TechCard key={tech.name} tech={tech} color={section.color} bg={section.bg} border={section.border} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div style={{ background: W.white, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(75,0,130,0.08)", border: `1px solid ${W.gray200}` }}>
              <div style={{ background: `linear-gradient(135deg, #14532d, ${W.green})`, padding: "16px 24px", color: W.white }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>⚙️ Backend Technology Stack — Hybrid Microservices</h2>
                <p style={{ opacity: 0.8, fontSize: 12, margin: "4px 0 0" }}>Node.js NestJS (8) + Spring Boot Kotlin (5) + AI/MCP (2) · All containerized on EKS</p>
              </div>

              {/* Communication bar */}
              <div style={{ padding: "14px 24px", background: W.gray50, borderBottom: `1px solid ${W.gray200}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.gray500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Inter-Service Communication</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { type: "REST / gRPC",        desc: "Synchronous calls",            color: W.blue,      bg: W.bluePale },
                    { type: "Amazon SQS Events",  desc: "Async — fee.paid → ledger",    color: W.orange,    bg: W.orangeTint },
                    { type: "WebSocket (Socket.io)", desc: "Real-time attendance",       color: W.purple,    bg: W.purpleTint },
                    { type: "mTLS (Istio)",        desc: "Zero-trust pod-to-pod",        color: W.green,     bg: W.greenPale },
                  ].map(item => (
                    <div key={item.type} style={{ background: item.bg, border: `1px solid ${item.color}30`, borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: item.color }}>{item.type}</span>
                      <span style={{ fontSize: 11, color: W.gray500 }}>— {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {backendStack.map(section => (
                  <div key={section.category} style={{ border: `1px solid ${section.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: section.color, padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ color: W.white, fontWeight: 700, fontSize: 13 }}>{section.category}</span>
                      {section.services.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {section.services.map(s => (
                            <span key={s} style={{ background: "rgba(255,255,255,0.2)", color: W.white, fontSize: 10, padding: "2px 7px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "12px", background: section.bg, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                      {section.techs.map(tech => <TechCard key={tech.name} tech={tech} color={section.color} bg={section.bg} border={section.border} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CI/CD */}
            <Card>
              <SectionTitle>🚀 CI/CD Pipeline — From git push to Production</SectionTitle>
              <div style={{ background: W.purplePale, borderRadius: 10, padding: "14px 18px", marginBottom: 16, border: `1px solid ${W.purpleBorder}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {["git push", "GitHub Actions", "Turborepo detects changes", "Test + Lint", "Docker Build", "Trivy Scan", "Push to ECR", "Update Helm values", "ArgoCD Sync → EKS", "✅ Live in ~5 min"].map((s, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ background: i === arr.length - 1 ? W.green : W.white, border: `1px solid ${i === arr.length - 1 ? W.green : W.purpleBorder}`, color: i === arr.length - 1 ? W.white : W.purple, fontSize: 12, padding: "4px 10px", borderRadius: 5, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>
                    {i < arr.length - 1 && <span style={{ color: W.orange, fontWeight: 700 }}>→</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                {cicdStack.map(tech => <TechCard key={tech.name} tech={tech} color={tech.color} bg={`${tech.color}10`} border={`${tech.color}30`} />)}
              </div>
            </Card>

            {/* Tech summary grid */}
            <Card>
              <SectionTitle>📋 Complete Technology Summary</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { cat: "Frontend",            color: W.purple,    bg: W.purpleTint, items: ["React 18 + TypeScript", "Vite + Module Federation", "Turborepo Monorepo", "Zustand + TanStack Query", "Tailwind CSS + shadcn/ui", "React Hook Form + Zod", "Socket.io + Vercel AI SDK"] },
                  { cat: "Backend — Node.js",   color: W.green,     bg: W.greenPale,  items: ["NestJS + TypeScript", "Prisma ORM + Kysely", "BullMQ (Redis Queues)", "Socket.io Server", "Passport.js JWT Auth", "OpenTelemetry Tracing", "prom-client Metrics"] },
                  { cat: "Backend — Spring Boot",color: W.blue,     bg: W.bluePale,   items: ["Spring Boot 3 + Kotlin", "Spring Data JPA + Hibernate", "Spring Security (JWT)", "Spring Batch (Payroll)", "HikariCP Connection Pool", "Micrometer Metrics", "Flyway DB Migrations"] },
                  { cat: "AI / MCP",            color: W.purpleMid, bg: W.purpleTint, items: ["Anthropic Claude SDK", "LangChain.js (RAG)", "pgvector (Embeddings)", "MCP Protocol (NL→SQL)", "Semantic Redis Cache", "Vercel AI SDK (Stream)", "Role-scoped Querying"] },
                  { cat: "Data & Messaging",    color: W.orangeDark,bg: W.orangeTint, items: ["RDS Aurora PostgreSQL", "ElastiCache Redis", "PgBouncer Pool", "Amazon SQS Events", "S3 Document Storage", "Fluent Bit Logging", "CloudWatch Alarms"] },
                  { cat: "Infrastructure",      color: W.purpleDark,bg: W.purplePale, items: ["EKS Kubernetes", "NGINX Ingress + Istio", "Docker + ECR", "ArgoCD GitOps", "Prometheus + Grafana", "Jaeger Tracing", "KEDA Autoscaling"] },
                ].map(group => (
                  <div key={group.cat} style={{ border: `1px solid ${group.color}25`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: group.color, padding: "10px 14px", color: W.white, fontWeight: 700, fontSize: 13 }}>{group.cat}</div>
                    <div style={{ padding: "10px 14px", background: group.bg }}>
                      {group.items.map((item, i) => (
                        <div key={i} style={{ fontSize: 12, color: W.gray700, padding: "4px 0", borderBottom: i < group.items.length - 1 ? `1px solid ${group.color}15` : "none", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: group.color, fontWeight: 700 }}>·</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            AWS INFRASTRUCTURE TAB
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "architecture" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Request flow */}
            <div style={{ background: W.white, borderRadius: 10, padding: "12px 18px", boxShadow: "0 1px 3px rgba(75,0,130,0.07)", border: `1px solid ${W.gray200}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: W.gray500, textTransform: "uppercase", letterSpacing: 1, marginRight: 4 }}>Request Flow:</span>
              {["Browser", "Route 53", "CloudFront + WAF", "ALB", "NGINX Ingress", "Microservice", "PgBouncer", "Aurora PostgreSQL"].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ background: W.purplePale, border: `1px solid ${W.purpleBorder}`, color: W.purple, fontSize: 12, padding: "3px 10px", borderRadius: 5, fontWeight: 600, whiteSpace: "nowrap" }}>{item}</span>
                  {i < arr.length - 1 && <span style={{ color: W.orange, fontWeight: 700 }}>→</span>}
                </div>
              ))}
            </div>

            {layers.map((layer, li) => (
              <div key={layer.id} style={{ background: W.white, borderRadius: 12, overflow: "hidden", boxShadow: expandedLayer === layer.id ? `0 4px 16px ${layer.color}25` : "0 1px 3px rgba(75,0,130,0.06)", border: `1px solid ${expandedLayer === layer.id ? layer.color + "80" : W.gray200}`, transition: "all 0.25s" }}>
                <div onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)} style={{ background: expandedLayer === layer.id ? layer.headerBg : W.white, padding: "13px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: expandedLayer === layer.id ? "rgba(255,255,255,0.2)" : layer.bg, border: `2px solid ${expandedLayer === layer.id ? "rgba(255,255,255,0.5)" : layer.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: expandedLayer === layer.id ? W.white : layer.color }}>
                      {li + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: expandedLayer === layer.id ? W.white : W.purpleDeep }}>LAYER {li + 1} — {layer.label}</div>
                      {expandedLayer !== layer.id && (
                        <div style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                          {layer.nodes.map(node => (
                            <span key={node.id} style={{ fontSize: 11, color: layer.color, background: layer.bg, border: `1px solid ${layer.border}`, padding: "1px 7px", borderRadius: 4, fontWeight: 500 }}>
                              {node.icon} {node.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: expandedLayer === layer.id ? "rgba(255,255,255,0.75)" : W.gray400, background: expandedLayer === layer.id ? "rgba(255,255,255,0.15)" : W.gray100, padding: "2px 9px", borderRadius: 10 }}>{layer.nodes.length} services</span>
                    <span style={{ fontSize: 20, color: expandedLayer === layer.id ? W.white : W.orange, display: "inline-block", transform: expandedLayer === layer.id ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", fontWeight: 700 }}>›</span>
                  </div>
                </div>
                {expandedLayer === layer.id && (
                  <div style={{ padding: "14px 18px", background: layer.bg, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                    {layer.nodes.map(node => (
                      <div key={node.id} style={{ background: W.white, border: `1px solid ${layer.border}`, borderRadius: 10, padding: "13px 15px", display: "flex", gap: 11, boxShadow: "0 1px 3px rgba(75,0,130,0.05)" }}>
                        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{node.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: layer.color, marginBottom: 3 }}>{node.label}</div>
                          <div style={{ fontSize: 11, color: W.gray500, lineHeight: 1.5 }}>{node.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 4 }}>
              {[
                { label: "Total Microservices", value: "17",  sub: "13 business + 4 infra groups",    color: W.purple,    bg: W.purpleTint },
                { label: "Normal Running Pods", value: "46",  sub: "Across 6 EC2 nodes",              color: W.green,     bg: W.greenPale  },
                { label: "Monthly Cost",        value: "$612",sub: "10–20 schools optimized",         color: W.orange,    bg: W.orangeTint },
                { label: "Schools Supported",   value: "∞",   sub: "Wildcard DNS — instant onboarding",color: W.purpleDark,bg: W.purplePale },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.color}25`, borderRadius: 12, padding: "20px", textAlign: "center", boxShadow: "0 1px 3px rgba(75,0,130,0.05)" }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: stat.color, letterSpacing: -1 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.purpleDeep, marginTop: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 11, color: W.gray500, marginTop: 3 }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SUBDOMAIN FLOW TAB
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "subdomain" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionTitle>🌐 How <code style={{ background: W.purpleTint, color: W.purple, padding: "2px 6px", borderRadius: 4, fontSize: 15 }}>school1.wisibles.com</code> Routes to the Right Tenant</SectionTitle>
              {tenantFlow.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: item.color, color: W.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, boxShadow: `0 2px 10px ${item.color}45`, zIndex: 1 }}>{item.step}</div>
                    {i < tenantFlow.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 28, background: `linear-gradient(to bottom, ${item.color}60, ${tenantFlow[i + 1].color}30)`, margin: "4px 0" }} />}
                  </div>
                  <div style={{ paddingTop: 7, paddingBottom: i < tenantFlow.length - 1 ? 16 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: W.gray500, marginTop: 3, lineHeight: 1.5 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>📋 Route 53 — 3 Records Handle Unlimited Schools</SectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: W.purplePale }}>
                    {["Domain Name", "Record Type", "Points To", "Coverage"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: W.purple, border: `1px solid ${W.purpleBorder}`, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "*.wisibles.com",    type: "A Alias", value: "CloudFront Distribution", note: "⭐ ALL school subdomains", hi: true },
                    { name: "wisibles.com",       type: "A Alias", value: "CloudFront Distribution", note: "Root domain" },
                    { name: "api.wisibles.com",   type: "A Alias", value: "ALB DNS Name",            note: "Backend API" },
                  ].map((rec, i) => (
                    <tr key={i} style={{ background: rec.hi ? W.purpleTint : i % 2 === 0 ? W.white : W.gray50 }}>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}` }}>
                        <code style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: rec.hi ? W.purple : W.gray700, background: rec.hi ? W.purplePale : W.gray100, padding: "2px 8px", borderRadius: 4 }}>{rec.name}</code>
                      </td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}` }}>
                        <span style={{ background: W.purpleTint, color: W.purple, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{rec.type}</span>
                      </td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}`, fontSize: 13, color: W.gray500 }}>{rec.value}</td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}` }}>
                        <span style={{ background: rec.hi ? W.orangeTint : W.gray100, color: rec.hi ? W.orangeDark : W.gray500, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: rec.hi ? 700 : 400 }}>{rec.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <SectionTitle>⚡ Adding school4.wisibles.com — Before vs After</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 12, fontSize: 14 }}>❌ Current Linux Box</div>
                  {["SSH into server manually", "Edit Nginx virtual host config", "Add DNS A record manually", "Run certbot for SSL certificate", "Reload Nginx service", "Test and verify manually"].map((s, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid #fee2e2", fontSize: 13, color: "#7f1d1d" }}>• {s}</div>
                  ))}
                  <div style={{ marginTop: 10, fontWeight: 700, color: "#dc2626", fontSize: 13 }}>⏱️ 30–60 minutes · Risk of human error</div>
                </div>
                <div style={{ background: W.greenPale, border: `1px solid ${W.greenBorder}`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontWeight: 700, color: W.green, marginBottom: 12, fontSize: 14 }}>✅ AWS Cloud</div>
                  {["Open Wisibles Admin Panel", "Click → Add New School", "Enter name + code: school4", "Click Save → DB insert only", "school4.wisibles.com works instantly", "Wildcard DNS + SSL auto-cover it"].map((s, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: `1px solid ${W.greenBorder}`, fontSize: 13, color: "#14532d" }}>
                      <span style={{ color: W.green }}>✓</span> {s}
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontWeight: 700, color: W.green, fontSize: 13 }}>⏱️ 5 seconds · Zero infrastructure change</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PODS TAB
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "pods" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { label: "Minimum Pods", value: 43, sub: "Night & weekend scaled down", color: W.gray500,  bg: W.gray50     },
                { label: "Normal Pods",  value: 46, sub: "School hours — steady state", color: W.purple,   bg: W.purpleTint },
                { label: "Peak Pods",    value: 91, sub: "Result day / Fee deadline",   color: W.orange,   bg: W.orangeTint },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, border: `2px solid ${item.color}25`, borderRadius: 14, padding: "24px", textAlign: "center", boxShadow: "0 1px 4px rgba(75,0,130,0.07)" }}>
                  <div style={{ fontSize: 54, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W.purpleDeep, marginTop: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: W.gray500, marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <Card>
              <SectionTitle>📊 Pod Distribution — Normal vs Peak</SectionTitle>
              {podData.map((row, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: W.purpleDeep }}>{row.label}</span>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 13, color: W.gray500 }}>Normal: <strong style={{ color: row.color }}>{row.normal}</strong></span>
                      <span style={{ fontSize: 13, color: W.gray500 }}>Peak: <strong style={{ color: W.orange }}>{row.peak}</strong></span>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: 30, background: W.gray100, borderRadius: 7, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(row.peak / 39) * 100}%`, background: `${row.color}22`, borderRadius: 7 }} />
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(row.normal / 39) * 100}%`, background: row.color, borderRadius: 7, display: "flex", alignItems: "center", paddingLeft: 12, minWidth: 50 }}>
                      <span style={{ color: W.white, fontSize: 12, fontWeight: 700 }}>{row.normal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>🖥️ 6 EC2 Nodes — What Runs Where</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { node: "Node 1", type: "t3.medium",       pool: "Node.js Pool (Reserved)",  ram: "4GB", pods: "9 pods",  util: "28%", color: W.green     },
                  { node: "Node 2", type: "t3.medium",       pool: "Node.js Pool (Reserved)",  ram: "4GB", pods: "9 pods",  util: "45%", color: W.green     },
                  { node: "Node 3", type: "t3.large",        pool: "Spring Boot (Reserved)",   ram: "8GB", pods: "8 pods",  util: "44%", color: W.blue      },
                  { node: "Node 4", type: "t3.large",        pool: "Spring Boot (Reserved)",   ram: "8GB", pods: "8 pods",  util: "34%", color: W.blue      },
                  { node: "Node 5", type: "t3.large (Spot)", pool: "AI + Worker Pool",         ram: "8GB", pods: "5 pods",  util: "11%", color: W.purple    },
                  { node: "Node 6", type: "t3.large (Spot)", pool: "Overflow / Burst",         ram: "8GB", pods: "Idle",    util: "0%",  color: W.orange    },
                ].map(n => (
                  <div key={n.node} style={{ background: `${n.color}08`, border: `1px solid ${n.color}30`, borderRadius: 10, padding: "15px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: n.color }}>{n.node}</span>
                      <span style={{ background: n.color, color: W.white, fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{n.pods}</span>
                    </div>
                    <div style={{ fontSize: 12, color: W.gray700, fontWeight: 600 }}>{n.type}</div>
                    <div style={{ fontSize: 12, color: W.gray500, marginBottom: 8 }}>{n.pool}</div>
                    <div style={{ height: 4, background: W.gray200, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: n.util, background: n.color, borderRadius: 2 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                      <span style={{ fontSize: 11, color: W.gray400 }}>RAM: {n.ram}</span>
                      <span style={{ fontSize: 11, color: n.color, fontWeight: 600 }}>{n.util} used</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            COST TAB
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "cost" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Hero cost card — Wisibles brand gradient */}
            <div style={{ background: `linear-gradient(135deg, ${W.purpleDeep} 0%, ${W.purple} 50%, ${W.orange} 100%)`, borderRadius: 14, padding: "32px 40px", color: W.white, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(75,0,130,0.35)", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ opacity: 0.8, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Total Monthly Cost — 10–20 Schools · Optimized</div>
                <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>$612</div>
                <div style={{ opacity: 0.8, fontSize: 13, marginTop: 6 }}>per month · ap-south-1 Mumbai</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "AWS Infrastructure", value: "$580/mo" },
                  { label: "Anthropic AI API",   value: "$32/mo"  },
                  { label: "Per School (10)",    value: "$61/mo"  },
                  { label: "Break-even",         value: "6–7 schools" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.25)" }}>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{item.value}</div>
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <SectionTitle>💰 Cost Per Service Category</SectionTitle>
              {costData.map((item, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: W.gray700 }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>${item.value}/mo</span>
                  </div>
                  <div style={{ height: 10, background: W.gray100, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 5 }} />
                  </div>
                  <div style={{ fontSize: 11, color: W.gray400, marginTop: 2, textAlign: "right" }}>{item.pct}% of total</div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>📈 Unit Economics — Cost Per School As You Scale</SectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: W.purplePale }}>
                    {["Schools", "Total/mo", "Per School", "AWS Infra", "AI API"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: W.purple, border: `1px solid ${W.purpleBorder}`, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: 10,  t: 612,  p: 61, i: 580,  a: 32  },
                    { s: 25,  t: 800,  p: 32, i: 720,  a: 80  },
                    { s: 50,  t: 1110, p: 22, i: 950,  a: 160 },
                    { s: 100, t: 1820, p: 18, i: 1500, a: 320 },
                    { s: 200, t: 2840, p: 14, i: 2200, a: 640 },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? W.white : W.purplePale }}>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}`, fontWeight: 700, color: W.purple, fontSize: 16 }}>{row.s}</td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}`, fontWeight: 600, fontSize: 14 }}>${row.t}/mo</td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}` }}>
                        <span style={{ background: W.orangeTint, color: W.orangeDark, fontWeight: 700, padding: "4px 12px", borderRadius: 6, fontSize: 14 }}>${row.p}/mo</span>
                      </td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}`, color: W.gray500, fontSize: 13 }}>${row.i}/mo</td>
                      <td style={{ padding: "12px 16px", border: `1px solid ${W.gray200}`, color: W.gray500, fontSize: 13 }}>${row.a}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 14, background: W.orangeTint, border: `1px solid ${W.orangeBorder}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: W.orangeDark }}>
                💡 <strong>Charge schools $100–150/month</strong> → Break-even at 6–7 schools → At 50 schools: <strong>$5,000 revenue vs $1,110 cost = $3,890 gross profit/month</strong>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, padding: "14px 20px", background: W.white, borderRadius: 10, border: `1px solid ${W.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, background: W.orange, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>🏫</span>
            <span style={{ color: W.gray500, fontSize: 12, fontWeight: 600 }}>wisibles · AWS Architecture v2.0 · ap-south-1 Mumbai</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "React + TypeScript",    color: W.purple    },
              { label: "Node.js + Spring Boot", color: W.green     },
              { label: "EKS Kubernetes",        color: W.blue      },
              { label: "$612/month",            color: W.orange    },
              { label: "∞ Schools via Wildcard",color: W.purpleDark},
            ].map(badge => (
              <span key={badge.label} style={{ background: `${badge.color}12`, border: `1px solid ${badge.color}40`, color: badge.color, fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
