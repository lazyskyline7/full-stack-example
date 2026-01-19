import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {
    ...Object.fromEntries(
      Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_') || key === 'NODE_ENV')
    ),
    PUBLIC_URL: env.PUBLIC_URL || '',
  };

  return {
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    resolve: {
      alias: {
        ...nodePolyfills({ globals: { Buffer: true, global: true, process: true } }).aliases,
      },
    },
    server: {
      port: 3000,
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
    build: {
      outDir: 'build',
      rollupOptions: {
        external: [],
        output: {
          globals: {},
        },
      },
    },
    define: {
      'process.env': JSON.stringify(processEnv),
      'global': 'globalThis',
    },
    envPrefix: 'REACT_APP_',
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
  };
});
