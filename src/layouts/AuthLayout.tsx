import type { ReactNode } from "react";
import { Logo } from "@lynkflow/ui-kit";

import heroImage from "../assets/hero-background.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

/** Split hero/form layout shared by every auth screen. */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      {/* 48% width, object-cover: matches the Figma's proportional split
          without distorting at real window sizes. */}
      <div className="relative hidden shrink-0 overflow-hidden md:block md:w-[48%]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#00000033]" />

        <div className="absolute inset-0 flex flex-col justify-between p-10 lg:p-14">
          <Logo markColor="white" textColor="white" />

          <p className="max-w-sm text-lg font-medium leading-relaxed text-white">
            The developer-broker operating system powering Egypt&apos;s real estate
            market. One link. Every deal.
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
