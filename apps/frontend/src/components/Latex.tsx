import { useMemo, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

import { texToSvg } from "./mathjax";

type SpanProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "dangerouslySetInnerHTML"
>;

type Props = SpanProps & { tex: string; displayMode?: boolean };

export const Latex = (props: Props) => {
  const { tex, displayMode = false, className, ...spanProps } = props;
  const html = useMemo(() => texToSvg(tex, displayMode), [tex, displayMode]);

  return (
    <span
      {...spanProps}
      className={twMerge(
        "[&>svg]:text-[0.75em]",
        displayMode
          ? "flex w-full items-center justify-center-safe overflow-x-auto overflow-y-hidden leading-none"
          : "inline-block align-middle",
        className,
      )}
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
