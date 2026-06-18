import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".next.*/**",
    ".next-build/**",
    ".next-build*/**",
    "node_modules/**",
    "node_modules.*/**",
    "out/**",
    "build/**",
    "clean/**",
    ".runtime/**",
    ".runtime-yarn/**",
    ".npm-cache*/**",
    ".npm-meta-cache/**",
    ".npm-test-react/**",
    ".tmp/**",
    ".npm-eperm-unlink-patch.cjs",
    "scripts/build-next.cjs",
    "next-env.d.ts",
  ]),
]);
