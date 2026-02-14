import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neon } from '@neondatabase/serverless';
import { products } from './db/schema';
import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	c.env.DATABASE_URL;
	//const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(c.env.DATABASE_URL);
	const allProducts = await db.select().from(products);
	return c.json({ message: 'Hello, World!', products: allProducts });
});

export default app;
