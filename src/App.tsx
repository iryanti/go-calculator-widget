import ReactDOM from "react-dom/client";
import { WidgetRoot } from "./widget/WidgetRoot";
import "./styles.css";

const el = document.getElementById("go-calculator");
if (!el) throw new Error("Missing container: #go-calculator");

ReactDOM.createRoot(el).render(<WidgetRoot />);
