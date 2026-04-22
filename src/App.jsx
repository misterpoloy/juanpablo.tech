import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import DiagramPage from "./pages/DiagramPage.jsx";
import OpenSource from "./pages/OpenSource.jsx";
import OpenSourceProject from "./pages/OpenSourceProject.jsx";
import Learn from "./pages/Learn.jsx";
import LearnDetail from "./pages/LearnDetail.jsx";
import Talks from "./pages/Talks.jsx";
import TalkDetail from "./pages/TalkDetail.jsx";
import About from "./pages/About.jsx";
import Me from "./pages/Me.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/diagram/:slug" element={<DiagramPage />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/open-source/:projectId" element={<OpenSourceProject />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:id" element={<LearnDetail />} />
        <Route path="/talks" element={<Talks />} />
        <Route path="/speaker/:talkId" element={<TalkDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/me" element={<Me />} />
      </Route>
    </Routes>
  );
}
