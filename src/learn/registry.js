/**
 * Registry of Learn entries — interactive HTML artifacts and downloadable PDF guides.
 *
 * Entry shape:
 *   id          unique slug used in URLs (html entries open /learn/:id)
 *   type        "html" | "pdf"
 *   title       card title
 *   description one- or two-line summary shown on the card and detail page
 *   category    short label shown as a tag (e.g. "Data Structures", "Kubernetes")
 *   file        path under /public — "/artifacts/*.html" for html, "/guides/*.pdf" for pdf
 *   tags        optional list of keywords for future filtering
 *   date        optional publication date (YYYY-MM-DD)
 *
 * Files:
 *   HTML artifacts live in /public/artifacts/<id>.html
 *   PDF guides   live in /public/guides/<id>.pdf
 */
export const LEARN_ENTRIES = [
  {
    id: "bst-inorder",
    type: "html",
    title: "Binary Search Tree — Inorder Traversal",
    description:
      "Interactive walkthrough of inorder traversal on a binary search tree, with step-by-step visualization of the recursion and call stack.",
    category: "Data Structures",
    file: "/artifacts/bst-inorder.html",
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
    file: "/guides/kubernetes-cheat-sheet.pdf",
    tags: ["kubernetes", "devops", "reference"],
    date: "2026-04-21",
  },
  {
    id: "kubectl-cheat-sheet",
    type: "pdf",
    title: "kubectl Commands Cheat Sheet",
    description:
      "Fast reference for the kubectl commands you reach for most when inspecting, deploying, and debugging clusters in day-to-day operations.",
    category: "Kubernetes",
    file: "/guides/kubectl-cheat-sheet.pdf",
    tags: ["kubectl", "kubernetes", "cli", "reference"],
    date: "2026-04-21",
  },
];

export function getLearnEntry(id) {
  return LEARN_ENTRIES.find(entry => entry.id === id);
}
