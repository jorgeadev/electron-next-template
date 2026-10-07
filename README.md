<div align="center">
  <h1>⚛️ Electron + Next.js Template</h1>
  <p>
    <b>A minimal, production-ready desktop application template built with Next.js (App Router), React, TypeScript, and Tailwind CSS v4.</b>
  </p>

  <!-- Badges -->
  <p>
    <a href="https://github.com/jorgeadev/electron-next-template/actions"><img src="https://img.shields.io/github/actions/workflow/status/jorgeadev/electron-next-template/ci.yml?style=flat-square&logo=github&label=build" alt="Build Status"/></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-≥24.0.0-339933?style=flat-square&logo=node.js" alt="Node Version"/></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16+-000000?style=flat-square&logo=next.js" alt="Next.js Version"/></a>
    <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-Latest-47848F?style=flat-square&logo=electron" alt="Electron Version"/></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"/></a>
    <a href="https://github.com/jorgeadev/electron-next-template/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"/></a>
  </p>
</div>

<br />

## 📖 Overview

This repository provides a rock-solid foundation for building cross-platform desktop applications.

We merge the power of **Electron** for native OS capabilities with the developer experience of **Next.js**. The application uses a strictly isolated, pre-configured static export—eliminating the need for a local Node.js server in production while utilizing the modern Next.js App Router.

---

## ✨ Features

- **Built for Scale:** Leverages Next.js 16 (App Router) with full Static HTML Export support.
- **Custom `app://` Protocol:** Production assets are served through a privileged custom protocol instead of `file://`. This gives the app a stable, secure origin with proper web semantics (localStorage, `fetch`, CSP headers) and removes the filesystem privileges of `file://`.
- **Secure by Default:** Context isolation, renderer sandboxing, disabled Node integration, a strict Content Security Policy, denied permission requests, navigation guards, single-instance lock, and validated IPC senders.
- **Typed IPC Bridge:** A minimal `contextBridge` API, typed for the renderer in `src/types/electron.d.ts`.
- **Modern Styling:** Integrated with the newly released **Tailwind CSS v4** using `@theme` design tokens.
- **Developer Experience:** Blazing fast hot-module reloading powered by Turbopack, one formatter (Prettier), strict ESLint, and `tsc --noEmit` type checking.
- **Tiny Packages:** Next.js and React stay in `devDependencies` because the renderer is fully bundled at build time. Only `electron/`, `out/`, and `package.json` ship inside the ~1 MB `app.asar`.
- **Hardened CI/CD:** Pull request checks for formatting, linting, types, and the static export, plus automated weekly security audits that open PRs with vulnerable dependency overrides.

---

