- [githubEjemploMio](https://github.com/hugobepa/workers-drizzle-hono-neon)
- [Get Started With Drizzle ORM 32m](https://www.youtube.com/watch?v=Eljdg5_EgOI&list=PLY2YxI0RTBs--4Gh71fhCfkKRj-MF19X9)
- [githubFinal](https://github.com/cdbrw/drizzle-orm-demo)
- [docDrizzle](https://orm.drizzle.team/docs/overview)
- [bunDrizzleOficial](https://bun.com/docs/guides/ecosystem/drizzle)
- [mas completo con seed](https://bun.com/docs/guides/ecosystem/neon-drizzle)
- [solucionCaseraSeed](https://github.com/drizzle-team/drizzle-orm/discussions/3906#discussioncomment-13908792)
- [neon](https://neon.com/)
- [webCloudflare](https://www.cloudflare.com/es-es/)
- C:\Users\User\Documents\programacion2025\librerias\drizzle
- C:\Users\User\Documents\programacion2025\InstrucionesBasicasProgramar2025\manual_ejemplos
- workers-drizzle-hono-neon
- starterDrizzle L145

# WorkersDrizzleHonoNeonDBRelationSeed

## zod

0. install zod drizzle,T: bun add install drizzle-zod

### crear tabla post y seed

1. añadir esquema post `src\db\schema.ts`:

```
import { pgTable, serial, text, doublePrecision, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

...

// tabla posts
export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: varchar('title', { length: 256 }).notNull(),
	content: varchar('content', { length: 256 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertPostSchema = createInsertSchema(posts);

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
```

2. creamos la migracion,T: bunx drizzle-kit generate
   - drizzle\20260216091200_simple_spot.sql
   - add a todos los archivos `drizzle\xxxx.sql` al principio de el: `CREATE SCHEMA IF NOT EXISTS "drizzle";`
3. crea tabla en DB:
   - sino la DB esta vacia: bun drizzle-kit migrate
   - si la DB ya tiene tablas: bun drizzle-kit push
4. comprobar la gestion, abrir studio,T: bunx drizzle-kit studio - https://local.drizzle.studio/
5. modificamos `src\db\seed.ts` para `post`:

- llamamos tabla: `const db = drizzle(sql, { schema: { products, posts: schema.posts,},});`
- eliminamos datos anteriores de tabla: `await db.delete(schema.posts);`
- insertamos nuevos datos:
  `await db.insert(schema.posts).values([{ title: 'Like the video', content: 'helps the channel' },...]);`

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
		posts: schema.posts,
	},
});

const main = async () => {
	try {
		console.log('Seeding database');
		// Delete all data
		await db.delete(products);
		await db.delete(schema.posts);

		await db.insert(products).values([
			{ name: 'Product A', description: 'this is description for Product A.', price: 10.99 },
		...
		]);

		await db.insert(schema.posts).values([
			{ title: 'Like the video', content: 'helps the channel' },
			{ title: 'Subscribe', content: "so you don't miss updates" },
			{ title: 'Great post', content: 'very helpful info' },
			{ title: 'Question', content: 'Can you explain more?' },
			{ title: 'Thanks', content: 'appreciate the tutorial' },
		]);

		console.log('Database seeded successfully');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};
main();

```

6. insertar datos en DB,T: bun run db:seed
7. comprobar insercion,T: visionamos los cambios,T: bunx drizzle-kit studio
   - https://local.drizzle.studio

### crear tabla user, relacions post y seed

0. añadimos tabla user y relaciones `./src/db/schema.ts`:

- creamos tabla user:

```
	export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
});
```

- crearamos funciones para trabajar con la tabla:

```
export const insertUserSchema = createInsertSchema(users);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
```

- creamos campo en `post`: `export const posts = pgTable('posts', { ..., authorId: uuid('authorId').notNull(),`

- creamos de 1 a 1 :

```
export const postsRelations = relations(posts, ({ one }) => ({
 author: one(users, {
   fields: [posts.authorId],
   references: [users.id],
 }),
}));
```

-creamos relacion de muchos a muchos:

```
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

- ARCHIVO:

```
import { relations } from 'drizzle-orm';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('authorId').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  content: varchar('content', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const insertPostSchema = createInsertSchema(posts);

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const insertUserSchema = createInsertSchema(users);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
```

1. creamos la migracion,T: bunx drizzle-kit generate
   - drizzle\20260216102509_rare_natasha_romanoff.sql
   - add a todos los archivos `drizzle\xxxx.sql` al principio de el: `CREATE SCHEMA IF NOT EXISTS "drizzle";`
2. crea tabla en DB:
   - sino la DB esta vacia: bun drizzle-kit migrate
   - si la DB ya tiene tablas: bun drizzle-kit push
3. comprobar la gestion, abrir studio,T: bunx drizzle-kit studio - https://local.drizzle.studio/
   4 . añadimos `user` a `src/db/seed`: - importamos y llamamos DB: `const db = drizzle(sql, {schema: { ...,users: schema.users,},` - eliminaos users de la DB: `await db.delete(schema.users);` - creamos users en tabla: `await db.insert(schema.users).values([{ id: '1-2-3-4-6', name: 'John Doe' },...` - insertamos user en post:
   `
	await db.insert(schema.posts).values([
	{ title: 'Like the video', content: 'helps the channel', authorId: '1-2-3-4-6'},
	...
	`

- ARCHIVO:

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
		posts: schema.posts,
		users: schema.users,
	},
});

const main = async () => {
	try {
		console.log('Seeding database');
		// Delete all data
		await db.delete(products);
		await db.delete(schema.posts);
		await db.delete(schema.users);

		// Insert sample data
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

		await db.insert(schema.users).values([
			{ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'John Doe' },
			{ id: '9c858901-8a57-4791-81fe-4c455b099bc9', name: 'Jane Doe' },
			{ id: '3d813cbb-47fb-32ba-91df-831e1593ac29', name: 'Charlie' },
			{ id: '1c6b1470-9f1b-4a4f-8b82-6c2f3f5b9f2a', name: 'David' },
			{ id: '2c1b8f0e-7a4d-4e2b-9a6f-7d8e9f0b1c2d', name: 'Eve' },
		]);

		await db.insert(schema.posts).values([
			{ title: 'Like the video', content: 'helps the channel', authorId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
			{ title: 'Subscribe', content: "so you don't miss updates", authorId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
			{ title: 'Great post', content: 'very helpful info', authorId: '9c858901-8a57-4791-81fe-4c455b099bc9' },
			{ title: 'Question', content: 'Can you explain more?', authorId: '9c858901-8a57-4791-81fe-4c455b099bc9' },
			{ title: 'Thanks', content: 'appreciate the tutorial', authorId: '9c858901-8a57-4791-81fe-4c455b099bc9' },
		]);

		console.log('Database seeded successfully');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};
main();

```

6. insertar datos en DB,T: bun run db:seed
7. comprobar insercion,T: visionamos los cambios,T: bunx drizzle-kit studio
   - https://local.drizzle.studio

### visualizar en pagina

0. modificar `src\index.ts`:
   - mostramos todos los productos `	const allPosts = await db.select().from(posts);`

```
import { drizzle } from 'drizzle-orm/neon-serverless';
import { products, posts } from './db/schema';
import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	c.env.DATABASE_URL;
	const db = drizzle(c.env.DATABASE_URL);
	const allProducts = await db.select().from(products);
	const allPosts = await db.select().from(posts);
	return c.json({ message: 'Hello, World!', products: allProducts, posts: allPosts });
});

export default app;

```

1. comprobar intalacion localmente Hono,T1: bun run dev
   -T2: curl http://127.0.0.1:8787
2. webCloudflare -- dashboard -- proyect -- settings -- build -- branchControl (cambiar rama)
3. subimos cambios a github desde VS x commit y async
4. visualizamos en web cambios: https://workers-drizzle-hono-neon.hugo-ber-par.workers.dev/

## EXTRA 1

0. modificamos mostrar nombre author `src/db/schema`:

```
// tabla posts
export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	authorId: uuid('authorId').notNull(),
	authorName: varchar('authorName', { length: 256 }).notNull(),
	title: varchar('title', { length: 256 }).notNull(),
	content: varchar('content', { length: 256 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId, posts.authorName],
		references: [users.id, users.name],
	}),
}));

```

1. creamos la migracion,T: bunx drizzle-kit generate
   - drizzle\20260216102509_rare_natasha_romanoff.sql
   - add a todos los archivos `drizzle\xxxx.sql` al principio de el: `CREATE SCHEMA IF NOT EXISTS "drizzle";`
2. crea tabla en DB:
   - sino la DB esta vacia: bun drizzle-kit migrate
   - si la DB ya tiene tablas: bun drizzle-kit push
3. comprobar la gestion, abrir studio,T: bunx drizzle-kit studio

4. modificamos `src/db/seed`:
   `{ title: 'Great post', content: 'very helpful info', authorName: 'Jane Doe', authorId: '1-2-3-81fe-4' },`

5. insertar datos en DB,T: bun run db:seed
6. comprobar insercion,T: visionamos los cambios,T: bunx drizzle-kit studio
   - https://local.drizzle.studio

### OPCIONAL NO PROBADO AQUI EJEMPLO CON COMENTARIO EN POST

1. crear archivos de esquema `src/db/schema.ts`:

```
import { relations } from "drizzle-orm";
import { serial, text, timestamp, integer, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
	id: serial("id").primaryKey(),
	postId: integer("post_id").references(() => posts.id),
	userId: integer("user_id").references(() => users.id),
	text: text("text").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	user: one(users, { fields: [posts.userId], references: [users.id] }),
	comments: many(comments),
}));

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
	user: one(users, { fields: [comments.userId], references: [users.id] }),
}));
```

2. generar tablas,T : bunx drizzle-kit generate --dialect postgresql --schema ./src/db/schema.ts --out ./drizzle
   - se crean tablas para migracion `drizzle\0000_numerous_johnny_blaze.sql`
3. migrar tablas: bunx drizzle-kit migrate ./src/db/migrate.ts

4. crear semillas `src\db\seed.ts`:

```
import { comments, posts, users } from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(sql, {
  schema,
});

