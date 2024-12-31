// backend/src/index.ts
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { existsSync } from 'node:fs';

const isDev = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;
const DIST_PATH = '../frontend/dist';

const app = new Elysia()
  .use(cors())
  // API Routes first
  .get("/api/date-nights", () => {
    try {
      return Bun.file("data/date-nights.json").json();
    } catch (error) {
      // For development, try the frontend's public directory
      return Bun.file("../frontend/public/date-nights.json").json();
    }
  })
  .get("/api/date-ideas", () => {
    try {
      return Bun.file("data/date-ideas.json").json();
    } catch (error) {
      // For development, try the frontend's public directory
      return Bun.file("../frontend/public/date-ideas.json").json();
    }
  });

// In production, handle static files and SPA routing
if (!isDev && existsSync(DIST_PATH)) {
  console.log('📦 Serving static files from:', DIST_PATH);
  
  // Serve specific static files and assets
  app.get('/assets/*', ({ request }) => {
    const filePath = request.url.split('/assets/')[1];
    return Bun.file(`${DIST_PATH}/assets/${filePath}`);
  });
  
  // Serve other static files from the root
  app.get('/vite.svg', () => Bun.file(`${DIST_PATH}/vite.svg`));
  app.get('/favicon.ico', () => Bun.file(`${DIST_PATH}/favicon.ico`));
  
  // SPA catch-all - must come last
  app.get('*', ({ headers }) => {
    // Don't serve index.html for API routes
    if (headers.accept?.includes('application/json')) {
      return new Response('Not Found', { status: 404 });
    }
    return Bun.file(`${DIST_PATH}/index.html`);
  });
} else if (!isDev) {
  console.log('⚠️  No static files found. Running in API-only mode.');
}

app.listen(PORT, () => {
  console.log(`🦊 Server is running at http://localhost:${PORT}`);
  console.log(`Mode: ${isDev ? 'development' : 'production'}`);
});