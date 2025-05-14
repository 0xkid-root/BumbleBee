/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_GAIA_NET_URL: process.env.NEXT_PUBLIC_GAIA_NET_URL,
    NEXT_PUBLIC_GAIA_NET_API_KEY: process.env.NEXT_PUBLIC_GAIA_NET_API_KEY,
    NEXT_PUBLIC_DELEGATION_CONTRACT: process.env.NEXT_PUBLIC_DELEGATION_CONTRACT,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  },
  webpack: (config, { isServer }) => {
    // Handle native module dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
      };
    }

    // Handle problematic native modules
    config.externals = [...(config.externals || []), 
      'classic-level',
      'level',
      'weavedb-sdk',
      'weavedb-base'
    ];

    return config;
  },
  // Disable server components for problematic routes
  experimental: {
    serverComponentsExternalPackages: [
      'classic-level',
      'level',
      'weavedb-sdk',
      'weavedb-base'
    ],
  },
};

module.exports = nextConfig;
