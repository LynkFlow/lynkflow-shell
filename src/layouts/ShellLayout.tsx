import { Link, Outlet } from "react-router-dom";

// Nav bar for the Shell's own dev-only screens (Home, federation smoke
// test, 404). Auth screens don't use this -- they render bare (router.tsx).
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
