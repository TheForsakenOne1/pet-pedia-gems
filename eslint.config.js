import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Rule: no-raw-typography-classes
 *
 * Forbids hand-rolling the typographic utility classes that the design
 * system exposes through <Eyebrow />, <DisplayXL/LG/MD />, <Heading />,
 * <Body />, <Lede />, <Prose />, <PullQuote />.
 *
 * Why: those classes (`eyebrow`, `display-xl`, `display-lg`, `display-md`,
 * `body-serif`, `drop-cap`) carry semantic + accessibility metadata in the
 * components (correct heading levels, aria roles, polymorphic `as` prop,
 * tone variants). Pasting the raw class skips that contract and silently
 * drifts from the design system.
 *
 * The check matches `className="… eyebrow …"` and template forms.
 * Allowed in: src/components/typography.tsx (the source of truth) and
 * src/styles.css (where the utilities are declared).
 */
const FORBIDDEN_TOKENS = ["eyebrow", "display-xl", "display-lg", "display-md", "body-serif", "drop-cap"];
const FORBIDDEN_REGEX = new RegExp(`\\b(${FORBIDDEN_TOKENS.join("|")})\\b`);

const noRawTypographyClasses = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use the typography components (Eyebrow, DisplayXL/LG/MD, Heading, Body, Lede, Prose, PullQuote) instead of raw utility classes.",
    },
    schema: [],
    messages: {
      forbidden:
        "Do not use the raw `{{token}}` class. Import the matching component from '@/components/typography' (e.g. <Eyebrow>, <DisplayXL>, <Body size='lg'>). See docs/typography.md.",
    },
  },
  create(context) {
    function checkString(node, value) {
      if (typeof value !== "string") return;
      const m = value.match(FORBIDDEN_REGEX);
      if (m) context.report({ node, messageId: "forbidden", data: { token: m[1] } });
    }
    return {
      JSXAttribute(node) {
        if (!node.name || node.name.name !== "className") return;
        const v = node.value;
        if (!v) return;
        if (v.type === "Literal") checkString(v, v.value);
        if (v.type === "JSXExpressionContainer") {
          const expr = v.expression;
          if (expr.type === "Literal") checkString(expr, expr.value);
          if (expr.type === "TemplateLiteral") {
            for (const q of expr.quasis) checkString(q, q.value.cooked);
          }
        }
      },
    };
  },
};

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "design-system": { rules: { "no-raw-typography-classes": noRawTypographyClasses } },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "design-system/no-raw-typography-classes": "error",
    },
  },
  {
    // The component file IS allowed to define and reference these utilities.
    files: ["src/components/typography.tsx"],
    rules: { "design-system/no-raw-typography-classes": "off" },
  },
  eslintPluginPrettier,
);
