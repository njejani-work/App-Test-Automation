# App test automation

Android app tests for several apps, sharing one toolkit.

```
app-tests/
├─ toolkit/        shared tooling (@apptest/toolkit), one copy for every app
└─ apps/<id>/      one folder per app: its config, page objects, specs, data and settings
```

Install once at this folder's root: `npm install`. Run an app's scripts with `-w`, e.g. `npm run test:smoke -w apps/egenome`.
