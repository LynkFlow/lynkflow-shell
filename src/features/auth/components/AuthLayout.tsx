import type { ReactNode } from "react";

import { Logo } from "../../../components/Logo";
import logoDark from "../../../assets/logo-dark.svg";
import heroBackground from "../../../assets/Container.png";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Not a `@lynkflow/ui-kit` component -- no page-shell/split-layout primitive
 * there yet, so this stays local. Shared by every auth screen
 * (login/signup/forgot-password/reset-password/activate-account).
 *
 * Two fixes from the first pass, both from real feedback:
 *
 * 1. `h-screen` (exact viewport height), not `min-h-screen` -- the design is
 *    a fixed 1440x1024 frame with no scroll, and `min-h-screen` let content
 *    grow taller than the viewport, forcing one. The form panel itself gets
 *    its own `overflow-y-auto` as a safety net only (a very short viewport
 *    or heavy zoom), not the page -- the design itself should fit without
 *    it at the target size.
 * 2. The form panel is `items-start` (anchored to the top), not
 *    `items-center` (true vertical centering). A dead-centered flex child
 *    grows from ITS OWN CENTER -- so when a field's error message adds
 *    height, the whole block's top edge moves up at the same time its
 *    bottom edge moves down (visible shift on both sides, reported as "the
 *    input field shifts at the top and bottom"). Anchoring to the top means
 *    added height only ever pushes content below it -- shift at the bottom
 *    only, never the top. The `pt-16`/`lg:pt-24` below is what keeps this
 *    still looking reasonably centered at the 1024-tall target instead of
 *    jammed against the header.
 *
 * The logo (this screen's only "navbar") is shown at every size now, not
 * just `md:hidden` -- the Shell's own dev nav (Home/Scratch links, App.tsx)
 * is deliberately NOT rendered on auth routes; this logo is what a real
 * login screen has instead, at every width, not just mobile.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      {/* Fixed 700px per the Figma spec, not a fraction of the viewport --
          a fluid width would grow/shrink the hero image relative to the
          form panel differently than the design at other viewport widths. */}
      <div
        className="relative hidden shrink-0 overflow-hidden p-10 md:block md:w-[700px] lg:p-14"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,46,30,0.1), rgba(6,46,30,0.5)), url(${heroBackground})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 pt-10 pb-10 sm:px-10 md:px-12 md:pt-16 lg:px-16 lg:pt-24">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <Logo src={logoDark} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
