import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  VerificationDebugger,
  type VerificationDebuggerAdapter,
} from "./VerificationDebugger";

const sampleAdapter: VerificationDebuggerAdapter = {
  title: "EC3 Verification Debugger",
  subtitle: "Tree-first inspection surface",
  checks: [
    {
      checkId: 1,
      name: "Compression check",
      status: "failed",
      applicable: true,
      ratio: 1.12,
      ratioLabel: "1.120",
      detail: {
        checkId: 1,
        name: "Compression check",
        status: "failed",
        ratio: 1.12,
        applicable: true,
        definition: {
          checkId: 1,
          name: "Compression check",
          check: {
            id: "check-1",
            key: "check_1",
            name: "Compression check",
            verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\le 1.0",
            meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
          },
          nodes: [],
        },
        root: {
          id: "check-1",
          key: "check_1",
          name: "Compression check",
          type: "check",
          verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\le 1.0",
          rawValue: 1.12,
          status: "executed",
          isActivePath: true,
          children: [
            {
              childNodeId: "input-1",
              status: "taken",
              conditionLabel: "always",
              child: {
                id: "input-1",
                key: "N_Ed",
                name: "N_Ed",
                type: "user-input",
                symbol: "N_{Ed}",
                description: "Design axial force",
                unit: "\\mathrm{N}",
                meta: { tableRef: "3.1" },
                rawValue: 560_000,
                status: "executed",
                isActivePath: true,
                children: [
                  {
                    childNodeId: "formula-1",
                    status: "taken",
                    conditionLabel: "always",
                    child: {
                      id: "formula-1",
                      key: "n_ratio_helper",
                      name: "Axial force ratio helper",
                      type: "formula",
                      expression: "\\frac{N_{Ed}}{A}",
                      rawValue: 178.253119,
                      status: "executed",
                      isActivePath: true,
                      children: [],
                    },
                  },
                ],
              },
            },
            {
              childNodeId: "derived-1",
              status: "skipped",
              conditionLabel: "section_class = 3",
              child: {
                id: "derived-1",
                key: "chi_y",
                name: "chi_y",
                type: "derived",
                symbol: "\\chi_y",
                description: "Buckling reduction factor",
                meta: { equationRef: "(6.49)" },
                rawValue: undefined,
                status: "skipped",
                isActivePath: false,
                children: [],
              },
            },
          ],
        },
        trace: [
          {
            index: 0,
            entry: {
              nodeId: "check-1",
              type: "check",
              key: "check_1",
              value: 1.12,
              verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\le 1.0",
              children: ["input-1"],
              evaluatorInputs: { N_Ed: 560_000, N_c_Rd: 500_000 },
            },
          },
        ],
        cacheEntries: [
          { key: "N_Ed", value: 560_000, isTraced: true },
          { key: "N_c_Rd", value: 500_000, isTraced: false },
        ],
        resultPayload: {
          data: {
            check: {
              id: "check-1",
              key: "check_1",
              name: "Compression check",
              verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\le 1.0",
            },
            passed: false,
            ratio: 1.12,
            cache: { N_Ed: 560_000, N_c_Rd: 500_000 },
            trace: [],
          },
        },
        executionAvailable: true,
      },
    },
    {
      checkId: 2,
      name: "Lateral torsional buckling check",
      status: "not-applicable",
      applicable: false,
      ratioLabel: "—",
      detail: {
        checkId: 2,
        name: "Lateral torsional buckling check",
        status: "not-applicable",
        applicable: false,
        definition: {
          checkId: 2,
          name: "Lateral torsional buckling check",
          check: {
            id: "check-2",
            key: "check_2",
            name: "Lateral torsional buckling check",
            verificationExpression: "\\frac{M_{Ed}}{M_{b,Rd}} \\le 1.0",
          },
          nodes: [],
        },
        root: {
          id: "check-2",
          key: "check_2",
          name: "Lateral torsional buckling check",
          type: "check",
          verificationExpression: "\\frac{M_{Ed}}{M_{b,Rd}} \\le 1.0",
          rawValue: undefined,
          status: "not-reached",
          isActivePath: false,
          children: [],
        },
        trace: [],
        cacheEntries: [],
        resultPayload: {
          error: {
            name: "Ec3VerificationError",
            type: "not-applicable-ltb",
            message: "Lateral torsional buckling is disabled for this run.",
          },
        },
        errorMessage: "Lateral torsional buckling is disabled for this run.",
        executionAvailable: false,
      },
    },
  ],
  runContextGroups: [
    {
      id: "editable-inputs",
      title: "Editable inputs",
      values: { N_Ed: -560_000, M_y_Ed: 20_000_000 },
    },
  ],
  rawJsonSections: [
    {
      id: "resolved-inputs",
      title: "Resolved engine inputs",
      value: { N_Ed: -560_000, section_class: 2 },
    },
  ],
};

afterEach(() => {
  cleanup();
});

describe("VerificationDebugger", () => {
  it("renders run context, tree, trace, and cache for the selected verification", () => {
    const { container } = render(
      <VerificationDebugger adapter={sampleAdapter} />,
    );

    expect(screen.getAllByText("Compression check").length).toBeGreaterThan(0);
    expect(screen.getByText("Node diagram")).not.toBeNull();
    expect(screen.getByTestId("tree-diagram-canvas")).not.toBeNull();
    expect(screen.getByTestId("diagram-zoom-value").textContent).toBe("100%");
    expect(screen.getByText("Execution trace")).not.toBeNull();
    expect(screen.getByText("Cache")).not.toBeNull();
    expect(screen.getByText("Editable inputs")).not.toBeNull();
    expect(screen.getByText("tableRef: 3.1")).not.toBeNull();
    expect(screen.getByText("Axial force ratio helper")).not.toBeNull();
    expect(container.querySelectorAll(".katex").length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: /select node chi_y/i }),
    ).toBeNull();
    expect(screen.queryByText("Selected node")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: /collapse all subtrees/i }),
    );
    expect(screen.queryByText("Axial force ratio helper")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /zoom out diagram/i }));
    expect(screen.getByTestId("diagram-zoom-value").textContent).toBe("90%");
    expect(screen.getByText("N_c_Rd")).not.toBeNull();
  });

  it("switches between verifications and shows unavailable execution state for non-applicable results", () => {
    render(<VerificationDebugger adapter={sampleAdapter} />);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: /lateral torsional buckling check/i,
      })[0]!,
    );

    expect(
      screen.getByText("Lateral torsional buckling is disabled for this run."),
    ).not.toBeNull();
    const tracePanel = screen.getByTestId(
      "execution-trace-panel",
    ) as HTMLDetailsElement;
    expect(tracePanel.open).toBe(false);
    fireEvent.click(screen.getByText("Execution trace"));
    expect(tracePanel.open).toBe(true);
    expect(
      screen.getByText("Execution trace is not available for this result."),
    ).not.toBeNull();
    expect(
      screen.getByText("Cache values are not available for this result."),
    ).not.toBeNull();
  });

  it("renders raw JSON for the selected verification", () => {
    render(<VerificationDebugger adapter={sampleAdapter} />);

    fireEvent.click(screen.getAllByRole("button", { name: /raw json/i })[0]!);

    expect(screen.getByText("Selected verification definition")).not.toBeNull();
    expect(screen.getByText("Selected result payload")).not.toBeNull();
  });
});
