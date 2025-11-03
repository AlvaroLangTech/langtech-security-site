import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Footer from "../components/Footer";


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Footer />

  </React.StrictMode>
);
