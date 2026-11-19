// The three fonts, Latin letters only (the page is in English), inlined into the page so it works offline:
//   Sora: headings and the verdict · Inter: text · JetBrains Mono: ids, timings, codes, numbers (tabular)
import inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import sora from '@fontsource-variable/sora/files/sora-latin-wght-normal.woff2?url';
import mono from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';

for (const [family, url] of [['Inter Variable', inter], ['Sora Variable', sora], ['JetBrains Mono Variable', mono]]) {
  const face = new FontFace(family, `url(${url}) format("woff2")`, { weight: '100 900', display: 'swap' });
  document.fonts.add(face);
  face.load().catch(() => {}); // a font that cannot load falls back to the system font
}
