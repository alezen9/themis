const KEY_REF = /\\key\{([^}]+)\}/g;

export const resolveKeyRefs = (
  template: string,
  resolve: (key: string) => string,
) => template.replace(KEY_REF, (_match, key: string) => resolve(key));

export const templateKeys = (template: string): string[] =>
  [...template.matchAll(KEY_REF)]
    .map(match => match[1])
    .filter((key): key is string => !!key);
