import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  createFileRoute: () => () => ({
    useSearch: () => ({}),
  }),
}));

describe("DebugEc3RouteContent", () => {
  it("redirects to /ec3 when the debugger route is disabled", async () => {
    const { DebugEc3RouteContent } = await import("./ec3");

    render(<DebugEc3RouteContent enabled={false} session="abc123" />);

    expect(screen.getByTestId("navigate").textContent).toBe("/ec3");
  });
});
