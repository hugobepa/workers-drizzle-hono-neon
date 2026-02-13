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
