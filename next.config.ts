import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Web estàtica sense backend: `npm run build` genera la carpeta `out/`.
  // No activis `cacheComponents` / `partialPrefetching`: són incompatibles amb
  // `output: "export"` ("PPR cannot be enabled in export mode").
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
