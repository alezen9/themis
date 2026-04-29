import { DEFAULT_LANDING_ROUTE } from "../routeDefaults";

export const APP_BASEPATH = "/themis";

export type ImplementedSidebarPath =
  | typeof DEFAULT_LANDING_ROUTE
  | "/ndg/editor"
  | "/tbd-url/debug/ec3";

type SidebarNavItemBase = {
  code: string;
  indent?: boolean;
  key: string;
  path: string;
  title: string;
};

export type ImplementedSidebarNavItem = SidebarNavItemBase & {
  implemented: true;
  path: ImplementedSidebarPath;
};

export type PlannedSidebarNavItem = SidebarNavItemBase & {
  implemented?: false;
};

export type SidebarNavItem = ImplementedSidebarNavItem | PlannedSidebarNavItem;

export type SidebarNavDirectItem = SidebarNavItem & {
  icon: string;
};

type SidebarNavSectionHeader = {
  code: string;
  icon: string;
  title: string;
};

export type SidebarNavSection = {
  header?: SidebarNavSectionHeader;
  items: readonly SidebarNavItem[];
  key: string;
  matchPrefixes: readonly string[];
};

export type ActiveSidebarTarget = {
  itemKey: string | null;
  sectionKey: string | null;
};

export const SIDEBAR_NAV_SECTIONS: readonly SidebarNavSection[] = [
  {
    key: "ec1-actions",
    header: {
      title: "Eurocode 1 · Actions",
      code: "EC1",
      icon: "☁️",
    },
    matchPrefixes: ["/eurocode/ec1"],
    items: [
      {
        key: "ec1-snow-loads",
        title: "Snow loads",
        code: "EC1-1-3",
        path: "/eurocode/ec1-1-3/snow-loads",
        indent: true,
      },
      {
        key: "ec1-wind-actions",
        title: "Wind actions",
        code: "EC1-1-4",
        path: "/eurocode/ec1-1-4/wind-actions",
        indent: true,
      },
    ],
  },
  {
    key: "ec2-concrete",
    header: {
      title: "Eurocode 2 · Concrete",
      code: "EC2",
      icon: "🧱",
    },
    matchPrefixes: ["/eurocode/ec2"],
    items: [
      {
        key: "ec2-concrete-members",
        title: "Concrete members",
        code: "EC2-1-1",
        path: "/eurocode/ec2-1-1/concrete-members",
        indent: true,
      },
    ],
  },
  {
    key: "ec3-steel",
    header: {
      title: "Eurocode 3 · Steel",
      code: "EC3",
      icon: "🏗️",
    },
    matchPrefixes: ["/eurocode/ec3"],
    items: [
      {
        key: "ec3-steel-members",
        title: "Steel members",
        code: "EC3-1-1",
        path: DEFAULT_LANDING_ROUTE,
        implemented: true,
        indent: true,
      },
      {
        key: "ec3-fire-design",
        title: "Fire design",
        code: "EC3-1-2",
        path: "/eurocode/ec3-1-2/fire-design",
        indent: true,
      },
      {
        key: "ec3-connections",
        title: "Connections",
        code: "EC3-1-8",
        path: "/eurocode/ec3-1-8/connections",
        indent: true,
      },
    ],
  },
];

export const SIDEBAR_NAV_DIRECT_ITEMS: readonly SidebarNavDirectItem[] = [
  {
    key: "ndg-editor",
    title: "NDG editor",
    code: "NDG",
    icon: "🧩",
    path: "/ndg/editor",
    implemented: true,
  },
  {
    key: "tbd-ec3-debugger",
    title: "EC3 debugger",
    code: "Debug",
    icon: "🧪",
    path: "/tbd-url/debug/ec3",
    implemented: true,
  },
];

const emptyActiveSidebarTarget: ActiveSidebarTarget = {
  itemKey: null,
  sectionKey: null,
};

const normalizeSidebarPathname = (pathname: string) => {
  const withoutBasepath =
    pathname === APP_BASEPATH
      ? "/"
      : pathname.startsWith(`${APP_BASEPATH}/`)
        ? pathname.slice(APP_BASEPATH.length)
        : pathname;

  const withLeadingSlash = withoutBasepath.startsWith("/")
    ? withoutBasepath
    : `/${withoutBasepath}`;

  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
};

const getEffectivePathname = (pathname: string) => {
  const normalizedPath = normalizeSidebarPathname(pathname);
  return normalizedPath === "/" ? DEFAULT_LANDING_ROUTE : normalizedPath;
};

const pathMatchesPrefix = (path: string, prefix: string) =>
  path === prefix ||
  path.startsWith(`${prefix}/`) ||
  path.startsWith(`${prefix}-`);

export const toAppHref = (path: string) => {
  const normalizedPath = normalizeSidebarPathname(path);
  return normalizedPath === "/"
    ? `${APP_BASEPATH}/`
    : `${APP_BASEPATH}${normalizedPath}`;
};

export const getActiveSidebarTarget = (
  pathname: string,
): ActiveSidebarTarget => {
  const effectivePath = getEffectivePathname(pathname);

  for (const section of SIDEBAR_NAV_SECTIONS) {
    const activeItem = section.items.find(
      (item) => item.path === effectivePath,
    );

    if (activeItem) {
      return {
        itemKey: activeItem.key,
        sectionKey: section.key,
      };
    }
  }

  const activeDirectItem = SIDEBAR_NAV_DIRECT_ITEMS.find(
    (item) => item.path === effectivePath,
  );

  if (activeDirectItem) {
    return {
      itemKey: activeDirectItem.key,
      sectionKey: null,
    };
  }

  const activeSection = SIDEBAR_NAV_SECTIONS.find((section) =>
    section.matchPrefixes.some((prefix) => pathMatchesPrefix(effectivePath, prefix)),
  );

  if (activeSection) {
    return {
      itemKey: null,
      sectionKey: activeSection.key,
    };
  }

  return emptyActiveSidebarTarget;
};

export const getActiveSidebarKey = (pathname: string) => {
  const activeTarget = getActiveSidebarTarget(pathname);
  return activeTarget.itemKey ?? activeTarget.sectionKey;
};
