import ReactDOM from "react-dom/client";
import { WidgetRoot } from "./widget/WidgetRoot";
import "./styles.css";

type MountTarget = string | Element;

type GoCalculatorConfig = Record<string, unknown>; // keep simple for now

export type WidgetHandle = {
  update: (nextConfig?: GoCalculatorConfig) => void;
  unmount: () => void;
};

function resolveTarget(target: MountTarget): Element {
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) {
      throw new Error(
        `YPWidgets.GoCalculator.mount(): target not found for selector "${target}". ` +
          `Make sure the element exists before calling mount().`
      );
    }
    return el;
  }

  if (!target) {
    throw new Error(
      "YPWidgets.GoCalculator.mount(): target is null/undefined. Provide a selector or DOM element."
    );
  }

  return target;
}

function mount(target: MountTarget, _config?: GoCalculatorConfig): WidgetHandle {
  const container = resolveTarget(target);

  // --- idempotent mount (same container -> return existing handle) ---
  const existing = (container as any).__go_widget_handle__ as WidgetHandle | undefined;
  if (existing) return existing;

  const root = ReactDOM.createRoot(container);

  // config not used yet; reserved for future
  root.render(<WidgetRoot />);

  const handle: WidgetHandle = {
    update(nextConfig?: GoCalculatorConfig) {
      // minimal behavior: re-render
      // later: merge config + pass into WidgetRoot
      void nextConfig;
      root.render(<WidgetRoot />);
    },
    unmount() {
      root.unmount();
      container.innerHTML = "";

      delete (container as any).__go_widget_root__;
      delete (container as any).__go_widget_handle__;
    },
  };

  (container as any).__go_widget_root__ = root;
  (container as any).__go_widget_handle__ = handle;

  return handle;
}

const VERSION = __WIDGET_VERSION__;

const w = window as any;
w.YPWidgets = w.YPWidgets || {};
w.YPWidgets.GoCalculator = w.YPWidgets.GoCalculator || {};

w.YPWidgets.GoCalculator.version = VERSION;
w.YPWidgets.GoCalculator.mount = mount;