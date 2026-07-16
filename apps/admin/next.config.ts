import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sportsphere/ui", "@sportsphere/database", "@sportsphere/config", "@sportsphere/utils"],
};

export default nextConfig;
