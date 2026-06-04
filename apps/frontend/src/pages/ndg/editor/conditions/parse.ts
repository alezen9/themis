import type {
  Condition,
  ConditionOperand,
  ConditionTuple,
} from "@ndg/ndg-core";

type OperatorName = "eq" | "lt" | "lte" | "gt" | "gte";

type Token =
  | { kind: "key"; value: string }
  | { kind: "number"; value: number }
  | { kind: "string"; value: string }
  | { kind: "operator"; value: OperatorName }
  | { kind: "and" }
  | { kind: "or" }
  | { kind: "lparen" }
  | { kind: "rparen" };

export type ParseResult =
  | { ok: true; condition: Condition | undefined }
  | { ok: false; error: string };

const isDigit = (char: string) => char >= "0" && char <= "9";
const isIdentifierStart = (char: string) => /[A-Za-z_]/.test(char);
const isIdentifierPart = (char: string) => /[A-Za-z0-9_.]/.test(char);

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (char === " " || char === "\t" || char === "\n") {
      i++;
    } else if (char === "(") {
      tokens.push({ kind: "lparen" });
      i++;
    } else if (char === ")") {
      tokens.push({ kind: "rparen" });
      i++;
    } else if (char === '"') {
      const end = text.indexOf('"', i + 1);
      if (end === -1) throw new Error("Unterminated string");
      tokens.push({ kind: "string", value: text.slice(i + 1, end) });
      i = end + 1;
    } else if (text.slice(i, i + 2) === "<=" || char === "≤") {
      tokens.push({ kind: "operator", value: "lte" });
      i += char === "≤" ? 1 : 2;
    } else if (text.slice(i, i + 2) === ">=" || char === "≥") {
      tokens.push({ kind: "operator", value: "gte" });
      i += char === "≥" ? 1 : 2;
    } else if (char === "<") {
      tokens.push({ kind: "operator", value: "lt" });
      i++;
    } else if (char === ">") {
      tokens.push({ kind: "operator", value: "gt" });
      i++;
    } else if (char === "=") {
      tokens.push({ kind: "operator", value: "eq" });
      i++;
    } else if (isDigit(char) || (char === "-" && isDigit(text[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < text.length && (isDigit(text[j]) || text[j] === ".")) j++;
      tokens.push({ kind: "number", value: Number(text.slice(i, j)) });
      i = j;
    } else if (isIdentifierStart(char)) {
      let j = i + 1;
      while (j < text.length && isIdentifierPart(text[j])) j++;
      const word = text.slice(i, j);
      const keyword = word.toUpperCase();
      if (keyword === "AND") tokens.push({ kind: "and" });
      else if (keyword === "OR") tokens.push({ kind: "or" });
      else tokens.push({ kind: "key", value: word });
      i = j;
    } else {
      throw new Error(`Unexpected character "${char}"`);
    }
  }

  return tokens;
};

const comparisonByOperator: Record<
  OperatorName,
  (tuple: ConditionTuple) => Condition
> = {
  eq: tuple => ({ eq: tuple }),
  lt: tuple => ({ lt: tuple }),
  lte: tuple => ({ lte: tuple }),
  gt: tuple => ({ gt: tuple }),
  gte: tuple => ({ gte: tuple }),
};

export const parseCondition = (text: string): ParseResult => {
  if (text.trim() === "") return { ok: true, condition: undefined };

  try {
    const tokens = tokenize(text);
    let pos = 0;
    const peek = () => tokens[pos];

    const parseOperand = (): ConditionOperand => {
      const token = tokens[pos++];
      if (!token) throw new Error("Expected a value");
      if (token.kind === "string") return { value: token.value };
      if (token.kind === "number") return { value: token.value };
      if (token.kind === "key") return { key: token.value };
      throw new Error("Expected a value, number, or key");
    };

    const parseComparison = (): Condition => {
      const keyToken = tokens[pos++];
      if (!keyToken || keyToken.kind !== "key") throw new Error("Expected a key");
      const operatorToken = tokens[pos++];
      if (!operatorToken || operatorToken.kind !== "operator")
        throw new Error("Expected a comparison operator (=, <, <=, >, >=)");
      const operand = parseOperand();
      const tuple: ConditionTuple = [keyToken.value, operand];
      return comparisonByOperator[operatorToken.value](tuple);
    };

    const parsePrimary = (): Condition => {
      if (peek()?.kind === "lparen") {
        pos++;
        const condition = parseOr();
        if (tokens[pos++]?.kind !== "rparen") throw new Error("Expected )");
        return condition;
      }
      return parseComparison();
    };

    const parseAnd = (): Condition => {
      const first = parsePrimary();
      const rest: Condition[] = [];
      while (peek()?.kind === "and") {
        pos++;
        rest.push(parsePrimary());
      }
      return rest.length === 0 ? first : { and: [first, ...rest] };
    };

    const parseOr = (): Condition => {
      const first = parseAnd();
      const rest: Condition[] = [];
      while (peek()?.kind === "or") {
        pos++;
        rest.push(parseAnd());
      }
      return rest.length === 0 ? first : { or: [first, ...rest] };
    };

    const condition = parseOr();
    if (pos < tokens.length) throw new Error("Unexpected trailing input");
    return { ok: true, condition };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid",
    };
  }
};
