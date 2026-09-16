import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vueFacingDecoratorHmr from 'vite-plugin-vue-facing-decorator-hmr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueI18nPlugin({compositionOnly: false}), vueFacingDecoratorHmr()],
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
    rolldownOptions: {
      input: ['./src/main.ts', './index.html'],
      output: {
        codeSplitting: {
          groups: [
            {
              test: () => true,
              name: 'main',
            },
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, //needed because bootstrap still uses @import instead of @use; see https://sass-lang.com/blog/import-is-deprecated/
      },
    },
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
