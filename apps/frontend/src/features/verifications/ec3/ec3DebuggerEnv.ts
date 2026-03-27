const FALSEY_FLAG_PATTERN = /^(0|false|off|no)$/i;

export const parseVerificationDebuggerFlag = (value: string | undefined) =>
  value === undefined ? true : !FALSEY_FLAG_PATTERN.test(value.trim());

export const verificationDebuggerEnabled = parseVerificationDebuggerFlag(
  import.meta.env.VITE_ENABLE_VERIFICATION_DEBUGGER,
);
