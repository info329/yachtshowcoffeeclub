/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "app.onshoreroasters.com" }],
  },
  async redirects() {
    return [
      { source: "/cart", destination: "/coffee", permanent: false },
      { source: "/shop", destination: "/coffee", permanent: false },
      { source: "/onshore-roasters", destination: "/coffee", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
