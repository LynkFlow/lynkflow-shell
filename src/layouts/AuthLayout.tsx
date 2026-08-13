import type { ReactNode } from "react";
import { Logo } from "@lynkflow/ui-kit";

import heroImage from "../assets/hero-image.png";

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
 *    `background-image` + `backgroundSize: "100% 100%"`, which stretched
 *    non-uniformly at any window height other than exactly 1024px.
 *    `object-cover` scales uniformly and crops instead, so it never
 *    distorts, at any height.
 * 4. Hero width is `48%` of the panel, not a fixed `700px` -- 700/1440 is
 *    ~48.6%, but a fixed pixel value doesn't track the *actual* window
 *    width the way the Figma's proportional split does, and read as too
 *    wide at real window sizes. `md:w-[48%]` scales with the panel instead.
 * 5. `hero-image.png` (the plain background graphic) replaces the earlier
 *    `Container.png`, which had the LynkFlow wordmark and tagline baked
 *    into the image pixels themselves. Both are now real DOM content
 *    layered on top of the image instead -- `@lynkflow/ui-kit`'s `Logo`
 *    (white mark + white wordmark, the `brand-logo.svg` combination per
 *    that component's own docs) top-left, and the marketing tagline
 *    bottom-left, matching the Figma's composition and letting both scale
 *    and stay crisp instead of being baked into a raster asset.
 * 6. No `Logo` above the form panel at `md`+ -- the Figma spec shows the
 *    logo only inside the hero panel, not repeated above "Welcome Back".
 *    Kept as a `md:hidden` fallback only, since the hero panel disappears
 *    below `md` and a mobile visitor would otherwise see no branding at
 *    all -- default (brand mark, dark wordmark) since it sits on white,
 *    not the hero image.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      {/* 48% of the panel per the Figma spec (700/1440), not a fixed pixel
          width -- see the docblock's point 4. */}
      <div className="relative hidden shrink-0 overflow-hidden md:block md:w-[48%]">
        <img
          src={heroImage}
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

        <div className="absolute inset-0 flex flex-col justify-between p-10 lg:p-14">
          <Logo markColor="white" textColor="white" />

          <p className="max-w-sm text-lg font-medium leading-relaxed text-white">
            The developer-broker operating system powering Egypt&apos;s real
            estate market. One link. Every deal.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 pt-10 pb-10 sm:px-10 md:px-12 md:pt-16 lg:px-16 lg:pt-24">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
