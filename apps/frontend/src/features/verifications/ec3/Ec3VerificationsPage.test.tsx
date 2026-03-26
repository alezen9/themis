import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <a className={className}>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("Ec3VerificationsPage", () => {
  it("shows debugger links when the debugger flag is enabled", async () => {
    vi.unstubAllEnvs();
    vi.resetModules();

    const { Ec3VerificationsPage } = await import("./Ec3VerificationsPage");
    render(<Ec3VerificationsPage />);

    expect(screen.getByText("Open in debugger")).not.toBeNull();
    expect(screen.getByText("EC3 Debugger")).not.toBeNull();
  });

  it("hides debugger links when the debugger flag is disabled", async () => {
    vi.stubEnv("VITE_ENABLE_VERIFICATION_DEBUGGER", "false");
    vi.resetModules();

    const { Ec3VerificationsPage } = await import("./Ec3VerificationsPage");
    render(<Ec3VerificationsPage />);

    expect(screen.queryByText("Open in debugger")).toBeNull();
    expect(screen.queryByText("EC3 Debugger")).toBeNull();
  });
});
