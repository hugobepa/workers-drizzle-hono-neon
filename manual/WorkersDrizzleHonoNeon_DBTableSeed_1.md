- [githubEjemploMio](https://github.com/hugobepa/workers-drizzle-hono-neon)
- [Get Started With Drizzle ORM 32m](https://www.youtube.com/watch?v=Eljdg5_EgOI&list=PLY2YxI0RTBs--4Gh71fhCfkKRj-MF19X9)

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
1. crear archivo config para eliminar tablas de BD `drizzle-empty.config.ts`:

```
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/empty-schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
});
```

2. vaciar BD,T: bun drizzle-kit push --force --config drizzle-empty.config.ts
3. visionamos los cambios,T: bunx drizzle-kit studio
   - https://local.drizzle.studio
4. creamos la BD con tablas: bun drizzle-kit push

### creamos seed (no cal primer paso eliminar tabla)

0. creamos la BD con tablas: bun drizzle-kit push
1. creamos la semilla `src\db\seed.ts`:

```
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

```

2. add comando `package.json`:

```
	"scripts": {
		...
		"db:seed": "tsx ./src/db/seed.ts"
```

3. insertar datos en DB,T: bun run db:seed
4. comprobar insercion,T: visionamos los cambios,T: bunx drizzle-kit studio
   - https://local.drizzle.studio

--- Mañana mas
