/**
 * Central registry for all open source projects.
 * Add a new entry here to have it appear on /open-source and /open-source/:id.
 */
export const PROJECTS = [
  {
    id: "youtube-download-extension",
    name: "Youtube Download Extension",
    tagline: "Download any YouTube video up to 1080p. Local bridge, no cloud, no subscription.",
    description:
      "A Chrome extension + Python bridge that injects a native-feeling Download button into every YouTube watch page. Click it, and the video gets pulled directly to your disk via yt-dlp. No third-party server ever sees your request. Supports age-restricted and member-only videos through browser cookies, real-time progress tracking, dark mode, and a CLI for power users.",
    detail: [
      "Chrome extension (TypeScript + React, MV3) injects a floating download panel into the YouTube page that matches YouTube's own UI, with the same colors, typography, and button shapes.",
      "Python HTTP bridge runs on localhost:8765, receives the video URL, queues the job, and streams yt-dlp progress back to the extension in real time.",
      "Supports age-restricted and member-only videos via exported browser cookies (Netscape format), with a CLI fallback that reads cookies directly from your Chrome profile.",
    ],
    sections: [
      {
        heading: "How it works",
        body: "The extension's content script injects a Download button into every YouTube watch page. Clicking it sends the video URL to a lightweight Python HTTP server running locally at 127.0.0.1:8765. The server queues the job, kicks off yt-dlp (merging best video + best audio into MP4 via ffmpeg), and streams live progress back. The extension polls /jobs/{id} and renders a real-time progress bar. Nothing ever leaves your machine.",
        bullets: [
          "Content script injects a floating panel that reuses YouTube's own CSS variables so it looks like it belongs there.",
          "Service worker proxies messages between the injected panel and the local bridge, keeping the extension permissions minimal.",
          "Bridge exposes three endpoints: GET /health, POST /download, GET /jobs/{id}, simple enough to curl from the terminal.",
          "ffmpeg merges the best available video stream with the best audio stream into a single MP4 automatically.",
        ],
      },
      {
        heading: "Why local-first",
        body: "Every cloud-based YouTube downloader logs your IP, the video URL, and the timestamp on their server. YT Local routes all traffic through your own machine: the extension is a thin UI layer, and yt-dlp talks directly to YouTube's CDN from your IP. No relay, no quota, no account required.",
        bullets: [
          "Zero telemetry: the extension and bridge have no analytics, no error reporting to a remote endpoint.",
          "Works with any video yt-dlp supports, including age-restricted, members-only, and unlisted videos via your own session cookies.",
          "CLI mode available for scripting and batch downloads without the browser.",
          "MIT licensed, auditable end-to-end, no black boxes.",
        ],
      },
      {
        heading: "Stack & architecture",
        body: "Built with TypeScript on the extension side and Python on the bridge side, keeping each layer in its strongest language:",
        bullets: [
          "browser_extension/: TypeScript + React (popup settings), Vite build, Chrome MV3 manifest.",
          "youtube_downloader/bridge.py: ThreadingHTTPServer with a job queue; each download runs in its own thread.",
          "youtube_downloader/cli.py: thin yt-dlp wrapper with --output-dir, --cookies, and multi-URL support.",
          "CI via GitHub Actions; Python linted with ruff, TypeScript with ESLint.",
        ],
      },
    ],
    tags: ["TypeScript", "Python", "Chrome Extension", "yt-dlp", "React", "MV3", "Local-first", "ffmpeg", "Open Source"],
    color: "#FF4444",
    icon: "▶",
    status: "MIT Open Source",
    github: "https://github.com/misterpoloy/youtube-download-extension",
    banner: "https://raw.githubusercontent.com/misterpoloy/youtube-download-extension/main/banner.png",
    screenshots: [
      "https://raw.githubusercontent.com/misterpoloy/youtube-download-extension/main/banner.png",
    ],
    demoVideo: "mVZQv7n_E5s",
  },
  {
    id: "shadow-cursor",
    name: "ShadowCursor",
    tagline: "Press a shortcut, speak your intent. ShadowCursor reads the page and guides you through it.",
    description:
      "ShadowCursor is an open-source Chrome extension that turns voice commands into guided browser automation. Press Cmd+Shift+K, speak your request, and the extension captures a screenshot, scrapes the visible DOM, and sends everything to Claude or OpenAI. The model either answers your question inline or proposes a supervised step-by-step action plan with an animated ghost cursor.",
    detail: [
      "Voice capture with live transcript via MediaRecorder + Web Speech API; stops automatically on silence or manually via keyboard.",
      "Multimodal context assembly: screenshot + DOM snapshot + page URL are bundled into a single LLM prompt for accurate, page-aware responses.",
      "Confirmation-first execution: every action step requires user approval before the ghost cursor moves, so nothing runs without your sign-off.",
    ],
    sections: [
      {
        heading: "Runtime flow",
        body: "The full pipeline from keypress to executed action runs entirely inside your browser, with no relay server and no persistent cloud session:",
        bullets: [
          "Cmd+Shift+K (macOS) or Ctrl+Shift+K triggers voice capture; a recording indicator appears in-page.",
          "On capture end, the content script bundles raw audio, transcript, DOM snapshot, and page metadata and hands it to the background service worker.",
          "The service worker captures a tab screenshot, optionally upgrades the transcript via an external STT provider, then assembles the full multimodal prompt.",
          "The LLM returns either mode: 'answer' (explanation card) or mode: 'action' (step list); the content script renders the result and executes each confirmed step.",
        ],
      },
      {
        heading: "Stack & architecture",
        body: "Built entirely in TypeScript with Webpack, structured around Chrome's Manifest V3 service worker model:",
        bullets: [
          "background/: service-worker.ts orchestrates screenshots, STT resolution, and LLM routing; llm-router.ts supports Anthropic and OpenAI with user-supplied BYOK keys.",
          "content/: trigger.ts, voice-capture.ts, dom-scraper.ts, action-executor.ts, and shadow-cursor.ts each own a single responsibility; they communicate via typed chrome.runtime messages.",
          "shared/: types.ts, constants.ts, storage.ts, and messaging.ts provide a strict contract between background and content layers.",
          "Options page lets users configure LLM provider, API keys, STT provider, auto-execute preference, and destructive-action confirmation.",
        ],
      },
      {
        heading: "Security & privacy",
        body: "ShadowCursor handles sensitive page context; screenshots and DOM snapshots may contain personal data. The project ships with explicit guidance:",
        bullets: [
          "API keys are stored in chrome.storage.sync, never in source control or .env files.",
          "No keys, screenshots, or session exports are committed to the repository.",
          "Host access uses <all_urls> by default; production deployments should restrict to an allowlist.",
          "SECURITY.md documents responsible disclosure guidance for vulnerability reports.",
        ],
      },
    ],
    tags: ["TypeScript", "Chrome Extension", "AI", "LLM", "Voice", "Multimodal", "MV3", "Webpack", "Claude", "OpenAI"],
    color: "#7F77DD",
    icon: "◈",
    status: "MIT Open Source",
    github: "https://github.com/misterpoloy/shadow-cursor",
    banner: "/img/projects/shadow-cursor-feature.gif",
    screenshots: [
      "/img/projects/shadow-cursor-feature.gif",
      "/img/projects/shadow-curso.gif",
      "/img/projects/shadow-curso-aws.gif",
    ],
    demoVideo: null,
  },
  {
    id: "smartquiz-cloud",
    name: "SmartQuiz.cloud",
    tagline: "Cloud certification prep for AWS, Azure, and GCP in one focused learning experience.",
    description:
      "SmartQuiz.cloud is a web app designed to help engineers prepare for cloud certifications with structured quiz-based practice across AWS, Azure, and Google Cloud. The product is positioned as a focused study experience for learners who want quick repetition, clear topic coverage, and a cleaner alternative to scattered notes and flashcards.",
    detail: [
      "Certification-oriented study flow centered on repeated practice rather than passive reading.",
      "Multi-cloud scope across AWS, Azure, and GCP, which makes it useful for both specialists and platform generalists.",
      "Visual web interface tailored for short study sessions, topic review, and progressive exam preparation.",
    ],
    sections: [
      {
        heading: "Product focus",
        body: "The clearest message on the live site is straightforward: SmartQuiz.cloud is for preparing cloud certifications across the three major providers. That makes the product less of a generic trivia app and more of a purpose-built study surface for technical learners working toward exam readiness.",
        bullets: [
          "Supports AWS, Azure, and GCP preparation in one place.",
          "Uses quiz-driven repetition to reinforce core platform knowledge.",
          "Fits learners who want a lighter-weight study loop than full video courses.",
          "Works well as a companion tool alongside official docs and hands-on labs.",
        ],
      },
      {
        heading: "Why it stands out",
        body: "What makes the concept interesting is the narrowing of scope: instead of trying to be a general education platform, SmartQuiz.cloud appears to concentrate on the very specific workflow of certification preparation. That focus tends to make the UX more practical for engineers who want quick signal, frequent review, and less friction.",
        bullets: [
          "Cloud-specific positioning gives the product a more relevant study context.",
          "Multi-provider coverage is useful for cross-training and comparing services.",
          "Quiz-first UX is well suited to spaced repetition and active recall.",
          "The interface shown in the screenshots feels productized rather than just content-heavy.",
        ],
      },
      {
        heading: "Current presentation",
        body: "Based on the public homepage, the project is currently framed as a polished certification-prep experience with a concise value proposition. I’m keeping this summary intentionally conservative here and not inferring unsupported implementation details from the frontend alone.",
        bullets: [
          "Public messaging emphasizes certification preparation over broad learning.",
          "The homepage explicitly calls out AWS, Azure, and GCP.",
          "The two screenshots are included here as the current visual preview set.",
          "This entry can be expanded later with stack and architecture details if you want a deeper case study.",
        ],
      },
    ],
    tags: ["AWS", "Azure", "GCP", "Certifications", "Quiz App", "Study Tool", "Cloud Learning"],
    color: "#1D9E75",
    icon: "☁",
    status: "Mobile Application",
    github: "https://smartquiz.cloud/",
    linkLabel: "Open Project",
    banner: "/img/projects/smartquiz-screenshot-1.png",
    screenshots: [
      "/img/projects/smartquiz-screenshot-1.png",
      "/img/projects/smartquiz-screenshot-2.png",
    ],
    demoVideo: null,
  },
];

/** Look up a single project by its URL id. Returns undefined if not found. */
export function getProject(id) {
  return PROJECTS.find(p => p.id === id);
}
