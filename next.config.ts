import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // basePath активен только при сборке на GitHub Actions
  basePath: isGithubActions ? '/sharmino_real_estate' : '',
  assetPrefix: isGithubActions ? '/sharmino_real_estate/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;