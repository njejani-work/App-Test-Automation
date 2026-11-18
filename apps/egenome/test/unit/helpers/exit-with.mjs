// Used by scripts.test.mjs: exits with the code given, or 0/3 when checking an environment variable.
//   node exit-with.mjs 7            -> exit code 7
//   node exit-with.mjs NAME value   -> 0 when process.env.NAME === value, else 3
const [a, b] = process.argv.slice(2);
process.exit(b === undefined ? Number(a) : process.env[a] === b ? 0 : 3);
