import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DiagramPage from "./pages/DiagramPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagram/:slug" element={<DiagramPage />} />
    </Routes>
  );
}
