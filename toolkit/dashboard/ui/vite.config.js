// Builds the page into ONE self-contained HTML file (scripts, styles and fonts inlined) so it opens from disk (file://)
// with no server and no network: ../template/next/index.html (becomes ../template/index.html in step 6).
//   npm run dev     the page on http://localhost:5173 with the data of DASH_DATA (default: eGenome's reports/)
//   npm run build   the single file
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, process.env.DASH_DATA || '../../../apps/egenome/reports');

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { '@': path.join(here, 'src') } },
  // dev: data/*.js, runs/ screenshots... are served from the app's reports folder, as the built page reads them
  publicDir: dataDir,
  build: {
    outDir: path.resolve(here, '../template/next'),
    emptyOutDir: true,
    copyPublicDir: false,
    assetsInlineLimit: () => true, // fonts too
    chunkSizeWarningLimit: 2000,
  },
});
