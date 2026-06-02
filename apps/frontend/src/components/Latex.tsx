import { render, type KatexOptions } from "katex";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type SpanProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "dangerouslySetInnerHTML"
>;

type KatexProps = Pick<KatexOptions, "displayMode">;

type OtherProps = { tex: string };

type Props = SpanProps & KatexProps & OtherProps;

export const Latex = (props: Props) => {
  const { tex, displayMode = false, className, ...spanProps } = props;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    render(tex, ref.current, { displayMode, throwOnError: false });
  }, [displayMode, tex]);

  return (
    <span
      {...spanProps}
      ref={ref}
      className={twMerge(
        "flex align-baseline leading-none [&_.katex-display]:my-0 [&_.katex]:text-inherit overflow-x-auto overflow-y-hidden",
        className,
      )}
    />
  );
};

Latex.displayName = "Latex";
