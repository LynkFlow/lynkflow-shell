interface LogoProps {
  src: string;
  alt?: string;
  height?: number;
  className?: string;
}

/** Not a `@lynkflow/ui-kit` component -- no branding/logo primitive there yet. */
export default function Logo({
  src,
  alt = "LynkFlow",
  height = 22,
  className = "",
}: LogoProps) {
  return <img src={src} alt={alt} style={{ height }} className={className} />;
}
