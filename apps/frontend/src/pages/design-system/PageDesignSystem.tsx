import { DesignSystemSidebar } from "./components/DesignSystemSidebar";
import { getDesignSystemStory } from "./stories/designSystemStories";

type Props = { componentId?: string };

export const PageDesignSystem = (props: Props) => {
  const { componentId } = props;
  const story = getDesignSystemStory(componentId);
  const Story = story.component;

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-950">
      <div className="mx-auto grid min-h-dvh max-w-[1600px] gap-8 px-4 py-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-6">
        <DesignSystemSidebar selectedStoryId={story.id} />

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.35)] sm:p-8">
          <header className="mb-8 grid gap-2 border-b border-slate-100 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              component
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              {story.label}
            </h1>
            <p className="max-w-2xl text-sm text-slate-500">
              {story.description}
            </p>
          </header>

          <Story />
        </section>
      </div>
    </main>
  );
};
