import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { WidgetRoot } from "./widget/WidgetRoot";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WidgetRoot />
  </React.StrictMode>
);