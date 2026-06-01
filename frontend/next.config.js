/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: `experimental.appDir` is not required for recent Next versions
  // and may produce warnings if used. The App Router is enabled by
  // default in supported Next releases, so we avoid the experimental flag.
};

module.exports = nextConfig;
