/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable Webpack disk caching in dev mode to prevent Windows file locking (-4094) errors
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
