-[Get Started With Drizzle ORM 32m](https://www.youtube.com/watch?v=Eljdg5_EgOI&list=PLY2YxI0RTBs--4Gh71fhCfkKRj-MF19X9)
- [githubInicial](https://github.com/cdbrw/express-postgress-base)
- [githubFinal](https://github.com/cdbrw/drizzle-orm-demo)
- [docDrizzle](https://orm.drizzle.team/docs/overview)
- [bunDrizzleOficial](https://bun.com/docs/guides/ecosystem/drizzle)
- [mas completo con seed](https://bun.com/docs/guides/ecosystem/neon-drizzle) 
- (seedDrizzle)[https://orm.drizzle.team/docs/seed-overview#basic-usage]
- (seedDrizzleOptional)[https://orm.drizzle.team/docs/guides/seeding-using-with-option]
- (solucionCaseraSeed)[https://github.com/drizzle-team/drizzle-orm/discussions/3906#discussioncomment-13908792]
- [neon](https://neon.com/)
- [webCloudflare](https://www.cloudflare.com/es-es/)
- C:\Users\User\Documents\programacion2025\librerias\drizzle
- C:\Users\User\Documents\programacion2025\InstrucionesBasicasProgramar2025\manual_ejemplos
- workers-drizzle-hono-neon
- starterDrizzle L145


# WorkersDrizzleHonoNeonDBRelationSeed

## seed

### OPCIONAL eliminar Tablas
- (solucionCaseraSeed)[https://github.com/drizzle-team/drizzle-orm/discussions/3906#discussioncomment-13908792]
0. crear un plantilla vacia `src\db\empty-schema.ts`: ``
1. crear archivo config para eliminar tablas de BD  `drizzle-empty.config.ts`:
````
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/empty-schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
});
```` 
2. vaciar BD,T: bun  drizzle-kit push --force --config drizzle-empty.config.ts
3. visionamos los cambios,T: bunx drizzle-kit studio
	- https://local.drizzle.studio
4. creamos la BD con tablas: bun drizzle-kit push
### creamos seed (no cal primer paso eliminar tabla)
0. creamos la BD con tablas: bun drizzle-kit push
1. creamos la semilla `src\db\seed.ts`:

````
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';
import { products } from './schema';

const sql = neon(process.env.DATABASE_URL ?? '');

const db = drizzle(sql, {
	schema: {
		products,
	},
});

const main = async () => {
	try {
		console.log('Seeding database');
		// Delete all data
		await db.delete(products);

		await db.insert(products).values([
			{ name: 'Product A', description: 'this is description for Product A.', price: 10.99 },
			{ name: 'Product B', description: 'this is description for Product B.', price: 20.99 },
			{ name: 'Product C', description: 'this is description for Product C.', price: 30.99 },
			{ name: 'Product D', description: 'this is description for Product D.', price: 40.99 },
			{ name: 'Product E', description: 'this is description for Product E.', price: 50.99 },
			{ name: 'Product F', description: 'this is description for Product F.', price: 60.99 },
			{ name: 'Product G', description: 'this is description for Product G.', price: 70.99 },
			{ name: 'Product H', description: 'this is description for Product H.', price: 80.99 },
			{ name: 'Product I', description: 'this is description for Product I.', price: 90.99 },
			{ name: 'Product J', description: 'this is description for Product J.', price: 100.99 },
		]);

		console.log('Database seeded successfully');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};
main();

````

2. add comando `package.json`:

````
	"scripts": {
		...
		"db:seed": "tsx ./src/db/seed.ts"
````
3. insertar datos en DB,T: bun run db:seed
4. comprobar insercion,T: visionamos los cambios,T: bunx drizzle-kit studio
	- https://local.drizzle.studio
	
--- Mañana mas

### seed  prueba drizzle

[neon-drizzle](https://bun.com/docs/guides/ecosystem/neon-drizzle)
[neon-servless-postgrest](https://bun.com/docs/guides/ecosystem/neon-serverless-postgres)
[how-to-migrate-to-0210](https://orm.drizzle.team/docs/kit-overview#how-to-migrate-to-0210)
- starterDrizzle L145

0. 

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
	 
### test DB
- [neon](https://neon.com/)
0. insertar prueba, Neon web -- project -- sql editor -- RUN 
`````
INSERT INTO products (name,price,description) VALUES
('Product A',10.99,'this is description for Product A.'),
('Product B',20.99,'this is description for Product B.'),
('Product C',30.99,'this is description for Product C.'),
('Product D',40.99,'this is description for Product D.'),
('Product E',50.99,'this is description for Product E.'),
('Product F',20.99,'this is description for Product F.'),
('Product G',30.99,'this is description for Product G.');
`````
1. comprobar en Neon web -- project -- tables
1. OPCIONAL, ver DB browse: bunx drizzle-kit studio	 
2. modificar `src\index.ts`:
	- configuramos VE `const db = drizzle(c.env.DATABASE_URL);`
	- mostramos todos los productos `	const allProducts = await db.select().from(products);`
````
import { drizzle } from 'drizzle-orm/neon-serverless';
import { products } from './db/schema';
import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	c.env.DATABASE_URL;
	const db = drizzle(c.env.DATABASE_URL);
	const allProducts = await db.select().from(products);
	return c.json({ message: 'Hello, World!', products: allProducts });
});

export default app;

````
3. comprobar intalacion Hono,T1: bun run dev 
     -T2: curl http://127.0.0.1:8787	 

### deploy worker production

0. logeamos,T: bun wrangler login
	- `Successfully logged in.`
1. deploy,T: bun run deploy
	- https://workers-drizzle-hono-neon.hugo-ber-par.workers.dev/
		- Internal error server
		- [webCloudflare](https://www.cloudflare.com/es-es/) 
			- dashboard -- project -- settings -- variables and secret -- add
			 - secret -- DATABASE_URL -- `postgresql://xxx:xxxx@ep-xxxx-feather-xxx-pooler...` -- add variable
			 - deploy   
			 `Update your wrangler config file with changes to keep your local development environment in sync`
			 - Project, add variables no datos sensisbles `wrangler.josnc`:
			 ````
			 "vars": {
		"MY_VAR": "VALUE_VARIABLE",
				},
			 ````
			 - Project VE sensibles,T: bun wrangler secret put DATABASE_URL
				- Enter a secret value: `postgresql://xxx:xxxx@ep-xxxx-feather-xxx-pooler...`
					- ✨ Success! Uploaded secret DATABASE_URL
					- se guarda nube como secreta
    - Project -- github - commit (poner algo en commit) - asyn change 
	- [webCloudflare](https://www.cloudflare.com/es-es/) 
		- dashboard -- project -- settings -- build --  git repository -- connect
			- escoger nombreCuenta -- repository -- rama -- connect
			   - variable and secret `+`:
					- name : DATABASE_URL
					- value: postgresql://xxx:xxxx@ep-xxxx-feather-xxx-pooler...
					- encrypt
					- save

[neon](https://neon.com/)
	 




idea You can simply push an empty schema, it works for me. Have an empty config:

// drizzle-empty.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/empty-schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});

Then with ./src/empty-schema.ts being empty run:

    npx drizzle-kit push --force --config drizzle-empty.config.ts (drop the db)
    npx drizzle-kit push (will push your usual config)
