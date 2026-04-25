import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Signal to the prerenderer (Puppeteer) that the app has painted.
// Two RAFs ensure React has committed and effects (document.title, meta tags)
// have flushed before Puppeteer captures the HTML.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.dispatchEvent(new Event("render-event"));
  });
});
