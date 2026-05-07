import {
  forwardRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
} from "react";
import { Latex } from "@components/Latex";
import { Popover, PopoverPopup, PopoverTrigger } from "@components/Popover";
import { InputText } from "./InputText";

type Props = ComponentPropsWithoutRef<"input">;

export const InputLatex = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, onChange, ...inputProps } = props;
  const [previewValue, setPreviewValue] = useState(() =>
    String(props.value ?? props.defaultValue ?? ""),
  );
  const hasPreview = previewValue.trim().length > 0;

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPreviewValue(event.target.value);
    onChange?.(event);
  };

  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        unstyled
        render={
          <InputText
            ref={ref}
            className={className}
            onChange={onInputChange}
            {...inputProps}
          />
        }
      />
      <PopoverPopup
        initialFocus={false}
        finalFocus={false}
        className="pointer-events-none grid min-h-16 max-w-(--anchor-width) min-w-[calc(var(--anchor-width)/2)] place-items-center border-sand-300 bg-(--bg-input-default-color) px-4 py-3 text-center shadow-sand-600/25"
        positionerProps={{
          align: "center",
          collisionAvoidance: {
            side: "shift",
            align: "shift",
            fallbackAxisSide: "none",
          },
          side: "bottom",
        }}
      >
        {hasPreview && (
          <Latex
            tex={previewValue}
            displayMode
            className="text-xl text-slate-800"
          />
        )}
        {!hasPreview && (
          <span className="text-xs font-light whitespace-nowrap text-slate-500">
            Start typing to see the preview...
          </span>
        )}
      </PopoverPopup>
    </Popover>
  );
});

InputLatex.displayName = "InputLatex";
