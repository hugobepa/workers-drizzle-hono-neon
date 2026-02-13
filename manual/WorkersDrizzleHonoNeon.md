- [docDrizzle](https://orm.drizzle.team/docs/overview)
- [bunDrizzleOficial](https://bun.com/docs/guides/ecosystem/drizzle)
- [Cloudflare Workers, Drizzle ORM, Hono & Neon 19m](https://www.youtube.com/watch?v=YNtwaUVtvh0)
- [mas completo con seed](https://bun.com/docs/guides/ecosystem/neon-drizzle) 
- [githubVideo](https://github.com/neondatabase/cloudflare-drizzle-neon)
C:\Users\User\Documents\programacion2025\librerias\drizzle
C:\Users\User\Documents\programacion2025\InstrucionesBasicasProgramar2025\manual_ejemplos
workers-drizzle-hono-neon


# WorkersDrizzleHonoNeon

## creacion config proyecto 

### cloudflare y hono

0. creacion proyecto,T:  bun create cloudflare
	- workers-drizzle-hono-neon/worker "hello"/worker only/Typerscript/bun
	- Change directories: cd workers-drizzle-hono-neon
    - Deploy: bun run deploy
1. creamos 3 terminales con `+` y utilizamos para probar,T: bun run dev
	-  [ERROR] Invalid target "es2024" in "--target=es2024"
	  - `tsconfig.json` cambiar `es2024` x `ES2022` en `"target", "lib","module"`
	  - Causa: wrangler usa una versión empotrada de esbuild (v0.17.19) que no reconoce es2024, por eso aparece el error aunque tu tsconfig.json esté en ES2022.
	  - cambiar fecha en `wrangler.jsonc`:  `"compatibility_date": "2024-01-01",`
	  - comaprobar version: 
	  `node -e "console.log(require('./node_modules/wrangler/node_modules/esbuild/package.json').version)"`
		- version antigua 0.17.19
	  - solucion: 
	     - add `package.json`: `"overrides": {"wrangler>esbuild": "0.27.3"}`
		 - opcion bash :
			- eliminar bun y modulos,T: rm -rf node_modules bun.lock
			- instalar bun,T: bun install
	     -opcion powershell:
			- Remove-Item -Recurse -Force node_modules
			- Remove-Item -Force bun.lockb
			- bun install
		- comprobar version: 
		`node -e "console.log(require('./node_modules/wrangler/node_modules/esbuild/package.json').version)"`	
			- version  buena `Node.js v24.13.0`
		- probar cambios: `bun run dev  o bun run start`
2. instalamos HONO,T: bun install hono
3. modificamos `src\index.ts`:
````
import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	c.env.DATABASE_URL;
	return c.json({ message: 'Hello, World!' });
});

export default app;
````
4. comprobar intalacion Hono,T1: bun run dev 
     -T2: curl http://127.0.0.1:8787
	 
### provision postgres neon 

0. web https://neon.com/: dashboard
	- create project: 
		- project name: workers-drizzle-hono-neon
		- postgrest version: 17
		- aws / aws - frankfurt
		- create project
		- connect your app single command: npx neonctl@latest init
		- copiamos connection string: 
		`psql 'postgresql://xxxx:npg_xxxx@ep-xxxxx-feather-xxx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'`
		
### EV Cloudflare Workers

0. creamos VE `.env` y add `.gitignore` y creamos `.env.example`: 
   ````
     #https://neon.com/
	DATABASE_URL=postgresql://xxx:npg_xxxx@ep-xxxxx-feather-xxxx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ````
1. comprobamos la VE: bun run dev  
  - `Your Worker following bindings: ... env.DATABASE_URL ("(hidden)")      Environment Variable      local`

## drizzle

### config & install drizzle

[neon-drizzle](https://bun.com/docs/guides/ecosystem/neon-drizzle)
[neon-servless-postgrest](https://bun.com/docs/guides/ecosystem/neon-serverless-postgres)
[how-to-migrate-to-0210](https://orm.drizzle.team/docs/kit-overview#how-to-migrate-to-0210)

0. install drizzle,T: bun add drizzle-orm @neondatabase/serverless
					- bun add -D drizzle-kit dotenv tsx

1. creamos esquemas DB `src\db\schema.ts`:

````
import { pgTable, serial, text, doublePrecision } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  price: doublePrecision('price'),
});
````
2. creamos `drizzle.config.ts`:

````
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
});
````
3. creamos la migracion,T: bunx drizzle-kit generate
	- `drizzle\0000_magical_power_man.sql`
4. install paquete,T: bun add @electric-sql/pglite

5. modificamos `drizzle.config.ts`:
 ````
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	dialect: 'postgresql',
	schema: './src/db/schema.ts',

	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
	},

	extensionsFilters: ['postgis'],
	schemaFilter: 'public',
	tablesFilter: '*',

	introspect: { casing: 'camel' },

	migrations: {
		prefix: 'timestamp',
		table: '__drizzle_migrations__',
		schema: 'public',
	},

	breakpoints: true,
	strict: true,
	verbose: true,
});

 ````
6. OPCIONAL exportamos la VE,T:
 
- powershell: `$env:DATABASE_URL="postgresql://xxxx:npg_xxx@ep-xxxxx-feather-xxxx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" `
- bash:
 `export DATABASE_URL="postgresql://usuario:pass@host:port/dbname?sslmode=require"`
 
 
7. subimos a BD:
     - opcion 1,T: bunx drizzle-kit migrate
	 - opcion 2,T: bunx drizzle-kit push 
	 - opcion 3,T: bunx drizzle-kit push --config=drizzle-dev.drizzle.config
[13 min](https://www.youtube.com/watch?v=YNtwaUVtvh0)
[neon](https://neon.com/)
[githubVideo](https://github.com/neondatabase/cloudflare-drizzle-neon/blob/main/src/db/schema.ts)	 
0. OPCIONAL, ver DB browse: bunx drizzle-kit studio



