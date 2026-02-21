# GO Calculator Widget

Embeddable Group Order (GO) price calculator for KR / CN / JP systems.

Built with TypeScript, React, and Vite (UMD library mode).

---

## ✨ Features

- KR / CN / JP calculation system
- Exchange rate auto-fetch (KRW / CNY)
- Daily rate caching
- Multi-instance support
- CSS auto-injected
- No React required on host site
- Exposed version via global API

---

## 🚀 Embed Usage

```html
<div id="go-calculator"></div>

<script src="https://YOUR_CDN/go-widget.umd.js"></script>
<script>
  window.YPWidgets.GoCalculator.mount("#go-calculator");
</script>
```

---

## 🧠 API

```js
const handle = window.YPWidgets.GoCalculator.mount("#go-calculator");

console.log(window.YPWidgets.GoCalculator.version);

// Update (future config support)
handle.update({});

// Unmount
handle.unmount();
```

---

## 📦 Build

```bash
npm install
npm run build
```

Output file:

```
dist/go-widget.umd.js
```

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 📄 License

MIT