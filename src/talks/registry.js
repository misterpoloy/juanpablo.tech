/**
 * Registry of all public talks and conference appearances.
 * Add a new entry here to have it appear on /talks and /speaker/:id.
 */
export const TALKS = [
  {
    id: "js-conf-2024",
    conference: "JSConf Chile",
    edition: "2024",
    title: "Multithread in Javascript with Web Workers",
    date: "December 7, 2024",
    time: "12:30 PM",
    country: "Chile",
    city: "Santiago",
    flag: "🇨🇱",
    color: "#F7DF1E",           // JavaScript yellow — distinct, recognizable
    status: "Delivered",
    conferenceUrl: "https://jsconf.dev/charlistas/juan-pablo-ortiz/",
    externalLabel: "View on jsconf.dev",
    featureImage: "/img/talks/jsconf.JPG",

    abstract:
      "JavaScript is often described as single-threaded, but that's only half the story. This session dives into web workers — the browser's built-in mechanism for true parallelism — and shows how to offload CPU-intensive work off the main thread without blocking the UI. We'll cover the fundamentals of concurrency vs. parallelism, walk through the JavaScript runtime model, and build real examples that demonstrate measurable performance gains.",

    topics: [
      "JavaScript Runtime model — call stack, event loop, and task queue",
      "Concurrency vs. parallelism: what they mean in a browser context",
      "Web Workers API — setup, communication, and lifecycle",
      "Shared memory with SharedArrayBuffer and Atomics",
      "Practical patterns: image processing, data parsing, and heavy computation off the main thread",
      "Pitfalls, debugging strategies, and browser support",
    ],

    speaker: {
      name: "Juan Pablo Ortiz",
      company: "",
      location: "Mexico City, Mexico",
      origin: "Guatemala",
      bio: "Self-motivated engineer and lifelong learner with 7+ years of industry experience starting at age 16. Specializes in DevOps, CI/CD pipelines, cloud architecture, cost optimization, and high-performance systems. Based in Mexico City for the past 5 years, originally from Guatemala.",
      social: {
        linkedin: "https://linkedin.com/in/juan-pablo-ortiz",
        instagram: "https://instagram.com/wildpasco",
        github: "https://github.com/misterpoloy",
      },
    },
  },
  {
    id: "seattle-webdevcon",
    conference: "Seattle WebDevCon",
    edition: "Amazon Internal",
    title: "Concurrency & Multithreading in JavaScript",
    country: "USA",
    city: "Seattle",
    flag: "🇺🇸",
    color: "#FF9900",
    status: "Delivered",
    videoUrl: "https://www.youtube.com/watch?v=J4IFmOdWrJ4",
    externalLabel: "Watch on YouTube",
    featureImage: "/img/talks/webdevcon-juan-pablo-ortiz.jpg",

    abstract:
      "This session was delivered at an internal Amazon web technologies conference in Seattle and focused on concurrency, multithreading, and performance-oriented JavaScript patterns. It was a meaningful milestone personally as well: I was the first Mexican employee from Audible invited to participate in the event. The talk walks through how JavaScript handles work across the event loop and where Web Workers become essential when the main thread starts to bottleneck.",

    topics: [
      "How concurrency differs from true multithreading in JavaScript environments",
      "When Web Workers are worth the complexity in real frontend systems",
      "Main-thread bottlenecks, UI responsiveness, and performance tradeoffs",
      "Practical examples for offloading CPU-heavy work from the browser thread",
      "Lessons from presenting JavaScript performance topics in an internal Amazon engineering forum",
    ],

    speaker: {
      name: "Juan Pablo Ortiz",
      company: "",
      location: "Mexico City, Mexico",
      origin: "Guatemala",
      bio: "Self-motivated engineer and lifelong learner with 7+ years of industry experience starting at age 16. Specializes in DevOps, CI/CD pipelines, cloud architecture, cost optimization, and high-performance systems. Based in Mexico City for the past 5 years, originally from Guatemala.",
      social: {
        linkedin: "https://linkedin.com/in/juan-pablo-ortiz",
        instagram: "https://instagram.com/wildpasco",
        github: "https://github.com/misterpoloy",
      },
    },
  },
  {
    id: "aws-community-day-guatemala-2025",
    conference: "AWS Community Day Guatemala",
    edition: "2025",
    title: "AWS Community Day Guatemala 2025",
    date: "October 18, 2025",
    time: "07:30 AM",
    country: "Guatemala",
    city: "Guatemala City",
    flag: "🇬🇹",
    color: "#FF9900",
    status: "Delivered",
    conferenceUrl: "https://www.corporacionbi.com/gt/bancoindustrial/evento/aws-community-day-guatemala/",
    externalLabel: "View event page",
    featureImage: "https://www.corporacionbi.com/gt/bancoindustrial/wp-content/uploads/2025/10/Final-AWS-Community-Day.webp",
    eventImages: [
      "/img/talks/IMG_7682.JPG",
      "/img/talks/IMG_7686.jpg",
    ],

    abstract:
      "This entry captures participation in AWS Community Day Guatemala 2025, the third edition of the event organized by AWS User Group Guatemala alongside AWS Girls Chapter Guatemala and AWS User Group Chimaltenango. According to the official event page, the conference brought together cloud professionals for talks, workshops, networking, and shared learning around Amazon Web Services. The event was held at Universidad Rafael Landivar in Guatemala City and positioned as a community-focused space for developers, architects, DevOps engineers, security practitioners, and data and ML professionals across experience levels.",

    topics: [
      "AWS community learning through technical talks, workshops, and networking",
      "Cloud architecture, security, and modern engineering practices",
      "Developer, architect, DevOps, data, and ML participation across the local ecosystem",
      "Community-led AWS knowledge sharing in Guatemala and the broader region",
      "Digital transformation and real-world AWS adoption in Central America",
    ],

    speaker: {
      name: "Juan Pablo Ortiz",
      company: "",
      location: "Mexico City, Mexico",
      origin: "Guatemala",
      bio: "Self-motivated engineer and lifelong learner with 7+ years of industry experience starting at age 16. Specializes in DevOps, CI/CD pipelines, cloud architecture, cost optimization, and high-performance systems. Based in Mexico City for the past 5 years, originally from Guatemala.",
      social: {
        linkedin: "https://linkedin.com/in/juan-pablo-ortiz",
        instagram: "https://instagram.com/wildpasco",
        github: "https://github.com/misterpoloy",
      },
    },
  },
];

export function getTalk(id) {
  return TALKS.find(t => t.id === id);
}
