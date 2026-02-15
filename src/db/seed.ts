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
