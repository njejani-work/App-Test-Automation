# App test automation

Android app tests for several apps, sharing one toolkit.

```
app-tests/
├─ toolkit/        shared tooling (@apptest/toolkit), one copy for every app
├─ mcp/            MCP server for AI assistants, one server per app (MCP_APP); see mcp/README.md
└─ apps/<id>/      one folder per app: its config, page objects, specs, data and settings
```

Apps: `apps/egenome` (eGenome.ai), `apps/instagram` (Instagram), `apps/wikipedia` (Wikipedia, built from source into `out/`).

Install once at this folder's root: `npm install`. Run an app's scripts with `-w`, e.g. `npm run test:smoke -w apps/egenome`.