## 🛠 Installation

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v24 or higher)
- [pnpm](https://pnpm.io/) (v12+ recommended)

### Setup

Clone the repository and install the dependencies:

```bash
git clone https://github.com/jorgeadev/electron-next-template.git
cd electron-next-template

# Install dependencies using pnpm
pnpm install
```

---

## 🚀 Usage

### Development Environment

Spin up both the Next.js dev server and the Electron shell simultaneously:

```bash
pnpm dev
```

> **Note:** The UI operates on `http://localhost:3000` while Electron waits for the port to open before securely attaching. Closing the app also stops the dev server.

### Building for Production

Compile the Next.js app to raw HTML/CSS/JS bundles and package it into a minimal Electron binary:

```bash
pnpm build
```

### Packaging & Distribution

Create a distributable installer for your current platform (NSIS installer on Windows, DMG on macOS, AppImage on Linux):

```bash
pnpm dist
```

_The resulting artifacts are placed inside the `dist/` directory._

---

## 🏗 Architecture & Mechanics

<details>
<summary><b>🔍 View Project Structure</b></summary>

```text
├── .github/workflows/  # CI checks and the weekly security audit
├── electron/
│   ├── main.js         # Main process (window, app:// protocol, IPC, security)
│   └── preload.cjs     # Sandboxed CommonJS context bridge
├── public/             # Static assets copied as-is
├── scripts/
│   └── security-audit-fix.mjs
├── src/
│   ├── app/            # Next.js App Router (pages, layouts)
│   ├── components/     # React components
│   ├── hooks/          # Reusable hooks (localStorage-backed todo store)
│   ├── styles/         # Tailwind CSS entry and theme tokens
│   └── types/          # Global renderer typings (window.electronAPI)
├── next.config.ts      # Next.js static export configuration
├── pnpm-workspace.yaml # pnpm settings, overrides and build allowlists
└── package.json        # App configuration and dependencies
```

</details>

<details>
<summary><b>🌐 How Production Serving Works</b></summary>

`next build` outputs a fully static site into `out/`. In production, the Electron main process:

1. Registers a privileged `app://` scheme (`standard`, `secure`, fetch-enabled) before the app is ready.
2. Handles requests by resolving them to files inside `out/` (with path-traversal protection) and serving them with `net.fetch`.
3. Adds a strict `Content-Security-Policy` header to HTML responses.
4. Loads `app://bundle/index.html` into the window.

Why not `file://`?

- `file://` pages are treated specially and can access arbitrary local files; a scoped custom protocol limits the renderer to your bundled assets.
- The `app://` origin is a real, secure origin, so `localStorage`, `fetch`, and CSP all behave like a normal website.

In development, the window simply loads `http://localhost:3000`.

</details>

<details>
<summary><b>⚙️ View Available Scripts</b></summary>

| Command               | Action                                                              |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm dev`            | Start Next.js dev server and Electron together                      |
| `pnpm dev:next`       | Start Next.js dev server only (Turbopack)                           |
| `pnpm dev:electron`   | Start Electron only (expects the dev server to be running)          |
| `pnpm build`          | Build the static export and package the unpacked Electron app       |
| `pnpm build:next`     | Build the Next.js static export only                                |
| `pnpm build:electron` | Package the Electron app only (unpacked, no installer)              |
| `pnpm dist`           | Build and create a distributable installer for the current platform |
| `pnpm lint`           | Run strict ESLint rules over the codebase                           |
| `pnpm lint:fix`       | Auto-fix lint issues                                                |
| `pnpm typecheck`      | Type-check the project with `tsc --noEmit`                          |
| `pnpm format`         | Format files utilizing Prettier defaults                            |
| `pnpm format:check`   | Verify formatting without writing changes                           |

</details>

<details>
<summary><b>🛡️ View Security Model</b></summary>

The Electron `main.js` process is natively configured out-of-the-box using the strictest security defaults:

- `contextIsolation: true` — Renderer and preload scripts run in entirely separate JS engine contexts.
- `nodeIntegration: false` — Under no circumstances are raw Node.js APIs exposed to the renderer UI.
- `sandbox: true` — The renderer process operates under heavy OS-sandboxing restrictions.
- `webviewTag: false` — The legacy `<webview>` tag is disabled.
- **Sandbox-safe preload** — `electron/preload.cjs` is CommonJS because sandboxed preload scripts cannot use ESM imports.
- **Content Security Policy** — HTML responses are served with `default-src 'self'` and no remote origins. `unsafe-inline` is only required for Next.js hydration payloads; `unsafe-eval` is never allowed.
- **Permissions denied by default** — `setPermissionRequestHandler` and `setPermissionCheckHandler` reject every session permission request.
- **Navigation locked down** — `will-navigate` blocks navigation away from the app; `setWindowOpenHandler` denies new windows.
- **Validated IPC senders** — Every `ipcMain.handle` verifies the sender frame belongs to the app before responding.
- **Links handled safely** — External links are opened in the system browser via `shell.openExternal` after validating the `http:`/`https:` protocol.
- **Single instance** — A second launch focuses the existing window instead of opening a duplicate.

</details>

---

## 🎨 API & Customization

Adapting the template for your specific project is painless. Refer to the matrix below:

| Modification Target           | Path / Location                                    |
| ----------------------------- | -------------------------------------------------- |
| **Frontend UI/Pages**         | `src/app/`                                         |
| **UI Components**             | `src/components/`                                  |
| **State & Reusable Hooks**    | `src/hooks/`                                       |
| **Electron Window settings**  | `electron/main.js`                                 |
| **Exposing Secure APIs**      | `electron/preload.cjs` + `src/types/electron.d.ts` |
| **Next.js Framework Config**  | `next.config.ts`                                   |
| **App Name / Build Output**   | `"build"` dictionary in `package.json`             |
| **pnpm Settings & Overrides** | `pnpm-workspace.yaml`                              |

---

## 🤝 Contributing

Contributions are always welcome. If you discover a bug, vulnerability, or feature gap, please:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
