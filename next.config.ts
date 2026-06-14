import type { NextConfig } from "next";

const ngrokOrigin = process.env.NGROK_ALLOWED_ORIGIN;

const nextConfig: NextConfig = {
  serverExternalPackages: ["cheerio"],
  allowedDevOrigins: [
    "regretful-goliardic-rocco.ngrok-free.dev",
    ...(ngrokOrigin ? [ngrokOrigin] : []),
  ],
};

export default nextConfig;
