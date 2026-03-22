import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ec3VerificationDefinitions,
  type Ec3VerificationCatalogEntry,
} from "@ndg/ndg-ec3";
import { Ec3WorkbenchForm } from "../ec3/Ec3WorkbenchForm";
import { decodeEc3DebugSession } from "../ec3/ec3-debug-session";
import {
  createDefaultEc3WorkbenchSessionState,
  useEc3Workbench,
} from "../ec3/use-ec3-workbench";
import {
  VerificationDebugger,
  type VerificationDebuggerAdapter,
} from "./VerificationDebugger";
import {
  buildVerificationDebuggerCheck,
  type VerificationDebuggerContextGroup,
} from "./verification-debugger-model";

const toAvailableValues = (value: Record<string, unknown> | null | undefined) =>
  value ?? { unavailable: "Not available for this run." };

export function PageEc3Debugger({
  initialSessionToken,
}: {
  initialSessionToken?: string;
}) {
  const initialSession = useMemo(
    () => decodeEc3DebugSession(initialSessionToken),
    [initialSessionToken],
  );
  const workbench = useEc3Workbench({
    initialSession,
    resetKey: initialSessionToken,
  });

  const rowByCheckId = useMemo(
    () => new Map(workbench.results.map((row) => [row.checkId, row])),
    [workbench.results],
  );

  const conditionContext = useMemo(
    () => ({
      ...workbench.editableInputs,
      ...workbench.annex,
      ...(workbench.resolvedInputs ?? {}),
    }),
    [workbench.annex, workbench.editableInputs, workbench.resolvedInputs],
  );

  const runContextGroups = useMemo<VerificationDebuggerContextGroup[]>(
    () => [
      {
        id: "workbench-session",
        title: "Workbench session",
        description: "Route-level EC3 workbench state before input resolution.",
        values: {
          shape: workbench.sessionState.shape,
          selectedSectionId: workbench.sessionState.selectedSectionId,
          gradeId: workbench.sessionState.gradeId,
          selectedAnnexId: workbench.sessionState.selectedAnnexId,
          customFabricationType: workbench.sessionState.customFabricationType,
          resolvedSectionClassHint:
            workbench.sessionState.resolvedSectionClassHint ?? "—",
        },
      },
      {
        id: "editable-inputs",
        title: "Editable inputs",
        description: "User-controlled values before frontend normalization.",
        values: workbench.editableInputs,
      },
      {
        id: "section-derived-inputs",
        title: "Section-derived inputs",
        description: "Values precomputed from the selected section geometry.",
        values: toAvailableValues(workbench.sectionDerivedInputs),
      },
      {
        id: "material-inputs",
        title: "Material inputs",
        description: "Resolved material constants supplied by the frontend.",
        values: workbench.materialInputs,
      },
      {
        id: "annex-coefficients",
        title: "Annex coefficients",
        description: "National annex coefficients used for the run.",
        values: workbench.annex,
      },
      {
        id: "resolved-engine-inputs",
        title: "Resolved engine inputs",
        description: "Final payload fed into the NDG EC3 engine.",
        values: toAvailableValues(
          workbench.resolvedInputs as Record<string, unknown> | null,
        ),
      },
    ],
    [
      workbench.annex,
      workbench.editableInputs,
      workbench.materialInputs,
      workbench.resolvedInputs,
      workbench.sectionDerivedInputs,
      workbench.sessionState,
    ],
  );

  const checks = useMemo(
    () =>
      ec3VerificationDefinitions.map((definition: Ec3VerificationCatalogEntry) =>
        buildVerificationDebuggerCheck({
          definition,
          row: rowByCheckId.get(definition.checkId),
          conditionContext: conditionContext as Record<string, string | number>,
        }),
      ),
    [conditionContext, rowByCheckId],
  );

  const adapter = useMemo<VerificationDebuggerAdapter>(
    () => ({
      title: "EC3 Verification Debugger",
      subtitle:
        "Inspect inputs, node trees, branch decisions, execution trace, and cache for the current EC3 run.",
      warning: workbench.classResolutionMessage,
      checks,
      runContextGroups,
      rawJsonSections: [
        {
          id: "default-session",
          title: "Default session template",
          value: createDefaultEc3WorkbenchSessionState(),
        },
        {
          id: "current-session",
          title: "Current session state",
          value: workbench.sessionState,
        },
        {
          id: "resolved-inputs",
          title: "Resolved engine inputs",
          value: workbench.resolvedInputs,
        },
        {
          id: "all-results",
          title: "All verification results",
          value: workbench.results,
        },
      ],
      emptyState:
        "No EC3 verification results are available. Check the current workbench inputs and section-class resolution state.",
    }),
    [
      checks,
      runContextGroups,
      workbench.classResolutionMessage,
      workbench.resolvedInputs,
      workbench.results,
      workbench.sessionState,
    ],
  );

  return (
    <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
      <nav className="mb-6 flex flex-wrap gap-4 text-sm">
        <Link to="/" className="underline hover:no-underline">
          Home
        </Link>
        <Link to="/ec3" className="underline hover:no-underline">
          EC3 Verifications
        </Link>
      </nav>

      <div className="mb-6 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EC3 Debugger</h1>
          <p className="mt-1 max-w-4xl text-sm text-gray-600">
            Dedicated inspection surface for verification definitions, decision
            branches, execution order, and cached values across the current 22
            EC3 checks.
          </p>
        </div>

        <details className="rounded border bg-white">
          <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-900">
            Workbench controls
          </summary>
          <div className="border-t px-4 py-4">
            <Ec3WorkbenchForm workbench={workbench} className="space-y-4" />
          </div>
        </details>
      </div>

      <VerificationDebugger adapter={adapter} />
    </div>
  );
}
