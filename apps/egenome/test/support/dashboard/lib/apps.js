// Switching apps in the dashboard's App filter (and the logo and name at the top left). Several test projects (eGenome.ai, Instagram...) each keep their
// own dashboard in their own reports/ folder; a shared list (Test Dashboard/apps.json, next to the projects) names them:
//   { "apps": [ { "id": "egenome", "name": "eGenome.ai", "project": "../eGenome.ai", "color": "#6d4bd8" },
//               { "id": "instagram", "name": "Instagram", "project": "../Instagram", "badge": "IG" } ] }
// ("project" is relative to apps.json; "reports" defaults to "reports"). The logo at the top left of each page is the
// app's "logo" (an image file, relative to apps.json) or else a badge: "badge" text (default: the name's first letter)
// on "color"; "title" replaces the page title. Each build writes reports/data/apps.js with a
// link to every app's page, relative to this page (so it works straight from disk), and each app's latest result.
import fs from 'node:fs';
import path from 'node:path';

const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const same = (a, b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
/** Relative link between two folders on disk, as a URL path (spaces and # encoded). */
const href = (fromDir, file) => path.relative(fromDir, file).split(path.sep).map(encodeURIComponent).join('/');

/** The newest run of an app, from its dashboard data (reports/data/index.js), or null. */
function latestOf(reportsDir) {
  try {
    const w = {};
    new Function('window', fs.readFileSync(path.join(reportsDir, 'data', 'index.js'), 'utf8'))(w);
    const r = w.DASH_INDEX?.runs?.[0];
    return r ? { run: r.id, status: r.summary?.status || null, failed: r.summary?.failed ?? null, total: r.summary?.total ?? null } : null;
  } catch { return null; }
}

/** The apps listed in apps.json, with their reports folders; [] when there is no list. */
export function readApps(appsFile) {
  const list = readJson(appsFile);
  if (!list || !Array.isArray(list.apps)) return [];
  const base = path.dirname(appsFile);
  return list.apps.filter((a) => a && a.id && a.name && a.project).map((a) => ({
    id: String(a.id), name: String(a.name), reportsDir: path.resolve(base, a.project, a.reports || 'reports'),
    title: a.title ? String(a.title) : null, color: a.color ? String(a.color) : null, badge: a.badge ? String(a.badge).slice(0, 3) : null,
    logoFile: a.logo ? path.resolve(base, a.logo) : null,
  }));
}

/** Write reports/data/apps.js for the page in `reportsDir`. Returns what it wrote (null when there is no app list). */
export function writeAppsData(reportsDir, appsFile) {
  const apps = readApps(appsFile);
  const file = path.join(reportsDir, 'data', 'apps.js');
  if (!apps.length) { try { fs.rmSync(file, { force: true }); } catch {} return null; }
  const current = apps.find((a) => same(a.reportsDir, reportsDir));
  const data = {
    current: current ? current.id : null,
    home: href(reportsDir, path.join(path.dirname(appsFile), 'index.html')),
    apps: apps.map((a) => ({
      id: a.id, name: a.name, href: href(reportsDir, path.join(a.reportsDir, 'index.html')), ready: fs.existsSync(path.join(a.reportsDir, 'index.html')), latest: latestOf(a.reportsDir),
      title: a.title, color: a.color, badge: a.badge,
      logo: a.logoFile && fs.existsSync(a.logoFile) ? href(reportsDir, a.logoFile) : null,
    })),
  };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `window.DASH_APPS=${JSON.stringify(data)};\n`);
  return data;
}
