import { IconCloud, IconCube, IconGraph, IconIBeam } from "@components/Icons";
import { Link, useLocation } from "@tanstack/react-router";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const AppSidebar = () => {
  return (
    <aside
      className={twMerge(
        "fixed left-0 top-0 z-auto",
        "flex h-dvh w-84 flex-col",
        "bg-white px-4 py-9 text-slate-950",
        "before:absolute before:content-[' '] before:top-9 before:right-0 before:w-px before:h-[calc(100%-4rem)] before:bg-slate-300",
      )}
    >
      <Logo />

      <Nav>
        <Section>
          <SectionHeader>
            <IconCloud className="w-5" />
            <SectionHeaderLabel> Eurocode 1 · Actions</SectionHeaderLabel>
            <Tag>EC1</Tag>
          </SectionHeader>
          <SubSection>
            <SubSectionItem to="/eurocode/ec1-1-3/snow-loads">
              <SubSectionItemLabel>Snow loads</SubSectionItemLabel>
              <Tag>EC1-1-3</Tag>
            </SubSectionItem>
            <SubSectionItem to="/eurocode/ec1-1-4/wind-actions">
              <SubSectionItemLabel>Wind actions</SubSectionItemLabel>
              <Tag>EC1-1-4</Tag>
            </SubSectionItem>
          </SubSection>
        </Section>

        <Section>
          <SectionHeader>
            <IconCube className="w-5" />
            <SectionHeaderLabel>Eurocode 2 · Concrete</SectionHeaderLabel>
            <Tag>EC2</Tag>
          </SectionHeader>
          <SubSection>
            <SubSectionItem to="/eurocode/ec2-1-1/concrete-members">
              <SubSectionItemLabel>Concrete members</SubSectionItemLabel>
              <Tag>EC2-1-1</Tag>
            </SubSectionItem>
          </SubSection>
        </Section>

        <Section>
          <SectionHeader>
            <IconIBeam className="w-5" />
            <SectionHeaderLabel> Eurocode 3 · Steel</SectionHeaderLabel>
            <Tag>EC3</Tag>
          </SectionHeader>
          <SubSection>
            <SubSectionItem to="/eurocode/ec3-1-1/steel-members">
              <SubSectionItemLabel>Steel members</SubSectionItemLabel>
              <Tag>EC3-1-1</Tag>
            </SubSectionItem>
            <SubSectionItem to="/eurocode/ec3-1-2/fire-design">
              <SubSectionItemLabel>Fire design</SubSectionItemLabel>
              <Tag>EC3-1-2</Tag>
            </SubSectionItem>
            <SubSectionItem to="/eurocode/ec3-1-8/connections">
              <SubSectionItemLabel>Connections</SubSectionItemLabel>
              <Tag>EC3-1-8</Tag>
            </SubSectionItem>
          </SubSection>
        </Section>

        <Section>
          <SectionHeader>
            <IconGraph className="w-5" />
            <SectionHeaderLabel>Workspace</SectionHeaderLabel>
          </SectionHeader>
          <SubSection>
            <SubSectionItem to="/ndg/editor">
              <SubSectionItemLabel>NDG Editor</SubSectionItemLabel>
            </SubSectionItem>
          </SubSection>
        </Section>
      </Nav>
    </aside>
  );
};

const Logo = () => {
  return (
    <div className="flex flex-col pl-3 leading-none text-envy-600">
      <span className="font-fredoka text-4xl ">Böbius</span>
      <span className="mt-2 text-[1.15rem] font-extralight tracking-[0.32em] ">
        Engineering
      </span>
    </div>
  );
};

const Tag = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <span
      className={twMerge(
        "rounded px-2 py-px",
        "font-light text-[10px] text-nowrap",
        "bg-sand-100 text-slate-600",
        "group-data-item-active:bg-sand-900/50",
        "group-data-item-active:text-white",
        "transition-colors",
      )}
    >
      {children}
    </span>
  );
};

const SectionHighlighter = () => {
  return (
    <span
      className={twMerge(
        "h-(--section-height) translate-y-(--section-top)",
        "bg-linear-to-b from-sand-100/50 from-75% to-transparent",
        "absolute top-0 -left-1 w-[calc(100%+0.5rem)] rounded-md transition-transform",
      )}
    />
  );
};

const ItemHighlighter = () => {
  return (
    <span
      className={twMerge(
        "h-(--item-height) translate-y-(--item-top)",
        "bg-sand-900/85",
        "absolute top-0 right-1 w-[calc(100%-2rem)] rounded-md transition-transform",
      )}
    />
  );
};

const Section = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <section className="flex flex-col px-4 py-3 rounded-md z-10">
      {children}
    </section>
  );
};

const SectionHeaderLabel = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <span className="w-full text-slate-950 font-semibold">{children}</span>
  );
};

const SectionHeader = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <header className={twMerge("flex h-9 items-center gap-3 rounded-md")}>
      {children}
    </header>
  );
};

const SubSection = (props: { children: ReactNode }) => {
  const { children } = props;
  return <ul className="ml-6">{children}</ul>;
};

const SubSectionItem = (props: { children: ReactNode; to: string }) => {
  const { children, to } = props;

  return (
    <li>
      <Link
        className={twMerge(
          "h-9 group",
          "flex items-center gap-3 rounded-md",
          "cursor-pointer",
          "text-slate-800",
          "data-item-active:text-white",
          "transition-colors",
        )}
        activeProps={{ "data-item-active": "true" }}
        to={to}
      >
        {children}
      </Link>
    </li>
  );
};

const SubSectionItemLabel = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <span className="font-light w-full text-sm tracking-wide">{children}</span>
  );
};

const Nav = (props: { children: ReactNode }) => {
  const { children } = props;
  const ref = useRef<HTMLElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const navEl = ref.current;
    const navRect = navEl.getBoundingClientRect();

    const activeSection = navEl.querySelector<HTMLElement>(
      "section:has([data-item-active='true'])",
    );

    if (activeSection) {
      const sectionRect = activeSection.getBoundingClientRect();
      const top = sectionRect.top - navRect.top;
      navEl.style.setProperty("--section-top", `${top}px`);
      navEl.style.setProperty("--section-height", `${sectionRect.height}px`);
    }

    const activeItem = navEl.querySelector<HTMLElement>(
      "[data-item-active='true']",
    );
    if (activeItem) {
      const itemRect = activeItem.getBoundingClientRect();
      const top = itemRect.top - navRect.top;
      navEl.style.setProperty("--item-top", `${top}px`);
      navEl.style.setProperty("--item-height", `${itemRect.height}px`);
    }
  }, [pathname]);

  return (
    <nav
      ref={ref}
      aria-label="Application navigation"
      className={twMerge("mt-14 flex flex-col", "relative")}
    >
      <SectionHighlighter />
      <ItemHighlighter />
      {children}
    </nav>
  );
};
