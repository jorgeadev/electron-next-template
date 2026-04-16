import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, '../package.json');

console.log('🔄 Reading package.json...');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Permanent overrides that are NOT from security fixes
const permanentOverrides = {
  "undici-types": "6.24.1"
};

console.log('🧹 Cleaning previous security overrides...');
packageJson.pnpm = packageJson.pnpm || {};
packageJson.pnpm.overrides = { ...permanentOverrides };
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n');

// Options for execSync
const execOptions = { stdio: 'inherit', cwd: path.resolve(__dirname, '..') };

try {
  console.log('📦 Running a fresh pnpm install to resolve naturally...');
  execSync('pnpm install --config.trust-policies=false', execOptions);

  console.log('🛡️ Running pnpm audit...');
  // This will throw if vulnerabilities are found
  execSync('pnpm audit', { ...execOptions, stdio: 'pipe' });
  console.log('✅ No vulnerabilities found! Everything is secure.');

} catch (error) {
  if (error.status !== undefined && error.status > 0) {
    console.log('⚠️ Vulnerabilities found in audit. Running pnpm audit --fix...');
    try {
      execSync('pnpm audit --fix', execOptions);
    } catch (fixError) {
      console.log('ℹ️ Note: pnpm audit --fix returned a non-zero exit code. It may not have fixed everything automatically.');
    }

    console.log('📦 Re-running pnpm install to lock in the patched overrides...');
    execSync('pnpm install --config.trust-policies=false', execOptions);
    console.log('✅ Security patches applied successfully where possible.');
  } else {
    console.error('❌ An unexpected error occurred:', error.message);
    process.exit(1);
  }
}
