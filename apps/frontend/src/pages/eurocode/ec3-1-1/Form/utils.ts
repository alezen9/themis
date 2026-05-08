const dimensionFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatDimension = (value: number) => {
  if (Number.isInteger(value)) return String(value);
  return dimensionFormatter.format(value);
};
