import type { ReactNode } from "react";

import { Logo } from "../components/Logo";
import logoDark from "../assets/logo-dark.svg";
import heroBackground from "../assets/Container.png";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Not a `@lynkflow/ui-kit` component -- no page-shell/split-layout primitive
 * there yet, so this stays local. Shared by every auth screen
 * (login/signup/forgot-password/reset-password/activate-account).
 *
 * Fixes from real feedback:
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
 * 3. Hero image: a real `<img>` with `object-cover`, not a CSS
 *    `background-image` + `backgroundSize: "100% 100%"`. `Container.png` is
 *    2100x3072 (~0.683 aspect ratio) -- almost exactly the 700x1024 design
 *    box's own ratio (~0.684), so `100% 100%` looked fine ONLY at exactly
 *    1024px tall. At any other real browser window height (i.e. almost
 *    always), the box's aspect ratio drifted away from the image's, and
 *    `100% 100%` stretches non-uniformly to fill it regardless -- the
 *    reported "content inside the image is stretched" bug. `object-cover`
 *    scales uniformly and crops instead, so it never distorts, at any
 *    height. The panel's *width* stays the spec'd fixed 700px either way
 *    (`shrink-0` + `md:w-[700px]`, unrelated to this fix) -- the distorted
 *    image just made the panel's contents look visually oversized/dominant
 *    relative to the form panel, which read as "the image has more space
 *    than the content" even though the box itself was always 700px.
 * 4. No `Logo` above the form panel at `md`+ -- the Figma spec shows the
 *    logo only inside the hero panel (baked into `Container.png` itself,
 *    top-left), not repeated above "Welcome Back". Kept as a `md:hidden`
 *    fallback only, since the hero panel (and its baked-in logo) disappears
 *    below `md` -- without it, a mobile visitor would see no LynkFlow
 *    branding anywhere on the screen.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      {/* Fixed 700px per the Figma spec, not a fraction of the viewport --
          a fluid width would grow/shrink the hero image relative to the
          form panel differently than the design at other viewport widths. */}
      <div className="relative hidden shrink-0 overflow-hidden md:block md:w-[700px]">
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(6,46,30,0.1), rgba(6,46,30,0.5))",
          }}
        />
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 pt-10 pb-10 sm:px-10 md:px-12 md:pt-16 lg:px-16 lg:pt-24">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <Logo src={logoDark} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
