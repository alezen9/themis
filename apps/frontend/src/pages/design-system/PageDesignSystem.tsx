import { Button } from "../../components/Button";
import { Tabs, Tab } from "../../components/Tabs";

export function PageDesignSystem() {
  return (
    <main className="p-8 h-dvh bg-linear-to-t from-[#bbcfe9] to-[rgba(219,219,219,1)]">
      <h1 className="text-2xl font-bold">Design System</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
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
          <Button iconButton aria-label="Default">
            ×
          </Button>
          <Button variant="outline" iconButton aria-label="Outline">
            ×
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Tabs</h2>
        <Tabs>
          <Tab>First</Tab>
          <Tab>Second</Tab>
          <Tab>Third</Tab>
        </Tabs>
      </section>
    </main>
  );
}
