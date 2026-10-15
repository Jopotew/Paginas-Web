import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los paquetes del monorepo se publican como TypeScript fuente; Next los compila.
  transpilePackages: ["@pw/core", "@pw/ropa"],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
