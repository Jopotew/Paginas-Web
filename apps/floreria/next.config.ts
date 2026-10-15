import type { NextConfig } from "next";

// Export estático: el MVP no tiene backend, así que se publica como archivos
// en cualquier hosting (Vercel, Netlify, GitHub Pages, un bucket).
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // next/image necesita un servidor para optimizar; en export estático las
    // imágenes se sirven tal cual. Subí fotos ya redimensionadas (ver docs/05).
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
