import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import {ManualChunkMeta} from 'rollup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueI18nPlugin({compositionOnly: false})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
    },
  },
  build: {
    manifest: true,
    emptyOutDir: false,
    chunkSizeWarningLimit: 10_000_000,
    rollupOptions: {
      input: ['./src/main.ts', './index.html'],
      output: {
        manualChunks: (id: string, meta: ManualChunkMeta) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return 'main';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern', //needed because bootstrap still uses legacy-js-api https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
        quietDeps: true //needed because bootstrap still uses @import instead of @use; see https://sass-lang.com/blog/import-is-deprecated/
      }
    }
  },
  clearScreen: false,
  server: {
    proxy: {//for dev
      '^/api/.*$': {
        target: 'http://localhost:5172',
        changeOrigin: true,
      },
    },
  },
});
