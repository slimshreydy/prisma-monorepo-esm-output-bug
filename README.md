This repo highlights an issue with Prisma where the `prisma.schema` cannot be found in Nextjs apps that share a monorepo with packages that rely on prisma SDKs. I know there's already a few reproduction repos, but there's a few features specific to this one:
- The package's prisma SDK gets generated to a custom location (i.e. `output` is set in `prisma.schema`)
- The package is an ESM module, NOT a commonjs module.
- The workspaces here use `npm`, not `pnpm`.

To reproduce:

- Create a `.env` file and set `DATABASE_URL` to an empty MySQL DB
- Run `npm install --ignore-scripts` (the extra flag is needed as the `package` has a `postinstall` script that will fail unless the script's dependencies are installed)
- Run `npm run build -w package`.
- Run `npm install` (this will run the `postinstall` in the `package` workspace)
- Run `npm run dev -w web` to load the Nextjs server.
- Access `localhost:3000/api/test` via `GET` to see the issue.


This repo adds some of the fixes to the `next.config.mjs` that other issues have mentioned, namely:
- Setting an `outputFileTracingRoot`
- Marking the `package` as a webpack external.
- Adding webpack extension aliases.

This results in the following error, since the `package` (which is in ESM) never gets transpiled into CJS due to it being marked as an external:
```
Error: require() of ES Module /.../prisma-monorepo-esm-output-bug/prisma/dist/index.js from /.../prisma-monorepo-esm-output-bug/web/.next/server/pages/api/test.js not supported.
Instead change the require of index.js in /.../prisma-monorepo-esm-output-bug/web/.next/server/pages/api/test.js to a dynamic import() which is available in all CommonJS modules.
```

If we no longer mark it as a webpack external, we run into the same `prisma.schema` not found error others have seen:
```
Error: ENOENT: no such file or directory, open '/.../prisma-monorepo-esm-output-bug/web/.next/cache/webpack/client-development/schema.prisma'
```
