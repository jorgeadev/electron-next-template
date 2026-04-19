<div align="center">
  <h1>⚛️ Electron + Next.js Template</h1>
  <p>
    <b>A minimal, production-ready desktop application template built with Next.js (App Router), React, TypeScript, and Tailwind CSS v4.</b>
  </p>

  <!-- Badges -->
  <p>
    <a href="https://github.com/jorgeadev/electron-next-template/actions"><img src="https://img.shields.io/github/actions/workflow/status/jorgeadev/electron-next-template/daily-security-audit.yml?style=flat-square&logo=github&label=build" alt="Build Status"/></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-≥18.0.0-339933?style=flat-square&logo=node.js" alt="Node Version"/></a>
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
- **Modern Styling:** Integrated with the newly released **Tailwind CSS v4**.
- **Developer Experience:** Blazing fast hot-module reloading powered by Turbopack.
- **Strict Security:** Enforced Context Isolation, Sandboxing, and disabled Node Integration in the renderer.
- **Strong Typing:** 100% written in TypeScript.
- **Hardened CI/CD:** Automated daily security audits seamlessly updating vulnerable transitive dependencies via GitHub Actions.

---

## 🛠 Installation

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v10+ recommended)

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

> **Note:** The UI operates on `http://localhost:3000` while Electron waits for the port to open before securely attaching.

### Building for Production

Compile the Next.js app to raw HTML/CSS/JS bundles and package it into a minimal Electron binary:

```bash
pnpm build
```

### Packaging & Distribution

Create a highly optimized, distributable Windows NSIS installer (`.exe` x64) out-of-the-box:

```bash
pnpm dist
```

_The resulting bundled artifacts will be placed automatically generated inside the `dist/` directory._

---

## 🏗 Architecture & Mechanics

<details>
<summary><b>🔍 View Project Structure</b></summary>

```text
├── electron/
│   ├── main.js        # Electron main process
│   └── preload.js     # Context-isolated bridge script
├── src/
│   └── app/           # Next.js App Router (pages, layouts, components)
├── public/            # Static assets
├── scripts/           # Native maintainance & security scripts
├── next.config.ts     # Next.js export configuration
├── package.json       # App configuration and dependencies
└── tsconfig.json      # TypeScript compiler settings
```

</details>

<details>
<summary><b>⚙️ View Available Scripts</b></summary>

Use these helper scripts to navigate development efficiently.

| Command               | Action                                             |
| --------------------- | -------------------------------------------------- |
| `pnpm dev`            | Start Next.js dev server and Electron together     |
| `pnpm dev:next`       | Start Next.js dev server only (Turbopack)          |
| `pnpm dev:electron`   | Start Electron renderer only                       |
| `pnpm build`          | Build Next.js static export + package Electron app |
| `pnpm build:next`     | Build Next.js static export only                   |
| `pnpm build:electron` | Package Electron app only (no installer format)    |
| `pnpm dist`           | Build and create distributable Windows installer   |
| `pnpm lint`           | Run strict ESLint rules over the codebase          |
| `pnpm format`         | Format files utilizing Prettier defaults           |

</details>

<details>
<summary><b>🛡️ View Security Model</b></summary>

The Electron `main.js` process is natively configured out-of-the-box using the strictest security defaults:

- `contextIsolation: true` — Renderer and preload scripts run in entirely separate JS engine contexts.
- `nodeIntegration: false` — Under no circumstances are raw Node.js APIs exposed to the renderer UI.
- `sandbox: true` — The renderer process operates under heavy OS-sandboxing restrictions.
- **Link Handling** — All external `target="_blank"` anchors automatically route their output to your native system browser securely via `shell.openExternal`.

</details>

---

## 🎨 API & Customization

Adapting the template for your specific project is painless. Refer to the matrix below:

| Modification Target          | Path / Location                             |
| ---------------------------- | ------------------------------------------- |
| **Frontend UI/Pages**        | `src/app/`                                  |
| **Electron Window settings** | `electron/main.js`                          |
| **Exposing Secure APIs**     | `electron/preload.js` (via `contextBridge`) |
| **Next.js Framework Config** | `next.config.ts`                            |
| **App Name / Build Output**  | `"build"` dictionary in `package.json`      |

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
