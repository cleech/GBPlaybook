import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import {nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    nodePolyfills({
	    globals: {
		    global: true,
	    },
	    protocolImports: false,
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
});
