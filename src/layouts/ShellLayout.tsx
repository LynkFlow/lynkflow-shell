import { Link, Outlet } from "react-router-dom";

/**
 * Layout for the Shell's own dev-only screens (Home, the federation smoke
 * test, 404) -- the plain nav bar with Home/Login/Scratch links.
 *
 * Auth screens do NOT use this layout. They're real, standalone pre-session
 * screens (.claude/rules/auth.md) -- AuthLayout supplies their own logo, and
 * a second "LynkFlow" nav bar stacked above it duplicates that branding and
 * eats vertical space the 1440x1024 no-scroll design doesn't have room for.
 * Only this dev-only shell chrome wraps in the nav; auth routes render bare
 * (see app/router.tsx -- the auth routes sit outside this layout's
 * `<Route element={<ShellLayout />}>` wrapper).
 */
export function ShellLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <nav className="flex items-center gap-6 text-sm">
          <span className="font-semibold">LynkFlow</span>
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/scratch" className="hover:underline">
            Scratch (federation smoke test)
          </Link>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
