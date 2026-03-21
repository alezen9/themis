import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Ec3Results } from "./Ec3Results";
import type { VerificationRow } from "./use-ec3-evaluate";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
    writable: true,
  });
});

const setWindowScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
    writable: true,
  });
};

const createResult = ({
  checkId,
  name,
  ratio,
  passed,
}: {
  checkId: number;
  name: string;
  ratio: number;
  passed: boolean;
}): VerificationRow =>
  ({
    checkId,
    name,
    payload: {
      data: {
        check: {
          id: `check-${checkId}`,
          key: `check_${checkId}`,
          name,
          verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
          meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
        },
        passed,
        ratio,
        cache: {
          N_Ed: 560_000,
          N_c_Rd: 1_000_000,
        },
        trace: [
          {
            nodeId: `check-${checkId}`,
            type: "check",
            key: `check_${checkId}`,
            value: ratio,
            verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
            description: name,
            meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
            evaluatorInputs: { N_Ed: 560_000, N_c_Rd: 1_000_000 },
            children: [`input-${checkId}`, `formula-${checkId}`],
          },
          {
            nodeId: `input-${checkId}`,
            type: "user-input",
            key: "N_Ed",
            value: 560_000,
            unit: "N",
            symbol: "N_{Ed}",
            description: "Design axial force",
            children: [],
          },
          {
            nodeId: `formula-${checkId}`,
            type: "formula",
            key: "N_c_Rd",
            value: 1_000_000,
            unit: "N",
            symbol: "N_{c,Rd}",
            description: "Compression resistance",
            expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
            evaluatorInputs: { A: 5_000, fy: 355, gamma_M0: 1 },
            children: [],
          },
        ],
      },
      error: undefined,
    },
  }) as VerificationRow;

const sampleResults = [
  createResult({
    checkId: 2,
    name: "Compression check",
    ratio: 0.56,
    passed: true,
  }),
  createResult({
    checkId: 20,
    name: "Beam-column check",
    ratio: 1.08,
    passed: false,
  }),
];

describe("Ec3Results", () => {
  it("renders verbose checks collapsed by default with sequential numbering", () => {
    render(<Ec3Results results={sampleResults} />);

    fireEvent.click(screen.getByRole("button", { name: "Verbose report" }));

    expect(screen.queryByText("Verification rule")).toBeNull();

    const compressionToggle = screen.getByRole("button", {
      name: /compression check/i,
    });
    const beamColumnToggle = screen.getByRole("button", {
      name: /beam-column check/i,
    });

    expect(compressionToggle.textContent).toContain("1");
    expect(beamColumnToggle.textContent).toContain("2");

    fireEvent.click(compressionToggle);
    expect(screen.getByText("Verification rule")).not.toBeNull();

    fireEvent.click(compressionToggle);
    expect(screen.queryByText("Verification rule")).toBeNull();
  });

  it("renders summary checks collapsed by default and can collapse all from the top", () => {
    render(<Ec3Results results={sampleResults} />);

    fireEvent.click(screen.getByRole("button", { name: "Summary report" }));

    const collapseAllButton = screen.getByRole("button", {
      name: /collapse all/i,
    });
    expect((collapseAllButton as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByText("Check terms")).toBeNull();

    const compressionToggle = screen.getByRole("button", {
      name: /compression check/i,
    });
    const beamColumnToggle = screen.getByRole("button", {
      name: /beam-column check/i,
    });

    expect(compressionToggle.textContent).toContain("1");
    expect(beamColumnToggle.textContent).toContain("2");

    fireEvent.click(compressionToggle);
    fireEvent.click(beamColumnToggle);

    expect(screen.getAllByText("Check terms")).toHaveLength(2);
    expect((collapseAllButton as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(collapseAllButton);

    expect(screen.queryByText("Check terms")).toBeNull();
    expect((collapseAllButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows a bottom-right scroll-to-top button after scrolling", () => {
    setWindowScrollY(0);
    const scrollTo = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: scrollTo,
      writable: true,
    });

    render(<Ec3Results results={sampleResults} />);

    expect(
      screen.queryByRole("button", { name: /scroll to top/i }),
    ).toBeNull();

    setWindowScrollY(480);
    fireEvent.scroll(window);

    const scrollButton = screen.getByRole("button", {
      name: /scroll to top/i,
    });
    expect(scrollButton.textContent).toContain("Top");

    fireEvent.click(scrollButton);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
