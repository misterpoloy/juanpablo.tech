import BstInorder from "./artifacts/BstInorder.jsx";
import UrlShortener from "./artifacts/UrlShortener.jsx";
import RedditApi from "./artifacts/RedditApi.jsx";

/**
 * Registry of Learn entries: interactive React artifacts and downloadable PDF guides.
 *
 * Entry shape:
 *   id          unique slug used in URLs (interactive entries open /learn/:id)
 *   type        "interactive" | "pdf"
 *   title       card title
 *   description one- or two-line summary shown on the card and detail page
 *   category    short label shown as a tag (e.g. "Data Structures", "Kubernetes")
 *   component   (interactive) React component rendered natively in the page
 *   file        (pdf)         path under /public, e.g. "/guides/*.pdf"
 *   tags        optional list of keywords for future filtering
 *   date        optional publication date (YYYY-MM-DD)
 */
export const LEARN_ENTRIES = [
  {
    id: "reddit-api",
    type: "interactive",
    title: "Reddit API: System Design",
    description:
      "Interview-ready breakdown of the Reddit subreddit API — entity diagram with animated relationships, full CRUD for Posts, Comments, Votes & Awards, schema with key constraints, and 5 critical design decisions including why votes are separate entities.",
    category: "System Design",
    component: RedditApi,
    tags: ["system design", "api design", "crud", "pagination", "interview", "reddit"],
    date: "2026-04-28",
  },
  {
    id: "url-shortener",
    type: "interactive",
    title: "URL Shortener: System Design",
    description:
      "Interview-ready breakdown of a URL shortening service at 10B requests/month — system diagram with live data flow, capacity estimates, REST API design, database schema, and 5 key architectural trade-offs.",
    category: "System Design",
    component: UrlShortener,
    tags: ["system design", "redis", "postgresql", "caching", "interview", "distributed systems"],
    date: "2026-04-27",
  },
  {
    id: "bst-inorder",
    type: "interactive",
    title: "Binary Search Tree: Inorder Traversal",
    description:
      "Interactive walkthrough of inorder traversal on a binary search tree, with step-by-step visualization of the recursion and call stack.",
    category: "Data Structures",
    component: BstInorder,
    tags: ["trees", "recursion", "algorithms", "interview"],
    date: "2026-04-21",
  },
  {
    id: "kubernetes-cheat-sheet",
    type: "pdf",
    title: "Kubernetes Cheat Sheet",
    description:
      "Compact reference for core Kubernetes concepts: pods, deployments, services, ingress, configmaps, secrets, and common architecture patterns.",
    category: "Kubernetes",
    file: "/guides/Kubernetes_Interview_Guide.pdf",
    tags: ["kubernetes", "devops", "reference"],
    date: "2026-04-21",
    topics: [
      "Pod lifecycle and resource requests/limits",
      "Deployments, ReplicaSets, and rollout strategies",
      "Services: ClusterIP, NodePort, and LoadBalancer",
      "Ingress controllers and routing rules",
      "ConfigMaps and Secrets management",
      "Namespaces, RBAC, and access control basics",
      "Persistent Volumes and storage classes",
      "Common architecture patterns and gotchas",
    ],
  },
  {
    id: "kubectl-cheat-sheet",
    type: "pdf",
    title: "kubectl Commands Cheat Sheet",
    description:
      "Fast reference for the kubectl commands you reach for most when inspecting, deploying, and debugging clusters in day-to-day operations.",
    category: "Kubernetes",
    file: "/guides/kubectl_cheatsheet.pdf",
    tags: ["kubectl", "kubernetes", "cli", "reference"],
    date: "2026-04-21",
    topics: [
      "Cluster and context switching (get-contexts, use-context)",
      "Inspecting resources: get, describe, explain",
      "Logs, exec, and port-forwarding for debugging",
      "Applying, patching, and deleting resources",
      "Rolling restarts and deployment rollbacks",
      "Scaling deployments and watching resource status",
      "Working with namespaces across commands",
      "Useful flags and output formats (-o wide, -o yaml, --watch)",
    ],
  },
];

export function getLearnEntry(id) {
  return LEARN_ENTRIES.find(entry => entry.id === id);
}
