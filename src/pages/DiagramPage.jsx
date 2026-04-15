import { useParams, Link, Navigate } from "react-router-dom";
import ArchitectureViewer from "../components/ArchitectureViewer.jsx";
import { ARCHITECTURE as multiTenantArch, ICON_MAP as multiTenantIcons } from "../architectures/multiTenantConfig.js";
import { ARCHITECTURE as paymentArch, ICON_MAP as paymentIcons, GROUP_META as paymentGroups } from "../architectures/paymentAuth.js";

const DIAGRAM_MAP = {
  "multi-tenant-config": {
    architecture: multiTenantArch,
    iconMap: multiTenantIcons,
  },
  "payment-auth": {
    architecture: paymentArch,
    iconMap: paymentIcons,
    groupMeta: paymentGroups,
  },
};

export default function DiagramPage() {
  const { slug } = useParams();
  const entry = DIAGRAM_MAP[slug];

  if (!entry) return <Navigate to="/" replace />;

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#0d1117" }}>
      <div style={{ position: "absolute", top: 60, left: 12, zIndex: 200 }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6b7280",
          background: "#161b22", border: "1px solid #21262d", borderRadius: 6, padding: "4px 10px",
          textDecoration: "none", fontFamily: "monospace",
        }}>
          ← Back
        </Link>
      </div>
      <ArchitectureViewer
        architecture={entry.architecture}
        iconMap={entry.iconMap}
        groupMeta={entry.groupMeta}
      />
    </div>
  );
}
