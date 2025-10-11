import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import { notBundle } from 'vite-plugin-electron/plugin';
import * as path from 'path';
import pkg from './package.json';

const isDev = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron([
      {
        entry: 'src/index.ts',
        onstart({ startup }) {
          startup();
        },
        vite: {
          build: {
            sourcemap: isDev,
            minify: !isDev,
            outDir: 'dist',
            rollupOptions: {
              external: Object.keys(pkg?.dependencies ?? {}),
            },
          },
          plugins: [
            isDev && notBundle(),
          ].filter(Boolean),
          resolve: { // Resolve for main script
            alias: {
              '@': path.resolve(__dirname, './src'),
              '@assets': path.resolve(__dirname, './assets'),
            },
          },
        },
      },
    ]),
  ],
})