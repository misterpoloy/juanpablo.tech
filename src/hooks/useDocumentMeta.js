import { useEffect } from "react";

const SITE_NAME = "Juan Pablo Ortiz (@wildpasco)";
const DEFAULT_DESCRIPTION =
  "Juan Pablo Ortiz (wildpasco), Guatemalan cloud engineer in Mexico City. AWS, Kubernetes, DevOps and SRE. Portfolio, open source, talks, and technical content in Spanish.";
const SITE_ORIGIN = "https://juanpablo.tech";

function upsertMeta(selector, attr, value) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/^meta\[(name|property)="([^"]+)"\]$/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function upsertCanonical(href) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Keeps per-route title, description, canonical and OG tags in sync as users
 * navigate the SPA. Pass a page-specific title/description and (optionally) a
 * path so canonical + og:url update.
 */
export function useDocumentMeta({ title, description, path, image } = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = path ? `${SITE_ORIGIN}${path}` : `${SITE_ORIGIN}/`;
    const ogImage = image || `${SITE_ORIGIN}/img/profile.jpg`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "content", desc);
    upsertMeta('meta[property="og:title"]', "content", fullTitle);
    upsertMeta('meta[property="og:description"]', "content", desc);
    upsertMeta('meta[property="og:url"]', "content", url);
    upsertMeta('meta[property="og:image"]', "content", ogImage);
    upsertMeta('meta[name="twitter:title"]', "content", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "content", desc);
    upsertMeta('meta[name="twitter:image"]', "content", ogImage);
    upsertCanonical(url);
  }, [title, description, path, image]);
}
