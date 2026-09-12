import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // exceljs (menu import/export) does dynamic requires that break when
  // bundled by Next's serverless function tracer; ship it unbundled from
  // node_modules instead.
  serverExternalPackages: ["exceljs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
