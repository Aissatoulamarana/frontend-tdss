const isStaticExport = 'false';

const nextConfig = {
  trailingSlash: true,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },

  // Fonction rewrites à placer à l'intérieur de nextConfig
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://default-api-url.com'; // Fallback URL
    return [
      {
        source: '/api/:path*',
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
};

export default nextConfig;