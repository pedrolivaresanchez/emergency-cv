/** @type {import('next').NextConfig} */

/**
 * We're ignoring ESLint and TypeScript errors during builds to allow deployments in emergency situations.
 * These issues are still caught and reported by our separate code quality GitHub Action,
 * but won't block deployment if urgent changes are needed.
 *
 * @see .github/workflows/code-quality-checks.yml for the quality checks implementation
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