const main = async () => {
  try {
    console.log("Seeding database");
    // Delete all data
    await db.delete(comments);
    await db.delete(posts);
    await db.delete(users);

    await db.insert(users).values([
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob.smith@example.com",
      },
    ]);

    await db.insert(posts).values([
      {
        id: 1,
        userId: 1,
        title: "Introduction",
        content: "Hello, World! Excited to join this community.",
      },
      {
        id: 2,
        userId: 2,
        title: "Reply",
        content: "Hello, Alice! Welcome to the community!",
      },
      {
        id: 3,
        userId: 1,
        title: "Reply",
        content: "Thanks, Bob! Glad to be here.",
      },
    ]);

    await db.insert(comments).values([
      {
        id: 1,
        text: "Welcome, Alice! Looking forward to your posts.",
        userId: 2,
        postId: 1,
      },
      {
        id: 2,
        text: "Thank you, Bob! Excited to be part of the conversation.",
        userId: 1,
        postId: 2,
      },
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();

```

5. trabjamos con las DB `src/index.ts`:

```
import { Hono } from "hono";
import { db } from "./db";

const PORT = process.env.PORT || 3000;

const app = new Hono();

app.get("/", async (c) => {
	try {
		const data = await db.query.posts.findMany({
			with: {
				comments: true,//author:
				user: true,
			},
		});
		return c.json({
			data,
		});
	} catch (error) {
		return c.json({ error });
	}
});

Bun.serve({
	port: PORT,
	fetch: app.fetch,
});

if (process.env.NODE_ENV === "development") {
	console.log(`Server is running at http://localhost:${PORT}`);
}

```

a
