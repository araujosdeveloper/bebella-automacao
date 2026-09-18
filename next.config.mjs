import path from "node:path";

const nextConfig = {
  distDir: ".next-build",
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(process.cwd());
    return config;
  },
};

export default nextConfig;
