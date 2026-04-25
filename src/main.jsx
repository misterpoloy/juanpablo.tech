import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// JSDOM (used during prerender) doesn't ship window.matchMedia.
// Real browsers already have it — this is a no-op there.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = function matchMediaShim() {
    return {
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Signal to the prerenderer (Puppeteer) that the app has painted.
// Two RAFs ensure React has committed and effects (document.title, meta tags)
// have flushed before HTML is captured.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.dispatchEvent(new Event("render-event"));
  });
});
