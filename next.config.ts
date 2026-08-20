import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  // Если сборка на GitHub Actions — используем подпапку, на Vercel — корень сайта
  basePath: isGithubActions ? '/sharmino_real_estate' : '',
  assetPrefix: isGithubActions ? '/sharmino_real_estate/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;