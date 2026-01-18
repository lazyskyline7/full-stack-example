import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Load REACT_APP_ environment variables from .env files (CRA compatibility)
const { publicVars, rawPublicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

export default defineConfig({
  plugins: [
    pluginReact({
      // Support React 16 (Classic JSX runtime)
      swcReactOptions: {
        runtime: 'classic',
      },
    }),
  ],
  source: {
    // Inject env vars into client code (compatible with CRA)
    define: {
      ...publicVars,
      'process.env': JSON.stringify(rawPublicVars),
    },
    entry: {
      index: './src/index.js',
    },
  },
  output: {
    // Output to 'build' folder (same as CRA)
    distPath: {
      root: 'build',
    },
    // Set Public Path
    assetPrefix: process.env.PUBLIC_URL || '/',
  },
  html: {
    // Path to HTML template
    template: './public/index.html',
    // Inject template parameters to support <%= VARIABLE %> in HTML
    templateParameters: {
      ...rawPublicVars,
      PUBLIC_URL: process.env.PUBLIC_URL || '',
    },
  },
  server: {
    // Proxy API requests to backend during development
    proxy: {
      '/users': 'http://localhost:3001',
      '/dishes': 'http://localhost:3001',
      '/promotions': 'http://localhost:3001',
      '/leaders': 'http://localhost:3001',
      '/favorites': 'http://localhost:3001',
      '/comments': 'http://localhost:3001',
      '/imageUpload': 'http://localhost:3001',
    },
  },
});
