import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginRouter from "@tanstack/eslint-plugin-router";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/routeTree.gen.ts"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-typescript"],
    rules: {
      ...eslintReact.configs["recommended-typescript"].rules,
      // defer hooks linting to the official eslint-plugin-react-hooks below
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      // our ref names (e.g. `scene`) are already domain-clear
      "@eslint-react/naming-convention-ref-name": "off",
    },
  },
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "@tanstack/router": pluginRouter,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      ...pluginRouter.configs.recommended.rules,
    },
  },
  prettier,
);
