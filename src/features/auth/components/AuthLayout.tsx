import type { ReactNode } from "react";

import Logo from "./common/Logo";
import logoDark from "../../../assets/logo-dark.svg";
import heroBackground from "../../../assets/Container.png";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Not a `@lynkflow/ui-kit` component -- no page-shell/split-layout primitive
 * there yet, so this stays local. Shared by every auth screen
 * (login/signup/forgot-password/reset-password/activate-account).
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      <div
        className="relative hidden overflow-hidden p-10 md:flex md:w-1/3 md:flex-col md:justify-between lg:p-14"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,46,30,0.1), rgba(6,46,30,0.5)), url(${heroBackground})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 md:px-12 lg:px-16">
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
