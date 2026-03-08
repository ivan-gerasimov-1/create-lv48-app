import { Button } from './components/ui/button';

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
      <h1 className="text-3xl font-semibold">{`{{displayName}}`}</h1>
      <p className="text-muted-foreground">React + Vite template with Tailwind and shadcn/ui baseline.</p>
      <Button>{`Open {{projectName}}`}</Button>
    </main>
  );
}
