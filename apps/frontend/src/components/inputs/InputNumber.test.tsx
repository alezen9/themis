import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InputNumber } from "./InputNumber";

describe("[UI] InputNumber", () => {
  it("blurs on wheel to avoid native number stepping", () => {
    const handleWheel = vi.fn();

    render(<InputNumber aria-label="Length" onWheel={handleWheel} />);

    const input = screen.getByLabelText("Length");
    input.focus();

    fireEvent.wheel(input, { deltaY: 1 });

    expect(handleWheel).toHaveBeenCalledOnce();
    expect(document.activeElement).not.toBe(input);
  });
});
