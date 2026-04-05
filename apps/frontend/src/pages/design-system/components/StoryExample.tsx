import { type ReactNode } from "react";

type Props = { title: string; description: string; children: ReactNode };

export const StoryExample = (props: Props) => {
  const { title, description, children } = props;

  return (
    <article className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <header className="grid gap-1">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>
        <p className="text-sm text-slate-500">{description}</p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5">
        {children}
      </div>
    </article>
  );
};
