import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { twMerge } from "tailwind-merge";

import { IconButton } from "@components/Button";
import { IconPlus, IconQuestionMark } from "@components/Icons";
import { Tooltip } from "@components/Tooltip";

import { ConditionText } from "../../conditions/ConditionText";
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
        <Tooltip
          content={
            <>
              {condition && <ConditionText condition={condition} />}
              {!condition && "Add condition"}
            </>
          }
        >
          <IconButton
            onClick={() => openModal({ mode: "edit-edge", edgeId: id })}
            className={twMerge(
              "nodrag nopan pointer-events-auto absolute size-5 border",
              condition
                ? "border-sand-800 bg-sand-800 text-white"
                : "border-sand-400 bg-white text-sand-500 hover:border-sand-600 hover:bg-sand-50",
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {condition && <IconQuestionMark className="size-3" />}
            {!condition && <IconPlus className="size-3" />}
          </IconButton>
        </Tooltip>
      </EdgeLabelRenderer>
    </>
  );
};
