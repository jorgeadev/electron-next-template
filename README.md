# Electron + Next.js Template

A minimal, production-ready desktop application template built with **Electron** and **Next.js** (App Router). The UI is written in React with TypeScript and styled using Tailwind CSS v4. The Next.js app is statically exported so it can be loaded directly by Electron in production — no server required.

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) |
| UI framework | [Next.js 16](https://nextjs.org/) (App Router, static export) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Linting | [ESLint](https://eslint.org/) + [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) |
| Formatting | [Prettier](https://prettier.io/) + [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) |
| Packaging | [electron-builder](https://www.electron.build/) |
| Package manager | [pnpm](https://pnpm.io/) |

## Project Structure

```
├── electron/
│   ├── main.js        # Electron main process
│   └── preload.js     # Context-isolated preload script
├── src/
│   └── app/           # Next.js App Router pages & layouts
├── public/            # Static assets
├── next.config.ts     # Next.js config (static export)
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Development

Starts the Next.js dev server and launches Electron once the server is ready:

```bash
pnpm dev
```

The Next.js app is served at `http://localhost:3000` and Electron loads it automatically.

### Production Build

Builds the Next.js app as a static export, then packages the Electron app:

```bash
pnpm build
```

### Distribution (Windows installer)

Creates a distributable Windows NSIS installer (`x64`):

```bash
pnpm dist
```

The output is placed in the `dist/` directory.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server and Electron together |
| `pnpm dev:next` | Start Next.js dev server only (Turbopack) |
| `pnpm dev:electron` | Start Electron only |
| `pnpm build` | Build Next.js static export + package Electron app |
| `pnpm build:next` | Build Next.js static export only |
| `pnpm build:electron` | Package Electron app only (no installer) |
| `pnpm dist` | Build and create distributable Windows installer |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint and auto-fix issues |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing changes |

## Architecture

### Dev mode

```
pnpm dev
 ├─ next dev --turbopack -p 3000   (Next.js dev server)
 └─ wait-on localhost:3000 → electron .   (Electron loads http://localhost:3000)
```

### Production mode

```
pnpm build
 ├─ next build --turbopack && next export  →  out/
 └─ electron-builder  →  Electron loads out/index.html from disk
```

### Security

The Electron main process is configured with a strict security model:

- `contextIsolation: true` — renderer and preload run in separate contexts
- `nodeIntegration: false` — Node.js APIs are not exposed to the renderer
- `sandbox: true` — renderer process is OS-sandboxed
- External links are opened in the system browser via `shell.openExternal`

## Customization

| What to change | Where |
|---|---|
| App UI | `src/app/` |
| Electron window settings | `electron/main.js` |
| Expose APIs to renderer | `electron/preload.js` (via `contextBridge`) |
| Next.js config | `next.config.ts` |
| App metadata / build targets | `package.json` → `"build"` section |
| Code style | `.prettierrc`, `eslint.config.mjs` |

## License

This project is open source. See [LICENSE](LICENSE) for details (if present).
