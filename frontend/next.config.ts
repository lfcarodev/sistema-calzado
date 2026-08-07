import path from "node:path";
import type { NextConfig } from "next";

const isElectron = process.env.ELECTRON === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

  ...(isElectron
    ? {
        output: "export",
        images: {
          unoptimized: true,
        },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
