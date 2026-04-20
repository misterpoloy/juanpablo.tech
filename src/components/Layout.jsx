import { Outlet } from "react-router-dom";
import Navbar, { NAVBAR_HEIGHT } from "./Navbar.jsx";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: NAVBAR_HEIGHT }}>
        <Outlet />
      </main>
    </>
  );
}
