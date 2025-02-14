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
<<<<<<< HEAD
=======

  // Fonction rewrites à placer à l'intérieur de nextConfig
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_SERVER_URL + '/api/:path*',
      },
    ];
  },

>>>>>>> dev-frontend
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
<<<<<<< HEAD
=======

>>>>>>> dev-frontend
  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
};

export default nextConfig;
