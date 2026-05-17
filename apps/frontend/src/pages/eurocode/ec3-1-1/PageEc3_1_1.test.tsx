import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageEc3_1_1 } from "./PageEc3_1_1";

class PlutonChain {
  group = () => this;
  path = () => this;
  dimension = () => this;
  moveToAbs = () => this;
  moveTo = () => this;
  lineTo = () => this;
  arcTo = () => this;
  tick = () => this;
  textAt = () => this;
  arrowFilled = () => this;
  close = () => this;
}

vi.mock("pluton-2d", () => ({
  Pluton2D: class<TParams> {
    params: TParams;
    geometry = new PlutonChain();
    dimensions = new PlutonChain();

    constructor(_element: SVGSVGElement, options: { params: TParams }) {
      this.params = options.params;
    }

    draw(callback: (params: TParams) => void) {
      callback(this.params);
    }

    dispose() {}
  },
}));

describe("[EC3-1-1] PageEc3_1_1", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits raw values for inactive and reactivated moment fields", async () => {
    const onValuesChange = vi.fn();

    render(<PageEc3_1_1 onValuesChange={onValuesChange} />);

    const psiY = screen.getByTestId("input-psi_y") as HTMLInputElement;
    const momentYShape = screen.getByTestId("input-M_y_Ed_shape");

    fireEvent.change(psiY, { target: { value: "" } });
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "linear", psi_y: "" }),
    );

    fireEvent.click(momentYShape);
    fireEvent.mouseMove(screen.getByTestId("option-uniform"));
    fireEvent.click(screen.getByTestId("option-uniform"));
    expect(screen.queryByTestId("input-psi_y")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "uniform", psi_y: "" }),
    );

    fireEvent.click(momentYShape);
    fireEvent.mouseMove(screen.getByTestId("option-linear"));
    fireEvent.click(screen.getByTestId("option-linear"));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "linear", psi_y: "" }),
    );

    const remountedPsiY = screen.getByTestId("input-psi_y") as HTMLInputElement;
    expect(remountedPsiY.value).toBe("");
  });

  it("emits valid values only when the active moment fields pass schema", async () => {
    const onValidValuesChange = vi.fn();

    render(<PageEc3_1_1 onValidValuesChange={onValidValuesChange} />);

    const psiY = screen.getByTestId("input-psi_y") as HTMLInputElement;
    const momentYShape = screen.getByTestId("input-M_y_Ed_shape");

    fireEvent.change(psiY, { target: { value: "" } });
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).not.toHaveBeenCalled();

    fireEvent.click(momentYShape);
    fireEvent.mouseMove(screen.getByTestId("option-uniform"));
    fireEvent.click(screen.getByTestId("option-uniform"));
    expect(screen.queryByTestId("input-psi_y")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "uniform" }),
    );

    fireEvent.click(momentYShape);
    fireEvent.mouseMove(screen.getByTestId("option-linear"));
    fireEvent.click(screen.getByTestId("option-linear"));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    const remountedPsiY = screen.getByTestId("input-psi_y") as HTMLInputElement;
    expect(remountedPsiY.value).toBe("");

    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "uniform" }),
    );
  });
});
