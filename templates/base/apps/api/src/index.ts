import { Hono } from 'hono';

const app = new Hono();

app.get('/', (context) => {
  return context.json({
    ok: true,
    service: '{{projectName}}-api',
  });
});

export default app;
