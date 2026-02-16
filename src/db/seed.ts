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
