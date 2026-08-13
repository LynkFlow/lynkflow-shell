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
      colors: {
        ...color,
        // Same alias lynkflow-ui-kit's own tailwind.config.ts defines --
        // enables bg-danger-subtle/text-danger-subtle for the Shell's own
        // Banner component (src/features/auth/components/common/Banner.tsx),
        // sourced from the same Figma error-banner frame color.dangerSubtle
        // already documents (tokens/index.ts).
        "danger-subtle": color.dangerSubtle,
      },
      borderRadius: { ...radius, DEFAULT: radius.md },
      fontFamily: {
        sans: [typography.fontFamily.base],
      },
    },
  },
} satisfies Config;
