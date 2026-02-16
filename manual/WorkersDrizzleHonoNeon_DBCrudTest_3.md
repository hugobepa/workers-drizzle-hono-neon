- [githubEjemploMio](https://github.com/hugobepa/workers-drizzle-hono-neon)
- [Get Started With Drizzle ORM 32m](https://www.youtube.com/watch?v=Eljdg5_EgOI&list=PLY2YxI0RTBs--4Gh71fhCfkKRj-MF19X9)
- [githubFinal](https://github.com/cdbrw/drizzle-orm-demo)
- [docDrizzle](https://orm.drizzle.team/docs/overview)
- [bunDrizzleOficial](https://bun.com/docs/guides/ecosystem/drizzle)
- [neon](https://neon.com/)
- [webCloudflare](https://www.cloudflare.com/es-es/)
- [drizzleCrud](https://www.saas-js.com/docs/drizzle-crud)
- [Hono, Drizzle, Neon, and Cloudflare](https://neon.com/guides/honc)
- [instalarTestearRestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Automatic CRUD endpoints with automatic creation of zod validators](https://github.com/orgs/honojs/discussions/3076)
- C:\Users\User\Documents\programacion2025\librerias\drizzle
- C:\Users\User\Documents\programacion2025\InstrucionesBasicasProgramar2025\manual_ejemplos
- workers-drizzle-hono-neon

# WorkersDrizzleHonoNeonDBRelationSeed

## previsulizacion BD

0. comprobar la gestion, abrir studio,T: bunx drizzle-kit studio
		- https://local.drizzle.studio/
		
1. comprobar intalacion localmente Hono,T1: bun run dev 
     -T2: curl http://127.0.0.1:8787

2. creamos funcions CRUD en `src\index.ts`:

````
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neon } from '@neondatabase/serverless';
import { insertPostSchema, NewPost, products, posts } from './db/schema';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	//const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(c.env.DATABASE_URL);
	const allProducts = await db.select().from(products);
	//const allPosts = await db.select().from(posts);
	const allPosts = await db.select().from(posts);
	return c.json({ message: 'Hello, World!', products: allProducts, posts: allPosts });
});

// Get all posts
//curl http://127.0.0.1:8787/posts
app.get('/posts', async (c) => {
	const db = drizzle(c.env.DATABASE_URL);
	const all = await db.select().from(posts);

	if (!all || all.length === 0) {
		return c.json({ message: 'No posts found' }, 200);
	}

	return c.json(all);
});

// Get a post by id
//curl http://127.0.0.1:8787/post/0d03d193-1140-41c7-aefe-55beefd3734c
app.get('/post/:id', async (c) => {
	try {
		const db = drizzle(c.env.DATABASE_URL);
		const id = c.req.param('id');

		const results = await db.select().from(posts).where(eq(posts.id, id));
		const post = results[0];

		if (!post) {
			return c.json({ message: 'Post with that id not found' }, 404);
		}

		return c.json(post);
	} catch (e) {
		console.error(e);
		return c.json({ message: 'Error encountered' }, 500);
	}
});

// Create post
//Invoke-RestMethod -Method Post -Uri 'http://localhost:8787/post' -ContentType 'application/json' -Body '{"title":"New Post","content":"This is a new post","authorId":"9c858901-8a57-4791-81fe-4c455b099bc9","authorName":"John Doe"}'
//curl http://127.0.0.1:8787/posts
app.post('/post', async (c) => {
	try {
		const db = drizzle(c.env.DATABASE_URL);
		const { content, title, authorId, authorName } = await c.req.json();
		const newPost = insertPostSchema.parse({ title, content, authorId, authorName });
		const result = await db.insert(posts).values(newPost).returning();

		if (!result || result.length < 1) {
			return c.json({ message: 'Post could not be created.' }, 500);
		}

		return c.json(result);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Error encountered' }, 500);
	}
});

// Update Post
//curl -X PUT http://localhost:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99 \  -H "Content-Type: application/json" \  -d '{"title":"Updated Title","content":"Updated Content"}'
//curl http://127.0.0.1:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99
app.put('/post/:id', async (c) => {
	try {
		const db = drizzle(c.env.DATABASE_URL);
		const postId = c.req.param('id');
		const { title, content } = await c.req.json();
		const updatedPost = await db
			.update(posts)
			.set({
				title,
				content,
			})
			.where(eq(posts.id, postId))
			.returning();

		if (!updatedPost || updatedPost.length < 1) {
			return c.json({ message: 'Post could not be found.' }, 404);
		}
		return c.json(updatedPost);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Error encountered' }, 500);
	}
});

// Delete Post
//curl -X DELETE http://localhost:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99
//curl http://127.0.0.1:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99  -- {"message":"Post with that id not found"}
app.delete('/post/:id', async (c) => {
	try {
		const db = drizzle(c.env.DATABASE_URL);
		const postId = c.req.param('id');
		const deletedPost = await db.delete(posts).where(eq(posts.id, postId)).returning();

		if (!deletedPost || deletedPost.length < 1) {
			return c.json({ message: 'Post could not be found.' }, 404);
		}

		return c.json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Error encountered' }, 500);
	}
});

export default app;

````

2. tester una a una:
	- Get all posts: curl http://127.0.0.1:8787/posts
	- Get a post by id: http://127.0.0.1:8787/post/0d03d193-1140-41c7-aefe-55beefd3734c
	- Create post: Invoke-RestMethod -Method Post -Uri 'http://localhost:8787/post' -ContentType 'application/json' -Body '{"title":"New Post","content":"This is a new post","authorId":"9c858901-8a57-4791-81fe-4c455b099bc9","authorName":"John Doe"}'
		- comprobar curl http://127.0.0.1:8787/posts
	- Update Post: curl -X PUT http://localhost:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99 \  -H "Content-Type: application/json" \  -d '{"title":"Updated Title","content":"Updated Content"}'
		- comprobar: curl http://127.0.0.1:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99
	- Delete Post: curl -X DELETE http://localhost:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99
		- comprobar: curl http://127.0.0.1:8787/post/7f0e5548-ec1c-4184-88a3-6688963b7a99  -- {"message":"Post with that id not found"}
		
3. testeo general: 
- [instalarTestearRestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
0. probar update: curl.exe -v -X PATCH "http://localhost:8787/posts/8b1c6102-0bc5-483b-adc9-63cfc01d51ea" -H "Content-Type: application/json" -d '{"title":"Like the video","content":"helps the channel"}'
0. creamos archivo test `tester.http`:

````
GET http://localhost:8787/posts

###

GET http://localhost:8787/post/680235a5-6544-46e2-8490-f8130468181a

###

POST http://localhost:8787/post
Content-Type: application/json

{
  "title":"New Post Test",
  "content":"This is a new post Test",
  "authorId":"9c858901-8a57-4791-81fe-4c455b099bc9",
  "authorName":"John Doe"
}

###
//PUT
PATCH http://localhost:8787/post/680235a5-6544-46e2-8490-f8130468181a
Content-Type: application/json

{
  "title":"Updated Title Test",
   "content":"Updated Content Test"
}

###

DELETE http://localhost:8787/post/680235a5-6544-46e2-8490-f8130468181a


###

# ###

# DELETE http://localhost:8787/posts
# Content-Type: application/json

# {
  # "id": "<id>"
# }

# ###



# POST http://localhost:8787/users
# Content-Type: application/json

# {
  # "name": "CodeBrew"
# }

# ###

# GET http://localhost:8787/users/<id>/posts

###
````		
		
		
		
### subir cambios
1. subimos cambios a github desde VS x commit y async	 
2. webCloudflare -- dashboard -- proyect -- settings -- build -- branchControl (cambiar rama)
3. subimos cambios a github desde VS x commit y async
4. visualizamos en web cambios:  https://workers-drizzle-hono-neon.hugo-ber-par.workers.dev/




