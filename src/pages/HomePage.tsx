export default function HomePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">LynkFlow Shell</h1>
      <p className="mt-2 text-sm text-neutral-700">
        Minimal Module Federation host: global routing and layout only, no
        domain business logic (.claude/rules/architecture.md). Use the
        "Scratch" link above to load a federated remote.
      </p>
    </div>
  );
}
