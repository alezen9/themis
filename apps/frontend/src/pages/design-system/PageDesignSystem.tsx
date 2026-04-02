import { Button } from "../../components/Button";
import { NumberInput } from "../../components/inputs/NumberInput";
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

      <section className="max-w-sm">
        <h2 className="mb-4 text-lg font-semibold">NumberInput</h2>
        <div className="space-y-4">
          <NumberInput
            label="Length"
            min={0}
            step="0.1"
            defaultValue={42.5}
            placeholder="0.0"
          />
          <NumberInput
            label="Load"
            defaultValue={125}
            error="Load must be greater than 0"
          />
          <NumberInput label="Disabled" defaultValue={12} disabled />
        </div>
      </section>
    </main>
  );
}
