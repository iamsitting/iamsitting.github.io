import { Outlet } from "react-router-dom";
import "./app.css";
import Navbar from "./components/Navbar";
import { MetaTags } from './components/MetaTags';
import "~/styles/typst.css";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
}
