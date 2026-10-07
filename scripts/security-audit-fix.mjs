import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspacePath = path.resolve(__dirname, "../pnpm-workspace.yaml");
const execOptions = { stdio: "inherit", cwd: path.resolve(__dirname, "..") };

// Permanent overrides that are NOT from security fixes
const permanentOverrides = {
	"undici-types": "7.24.6",
	// yauzl >= 3.3.1 fixes a silent extraction hang on Node >= 24.16 / >= 26.1
	// used by electron's install script (extract-zip -> yauzl)
	yauzl: "^3.3.1",
};

console.log("🔄 Reading pnpm-workspace.yaml...");
const workspace = parse(fs.readFileSync(workspacePath, "utf8")) ?? {};

console.log("🧹 Cleaning previous security overrides...");
workspace.overrides = { ...permanentOverrides };
fs.writeFileSync(workspacePath, stringify(workspace));

const runPnpmInstall = () => {
	execSync("pnpm install --no-frozen-lockfile --config.trust-policy=none", execOptions);
};

try {
	console.log("📦 Running a fresh pnpm install to resolve naturally...");
	runPnpmInstall();

	console.log("🛡️ Running pnpm audit...");
	// This will throw if vulnerabilities are found
	execSync("pnpm audit", { ...execOptions, stdio: "pipe" });
	console.log("✅ No vulnerabilities found! Everything is secure.");
} catch (error) {
	if (error.status !== undefined && error.status > 0) {
		console.log("⚠️ Vulnerabilities found in audit. Running pnpm audit --fix...");
		try {
			execSync("pnpm audit --fix", execOptions);
		} catch (fixError) {
			console.log("ℹ️ Note: pnpm audit --fix returned a non-zero exit code. It may not have fixed everything automatically.");
			console.log(fixError);
		}

		console.log("📦 Re-running pnpm install to lock in the patched overrides...");
		runPnpmInstall();

		console.log("✅ Security patches applied successfully where possible.");
	} else {
		console.error("❌ An unexpected error occurred:", error.message);
		process.exit(1);
	}
}
