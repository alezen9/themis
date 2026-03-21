import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

const tabsRootVariants = cva(
  "relative isolate inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/10 bg-white/75 p-1 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.7)] backdrop-blur-md",
);

const tabVariants = cva(
  "relative z-10 flex-none whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] text-slate-950 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 data-[active=true]:text-white data-[active=true]:hover:text-white",
);

type InternalTabProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  tabId?: string;
  tabRef?: (node: HTMLButtonElement | null) => void;
};

export type TabProps = Omit<InternalTabProps, "isActive" | "tabId" | "tabRef">;

export function Tab({
  children,
  className,
  disabled,
  isActive = false,
  onClick,
  onKeyDown,
  tabId,
  tabRef,
}: InternalTabProps) {
  return (
    <button
      ref={tabRef}
      id={tabId}
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      data-active={isActive ? "true" : "false"}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(tabVariants(), className)}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

type TabElement = ReactElement<InternalTabProps, typeof Tab>;

type TabsProps = {
  children: ReactNode;
  defaultActiveIndex?: number;
  className?: string;
};

function clampIndex(index: number, length: number) {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

type IndicatorStyle = CSSProperties & { opacity: number };

export function Tabs({
  children,
  defaultActiveIndex = 0,
  className,
}: TabsProps) {
  const items = Children.toArray(children).filter(
    (child): child is TabElement =>
      isValidElement<InternalTabProps>(child) && child.type === Tab,
  );

  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(defaultActiveIndex, items.length),
  );
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    opacity: 0,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsId = useId();

  useEffect(() => {
    setActiveIndex((currentIndex) => clampIndex(currentIndex, items.length));
  }, [items.length]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current[activeIndex];

      if (!activeTab) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      setIndicatorStyle({
        width: activeTab.offsetWidth,
        height: activeTab.offsetHeight,
        transform: `translate3d(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px, 0)`,
        opacity: 1,
      });
    };

    updateIndicator();

    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => updateIndicator();
    container.addEventListener("scroll", handleResize, { passive: true });
    window.addEventListener("resize", handleResize);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        container.removeEventListener("scroll", handleResize);
        window.removeEventListener("resize", handleResize);
      };
    }

    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(container);
    tabRefs.current.forEach((tab) => {
      if (tab) observer.observe(tab);
    });

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex, items.length]);

  if (items.length === 0) return null;

  const focusTab = (targetIndex: number) => {
    const nextTab = tabRefs.current[targetIndex];
    if (!nextTab || nextTab.disabled) return;
    nextTab.focus();
    setActiveIndex(targetIndex);
  };

  const moveFocus = (startIndex: number, direction: -1 | 1) => {
    let nextIndex = startIndex;

    for (let step = 0; step < items.length; step += 1) {
      nextIndex = (nextIndex + direction + items.length) % items.length;
      const nextTab = tabRefs.current[nextIndex];
      if (nextTab && !nextTab.disabled) {
        focusTab(nextIndex);
        return;
      }
    }
  };

  const focusEdgeTab = (edge: "start" | "end") => {
    const indices =
      edge === "start"
        ? items.map((_, index) => index)
        : items.map((_, index) => items.length - 1 - index);

    for (const index of indices) {
      const tab = tabRefs.current[index];
      if (tab && !tab.disabled) {
        focusTab(index);
        return;
      }
    }
  };

  return (
    <div className={cn("inline-flex max-w-full", className)}>
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Tabs"
        className={tabsRootVariants()}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-px rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.6))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-full bg-slate-950 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.95)] transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={indicatorStyle}
        />

        {items.map((child, index) =>
          cloneElement(child, {
            isActive: index === activeIndex,
            tabId: `${tabsId}-tab-${index}`,
            tabRef: (node: HTMLButtonElement | null) => {
              tabRefs.current[index] = node;
            },
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              child.props.onClick?.(event);
              if (event.defaultPrevented || child.props.disabled) return;
              setActiveIndex(index);
            },
            onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
              child.props.onKeyDown?.(event);
              if (event.defaultPrevented) return;

              switch (event.key) {
                case "ArrowRight":
                case "ArrowDown":
                  event.preventDefault();
                  moveFocus(index, 1);
                  break;
                case "ArrowLeft":
                case "ArrowUp":
                  event.preventDefault();
                  moveFocus(index, -1);
                  break;
                case "Home":
                  event.preventDefault();
                  focusEdgeTab("start");
                  break;
                case "End":
                  event.preventDefault();
                  focusEdgeTab("end");
                  break;
                default:
                  break;
              }
            },
          }),
        )}
      </div>
    </div>
  );
}
