import { ARCHITECTURE as multiTenantArch, ICON_MAP as multiTenantIcons } from "../architectures/multiTenantConfig.js";

/**
 * Central registry for all architecture diagrams.
 * To add a new diagram, import its data above and append an entry here.
 */
export const DIAGRAMS = [
  {
    slug: "multi-tenant-config",
    title: "Multi-Tenant Config Service",
    cardSubtitle: "AWS Architecture Diagram",
    description: "ECS Fargate microservices · gRPC · DynamoDB/SSM strategy pattern · EventBridge-driven refresh",
    tags: ["ECS", "Fargate", "gRPC", "DynamoDB", "EventBridge"],
    color: "#D97706",
    icon: "▣",
    banner: "https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2026/04/03/ARCHBLOG-1417-image-11.png",
    bannerAlt: "Multi-tenant config service architecture diagram preview",
    source: {
      label: "AWS Architecture Blog",
      title: "Build a multi-tenant configuration system with tagged storage patterns",
      url: "https://aws.amazon.com/es/blogs/architecture/build-a-multi-tenant-configuration-system-with-tagged-storage-patterns/",
    },
    architecture: multiTenantArch,
    iconMap: multiTenantIcons,
    groupMeta: undefined,
  },
];

/** Look up a single diagram by its URL slug. Returns undefined if not found. */
export function getDiagram(slug) {
  return DIAGRAMS.find(d => d.slug === slug);
}
