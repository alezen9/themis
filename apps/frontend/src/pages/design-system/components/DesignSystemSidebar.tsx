import { Link } from "@tanstack/react-router";
import { designSystemStories } from "../stories/designSystemStories";

type Props = { selectedStoryId: string };

export const DesignSystemSidebar = (props: Props) => {
  const { selectedStoryId } = props;

  return (
    <aside className="lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.35)]">
        <div className="mb-4 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            design system
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">
            Components
          </h2>
        </div>

        <nav className="grid gap-1">
          {designSystemStories.map((story) => {
            const isActive = story.id === selectedStoryId;

            return (
              <Link
                key={story.id}
                to="/design-system"
                search={{ component: story.id }}
                className={
                  isActive
                    ? "rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-medium text-white"
                    : "rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                }
              >
                {story.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
