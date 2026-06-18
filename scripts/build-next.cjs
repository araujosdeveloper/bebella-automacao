const path = require("path");

const patchPath = path.resolve(__dirname, "../.npm-eperm-unlink-patch.cjs");
const existingNodeOptions = process.env.NODE_OPTIONS || "";
const requirePatchOption = `--require=${patchPath}`;

if (!existingNodeOptions.includes(requirePatchOption)) {
  process.env.NODE_OPTIONS = [existingNodeOptions, requirePatchOption].filter(Boolean).join(" ");
}

process.argv = [process.argv[0], require.resolve("next/dist/bin/next"), "build", "--webpack"];
require("../.npm-eperm-unlink-patch.cjs");
require("next/dist/bin/next");
