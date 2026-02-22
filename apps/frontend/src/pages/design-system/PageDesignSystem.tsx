import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";

export function PageDesignSystem() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Design System</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">IconButton</h2>
        <div className="flex flex-wrap gap-3">
          <IconButton variant="default" aria-label="Default">
            ×
          </IconButton>
          <IconButton variant="outline" aria-label="Outline">
            ×
          </IconButton>
          <IconButton variant="ghost" aria-label="Ghost">
            ×
          </IconButton>
        </div>
      </section>
    </main>
  );
}
