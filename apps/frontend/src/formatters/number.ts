const NUMBER_LOCALE = "it-CH";

const standardNumberFormatter = new Intl.NumberFormat(NUMBER_LOCALE, {
  useGrouping: "always",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const engineeringNumberFormatter = new Intl.NumberFormat(NUMBER_LOCALE, {
  notation: "engineering",
  maximumFractionDigits: 2,
});

const dimensionIntegerFormatter = new Intl.NumberFormat(NUMBER_LOCALE, {
  useGrouping: "always",
  maximumFractionDigits: 0,
});

const dimensionNumberFormatter = new Intl.NumberFormat(NUMBER_LOCALE, {
  useGrouping: "always",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = (
  value: number,
  as: "auto" | "dimension" = "auto",
) => {
  if (!Number.isFinite(value)) return String(value);

  switch (as) {
    case "dimension":
      if (Number.isInteger(value))
        return dimensionIntegerFormatter.format(value);
      return dimensionNumberFormatter.format(value);
    case "auto": {
      const abs = Math.abs(value);
      const isLarge = abs >= 1_000_000;
      const isSmall = abs > 0 && abs < 0.01;

      if (isLarge || isSmall) {
        return engineeringNumberFormatter.format(value).replace("E", "e");
      }

      return standardNumberFormatter.format(value);
    }
  }
};
