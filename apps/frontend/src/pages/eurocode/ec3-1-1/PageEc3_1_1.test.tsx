import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { circularSections } from "./data/circularSections";
import { flangedSections } from "./data/flangedSections";
import { hollowSections } from "./data/hollowSections";
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

    const psiY = screen.getByTestId<HTMLInputElement>("input-psi_y");
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

    const remountedPsiY = screen.getByTestId<HTMLInputElement>("input-psi_y");
    expect(remountedPsiY.value).toBe("");
  });

  it("emits valid values only when the active moment fields pass schema", async () => {
    const onValidValuesChange = vi.fn();

    render(<PageEc3_1_1 onValidValuesChange={onValidValuesChange} />);
    onValidValuesChange.mockClear();

    const psiY = screen.getByTestId<HTMLInputElement>("input-psi_y");
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
    const remountedPsiY = screen.getByTestId<HTMLInputElement>("input-psi_y");
    expect(remountedPsiY.value).toBe("");

    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ M_y_Ed_shape: "uniform" }),
    );
  });

  it("emits valid values after switching away from invalid custom geometry", async () => {
    const onValidValuesChange = vi.fn();

    render(<PageEc3_1_1 onValidValuesChange={onValidValuesChange} />);

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    const customSection = screen.getByTestId("option-custom");
    fireEvent.mouseMove(customSection);
    fireEvent.click(customSection);

    const height = screen.getByTestId("input-i_geometry.h_mm");
    fireEvent.change(height, { target: { value: "1" } });

    act(() => {
      vi.advanceTimersByTime(60);
    });
    onValidValuesChange.mockClear();

    fireEvent.click(screen.getByRole("radio", { name: "RHS" }));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ shape: "RHS" }),
    );
  });

  it("emits valid values with reset steel grade after shape and fabrication changes", async () => {
    const onValidValuesChange = vi.fn();

    render(<PageEc3_1_1 onValidValuesChange={onValidValuesChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "RHS" }));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        shape: "RHS",
        fabrication_type: "cold-formed",
        steel_grade_id: "EN10219-1:S235H",
      }),
    );

    fireEvent.click(screen.getByRole("radio", { name: "Hot finished" }));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        shape: "RHS",
        fabrication_type: "hot-formed",
        steel_grade_id: "EN10210-1:S235H",
      }),
    );
    fireEvent.click(screen.getByTestId("input-steel_grade_id-trigger"));
    expect(
      screen
        .getByTestId("option-EN10210-1:S235H")
        .hasAttribute("data-highlighted"),
    ).toBe(true);
  });

  it("emits valid values with reset steel grade after returning to I shape", async () => {
    const onValidValuesChange = vi.fn();

    render(<PageEc3_1_1 onValidValuesChange={onValidValuesChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "RHS" }));
    fireEvent.click(screen.getByRole("radio", { name: "I" }));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        shape: "I",
        fabrication_type: "rolled",
        steel_grade_id: "EN10025-2:S235",
      }),
    );

    fireEvent.click(screen.getByRole("radio", { name: "Welded" }));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(onValidValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        shape: "I",
        fabrication_type: "welded",
        steel_grade_id: "EN10025-2:S235",
      }),
    );
  });

  it("overwrites custom I geometry when selecting a catalog section", async () => {
    const iCatalogSection = flangedSections[0];
    const onValuesChange = vi.fn();

    render(<PageEc3_1_1 onValuesChange={onValuesChange} />);

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-custom"));
    fireEvent.click(screen.getByTestId("option-custom"));
    const height = screen.getByTestId<HTMLInputElement>(
      "input-i_geometry.h_mm",
    );
    fireEvent.change(height, { target: { value: "123" } });
    expect(height.value).toBe("123");

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId(`option-${iCatalogSection.id}`));
    fireEvent.click(screen.getByTestId(`option-${iCatalogSection.id}`));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.queryByTestId("input-i_geometry.h_mm")).toBeNull();
    expect(screen.getByTestId<HTMLInputElement>("input-section_id").value).toBe(
      iCatalogSection.id,
    );
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        section_id: iCatalogSection.id,
        i_geometry: {
          h_mm: iCatalogSection.h_mm,
          b_mm: iCatalogSection.b_mm,
          tw_mm: iCatalogSection.tw_mm,
          tf_mm: iCatalogSection.tf_mm,
          r_mm: iCatalogSection.r_mm,
        },
      }),
    );
  });

  it("overwrites custom RHS and CHS geometry when selecting catalog sections", async () => {
    const rhsCatalogSection = hollowSections[0];
    const chsCatalogSection = circularSections[0];
    const onValuesChange = vi.fn();

    render(<PageEc3_1_1 onValuesChange={onValuesChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "RHS" }));
    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-custom"));
    fireEvent.click(screen.getByTestId("option-custom"));
    const rhsHeight = screen.getByTestId<HTMLInputElement>(
      "input-rhs_geometry.h_mm",
    );
    fireEvent.change(rhsHeight, { target: { value: "12" } });
    expect(rhsHeight.value).toBe("12");

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId(`option-${rhsCatalogSection.id}`));
    fireEvent.click(screen.getByTestId(`option-${rhsCatalogSection.id}`));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.queryByTestId("input-rhs_geometry.h_mm")).toBeNull();
    expect(screen.getByTestId<HTMLInputElement>("input-section_id").value).toBe(
      rhsCatalogSection.id,
    );
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        section_id: rhsCatalogSection.id,
        rhs_geometry: {
          h_mm: rhsCatalogSection.h_mm,
          b_mm: rhsCatalogSection.b_mm,
          tw_mm: rhsCatalogSection.tw_mm,
          ri_mm: rhsCatalogSection.ri_mm,
          ro_mm: rhsCatalogSection.ro_mm,
        },
      }),
    );

    fireEvent.click(screen.getByRole("radio", { name: "CHS" }));
    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-custom"));
    fireEvent.click(screen.getByTestId("option-custom"));
    const diameter = screen.getByTestId<HTMLInputElement>(
      "input-chs_geometry.d_mm",
    );
    fireEvent.change(diameter, { target: { value: "13" } });
    expect(diameter.value).toBe("13");

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId(`option-${chsCatalogSection.id}`));
    fireEvent.click(screen.getByTestId(`option-${chsCatalogSection.id}`));

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.queryByTestId("input-chs_geometry.d_mm")).toBeNull();
    expect(screen.getByTestId<HTMLInputElement>("input-section_id").value).toBe(
      chsCatalogSection.id,
    );
    expect(onValuesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        section_id: chsCatalogSection.id,
        chs_geometry: {
          d_mm: chsCatalogSection.d_mm,
          t_mm: chsCatalogSection.t_mm,
        },
      }),
    );
  });

  it("shows field errors for invalid custom geometry refinements", async () => {
    vi.useRealTimers();

    render(<PageEc3_1_1 />);

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-IPE100"));
    fireEvent.click(screen.getByTestId("option-IPE100"));

    fireEvent.click(screen.getByTestId("input-section_id-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-custom"));
    fireEvent.click(screen.getByTestId("option-custom"));

    expect(
      screen.getByTestId<HTMLInputElement>("input-i_geometry.b_mm").value,
    ).toBe("55");
    fireEvent.change(screen.getByTestId("input-i_geometry.tw_mm"), {
      target: { value: "90.1" },
    });

    await waitFor(() => {
      expect(
        "error" in screen.getByTestId("field-i_geometry.b_mm").dataset,
      ).toBe(true);
    });
    expect(
      "error" in screen.getByTestId("field-i_geometry.tw_mm").dataset,
    ).toBe(true);
    expect("error" in screen.getByTestId("field-i_geometry.r_mm").dataset).toBe(
      true,
    );
  });
});
