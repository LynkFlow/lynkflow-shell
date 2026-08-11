import type { Config } from "tailwindcss";
import { color, radius, typography } from "@lynkflow/ui-kit";

/**
 * Theme values come from @lynkflow/ui-kit's design tokens only -- never
 * redefined locally (.claude/rules/styling.md). The Shell renders a bare,
 * unbranded layout for now (no logo/brand colors of its own): every color
 * it uses is a plain ui-kit neutral/primary token, the same way any MFE
 * would use them.
 */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ...color },
      borderRadius: { ...radius, DEFAULT: radius.md },
      fontFamily: {
        sans: [typography.fontFamily.base],
      },
    },
  },
} satisfies Config;
