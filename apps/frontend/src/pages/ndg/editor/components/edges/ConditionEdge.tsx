import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { twMerge } from "tailwind-merge";

import { IconButton } from "@components/Button";
import { IconBranch, IconPlus } from "@components/Icons";
import { Tooltip } from "@components/Tooltip";

import { ConditionText } from "../../conditions/ConditionText";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import type { EditorEdge } from "../../document/types";
import { useNdgEditorModalStore } from "../../modals/useNdgEditorModalStore";

export const ConditionEdge = (props: EdgeProps<EditorEdge>) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
  } = props;
  const openModal = useNdgEditorModalStore(state => state.openModal);
  const isInvalid = useNdgEditorStore(state => state.isInvalidEdge(id));

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const condition = data?.condition;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <Tooltip
            content={
              <>
                {condition && <ConditionText condition={condition} />}
                {!condition && "Add condition"}
                {isInvalid && (
                  <span className="block text-red-300">Unknown key</span>
                )}
              </>
            }
          >
            <IconButton
              onClick={() => openModal({ mode: "edit-edge", edgeId: id })}
              className={twMerge(
                "size-4 border",
                !condition &&
                  "border-sand-400 bg-white text-sand-500 hover:border-sand-600 hover:bg-sand-50",
                condition &&
                  !isInvalid &&
                  "border-sand-800 bg-sand-800 text-white",
                isInvalid && "border-red-600 bg-red-600 text-white",
              )}
            >
              {condition && <IconBranch className="size-2" />}
              {!condition && <IconPlus className="size-3" />}
            </IconButton>
          </Tooltip>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
